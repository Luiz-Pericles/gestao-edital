
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

// Mock tables that would be detected from the document
const mockTables = [
  {
    id: 1,
    title: "Tabela 1 - Itens de Material de Escritório",
    preview: "Caneta, Papel, Grampeador...",
    selected: false
  },
  {
    id: 2,
    title: "Tabela 2 - Cronograma de Entrega",
    preview: "30 dias, 60 dias, 90 dias...",
    selected: false
  },
  {
    id: 3,
    title: "Tabela 3 - Valores Estimados",
    preview: "R$ 10.000,00, R$ 15.000,00...",
    selected: false
  },
  {
    id: 4,
    title: "Tabela 4 - Especificações Técnicas",
    preview: "Modelo A, Tipo B, Versão 2.0...",
    selected: false
  }
];

const IdentificarTabelas = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [termoReferencia, setTermoReferencia] = useState("");
  const [tabelaItens, setTabelaItens] = useState("");
  const [tables, setTables] = useState(mockTables);

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
    setTermoReferencia(storedTermoReferencia);
    setTabelaItens(storedTabelaItens);
    
    // Mock loading of tables
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Tabelas identificadas com sucesso!");
    }, 1500);
  }, [navigate]);

  const handleCheckboxChange = (tableId: number) => {
    setTables(tables.map(table => 
      table.id === tableId ? { ...table, selected: !table.selected } : table
    ));
  };

  const handleSubmit = () => {
    // Check if at least one table is selected
    if (!tables.some(table => table.selected)) {
      toast.error("Selecione pelo menos uma tabela para substituir");
      return;
    }
    
    setLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      setLoading(false);
      navigate("/resultado");
    }, 2000);
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
                  {termoReferencia}
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {tabelaItens}
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
                    disabled={loading}
                  >
                    {loading ? (
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
