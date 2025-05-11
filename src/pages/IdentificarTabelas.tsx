import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface TableInfo {
  id: number;
  title: string;
  preview: string;
  selected: boolean;
}

const IdentificarTabelas = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [termoReferencia, setTermoReferencia] = useState<any>(null);
  const [tabelaItens, setTabelaItens] = useState<any>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);

  useEffect(() => {
    // Retrieve data from session storage
    const storedFormData = sessionStorage.getItem("editalFormData");
    const storedTermoReferencia = sessionStorage.getItem("termoReferencia");
    const storedTabelaItens = sessionStorage.getItem("tabelaItens");

    if (!storedFormData || !storedTermoReferencia || !storedTabelaItens) {
      toast.error("Dados não encontrados. Por favor, preencha o formulário novamente.");
      navigate("/criar-edital");
      return;
    }

    setFormData(JSON.parse(storedFormData));
    setTermoReferencia(JSON.parse(storedTermoReferencia));
    setTabelaItens(JSON.parse(storedTabelaItens));

    // Identificar tabelas no documento
    identificarTabelasNoDocumento(JSON.parse(storedTermoReferencia));
  }, [navigate]);

  const identificarTabelasNoDocumento = async (termoRef: any) => {
    try {
      // Criar um Blob a partir do Base64 do arquivo
      const content = atob(termoRef.content.split(',')[1]);
      const bytes = new Uint8Array(content.length);
      for (let i = 0; i < content.length; i++) {
        bytes[i] = content.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

      // Criar FormData com o arquivo
      const formData = new FormData();
      formData.append('termo_referencia', blob, termoRef.name);

      // Enviar para o backend identificar as tabelas
      const response = await fetch('http://localhost:8000/identificar-tabelas/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erro ao identificar tabelas: ${response.status}`);
      }

      const tabelas = await response.json();
      setTables(tabelas.map((tabela: any) => ({
        ...tabela,
        selected: false
      })));

      toast.success("Tabelas identificadas com sucesso!");
    } catch (error) {
      console.error("Erro ao identificar tabelas:", error);
      toast.error("Erro ao identificar tabelas no documento");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (tableId: number) => {
    setTables(tables.map(table =>
      table.id === tableId ? { ...table, selected: !table.selected } : table
    ));
  };

  const handleSubmit = async () => {
    // Check if at least one table is selected
    if (!tables.some(table => table.selected)) {
      toast.error("Selecione pelo menos uma tabela para substituir");
      return;
    }

    setProcessing(true);

    try {
      // Preparar os dados para envio
      const selectedTableIds = tables
        .filter(table => table.selected)
        .map(table => table.id);

      // Criar FormData com os arquivos e dados
      const formData = new FormData();

      // Adicionar o termo de referência
      const termoContent = atob(termoReferencia.content.split(',')[1]);
      const termoBytes = new Uint8Array(termoContent.length);
      for (let i = 0; i < termoContent.length; i++) {
        termoBytes[i] = termoContent.charCodeAt(i);
      }
      const termoBlob = new Blob([termoBytes], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      formData.append('termo_referencia', termoBlob, termoReferencia.name);

      // Adicionar a tabela de itens
      const tabelaContent = atob(tabelaItens.content.split(',')[1]);
      const tabelaBytes = new Uint8Array(tabelaContent.length);
      for (let i = 0; i < tabelaContent.length; i++) {
        tabelaBytes[i] = tabelaContent.charCodeAt(i);
      }
      const tabelaBlob = new Blob([tabelaBytes], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      formData.append('tabela_itens', tabelaBlob, tabelaItens.name);

      // Adicionar os IDs das tabelas selecionadas
      formData.append('selected_tables', JSON.stringify(selectedTableIds));

      // Enviar para processamento
      const response = await fetch('http://localhost:8000/substituir-tabelas/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erro ao processar documento: ${response.status}`);
      }

      // Armazenar o arquivo modificado em session storage
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = function () {
        sessionStorage.setItem('documentoProcessado', JSON.stringify({
          content: reader.result,
          name: 'documento_processado.docx'
        }));
        navigate('/resultado');
      };
      reader.readAsDataURL(blob);

      toast.success("Documento processado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Ocorreu um erro ao processar o documento");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center">
          <Button
            variant="ghost"
            className="text-white mr-4"
            onClick={() => navigate("/criar-edital")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Identificar Tabelas</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto shadow-lg">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Tabelas Identificadas no Documento</h2>
              <p className="text-gray-600">
                Selecione as tabelas que devem ser substituídas pela tabela de itens carregada.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {termoReferencia?.name}
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {tabelaItens?.name}
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {loading ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                <p className="text-gray-600">Analisando documento e identificando tabelas...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <Checkbox
                          id={`table-${table.id}`}
                          checked={table.selected}
                          onCheckedChange={() => handleCheckboxChange(table.id)}
                        />
                      </div>
                      <div className="flex-grow">
                        <label
                          htmlFor={`table-${table.id}`}
                          className="font-medium cursor-pointer block"
                        >
                          {table.title}
                        </label>
                        <div className="mt-2 bg-gray-100 p-3 rounded text-sm">
                          <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <Table className="h-4 w-4" />
                            <span>Pré-visualização:</span>
                          </div>
                          {table.preview}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-6">
                  <Button
                    className="w-full bg-blue-700 hover:bg-blue-800"
                    onClick={handleSubmit}
                    disabled={processing}
                  >
                    {processing ? (
                      <>Processando...</>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Substituir Tabelas e Gerar Edital
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-3">
        <div className="container mx-auto px-4 text-center">
          <p>Gestor de Editais © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default IdentificarTabelas;
