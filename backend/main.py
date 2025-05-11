from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from typing import List
import json
from docx import Document
from io import BytesIO
import pandas as pd

from services.document_processor import DocumentProcessor
from schemas.excel_schema import validate_excel_columns, get_missing_columns

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_table_info(table, index: int) -> dict:
    """Extrai informações relevantes de uma tabela do Word."""
    preview = []

    # Pegar até 5 linhas da tabela
    max_rows = min(5, len(table.rows))
    for row_idx in range(max_rows):
        row = table.rows[row_idx]
        # Pegar todas as células da linha
        row_cells = [cell.text.strip() for cell in row.cells]
        # Juntar células da linha com pipe para melhor visualização
        preview.append(" | ".join(filter(None, row_cells)))

    # Juntar as linhas com quebras de linha
    preview_text = "\n".join(preview)

    return {
        "id": index,
        "title": f"Tabela {index + 1}",
        "preview": preview_text,
        "selected": False
    }


@app.post("/identificar-tabelas/")
async def identificar_tabelas(termo_referencia: UploadFile = File(...)):
    try:
        # Validar tipo do arquivo
        if not termo_referencia.filename.endswith('.docx'):
            raise HTTPException(
                status_code=400,
                detail="Arquivo deve ser do tipo .docx"
            )

        content = await termo_referencia.read()
        doc = Document(BytesIO(content))

        # Extrair informações das tabelas
        tabelas = []
        for i, table in enumerate(doc.tables):
            table_info = extract_table_info(table, i)
            tabelas.append(table_info)

        return JSONResponse(content=tabelas)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/substituir-tabelas/")
async def substituir_tabelas(
    termo_referencia: UploadFile = File(...),
    tabela_itens: UploadFile = File(...),
    selected_tables: str = File(...)
):
    try:
        # Validar tipos dos arquivos
        if not termo_referencia.filename.endswith('.docx'):
            raise HTTPException(
                status_code=400,
                detail="Termo de referência deve ser um arquivo .docx"
            )
        if not tabela_itens.filename.endswith('.xlsx'):
            raise HTTPException(
                status_code=400,
                detail="Tabela de itens deve ser um arquivo .xlsx"
            )

        # Converter string de tabelas selecionadas para lista
        selected_indices = json.loads(selected_tables)

        # Ler conteúdo dos arquivos
        word_content = await termo_referencia.read()
        excel_content = await tabela_itens.read()

        # Processar documentos
        modified_doc, errors = DocumentProcessor.process_documents(
            word_content,
            excel_content,
            selected_indices
        )

        if errors:
            raise HTTPException(
                status_code=400,
                detail="; ".join(errors)
            )

        # Retornar o documento modificado
        return StreamingResponse(
            modified_doc,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f"attachment; filename=termo_referencia_modificado.docx"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/validar-excel/")
async def validar_excel(tabela_itens: UploadFile = File(...)):
    try:
        # Validar tipo do arquivo
        if not tabela_itens.filename.endswith('.xlsx'):
            raise HTTPException(
                status_code=400,
                detail="Arquivo deve ser do tipo .xlsx"
            )

        # Ler conteúdo do arquivo
        content = await tabela_itens.read()

        try:
            # Tentar ler o Excel
            df = pd.read_excel(BytesIO(content))
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail="Erro ao ler arquivo Excel. Verifique se o arquivo está corrompido ou no formato adequado."
            )

        # Validar colunas
        if not validate_excel_columns(df.columns):
            missing = get_missing_columns(df.columns)
            raise HTTPException(
                status_code=400,
                detail=f"Colunas obrigatórias faltando: {', '.join(missing)}"
            )

        return JSONResponse(content={"message": "Arquivo válido", "valid": True})

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def read_root():
    return {"message": "API de Processamento de Documentos está funcionando!"}
