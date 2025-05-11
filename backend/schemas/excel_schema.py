from typing import List

REQUIRED_COLUMNS = ['N', 'DESCRIÇÃO',
                    'UNIDADE FORNECIMENTO', 'QUANTIDADE', 'VALOR ESTIMADO']


def validate_excel_columns(df_columns: List[str]) -> bool:
    """
    Valida se todas as colunas obrigatórias estão presentes no DataFrame.
    """
    return all(col in df_columns for col in REQUIRED_COLUMNS)


def get_missing_columns(df_columns: List[str]) -> List[str]:
    """
    Retorna lista de colunas obrigatórias que estão faltando.
    """
    return [col for col in REQUIRED_COLUMNS if col not in df_columns]
