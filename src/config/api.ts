// URLs da API
const API_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  IDENTIFICAR_TABELAS: `${API_URL}/identificar-tabelas/`,
  SUBSTITUIR_TABELAS: `${API_URL}/substituir-tabelas/`,
  VALIDAR_EXCEL: `${API_URL}/validar-excel/`,
} as const;

export default API_ENDPOINTS;
