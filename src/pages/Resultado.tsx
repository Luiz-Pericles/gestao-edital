
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileDown, CheckCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const Resultado = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // Retrieve form data from session storage
    const storedFormData = sessionStorage.getItem("editalFormData");
    
    if (!storedFormData) {
      toast.error("Dados não encontrados. O processo não foi concluído corretamente.");
      navigate("/criar-edital");
      return;
    }
    
    setFormData(JSON.parse(storedFormData));
    
    // Show success toast
    toast.success("Edital gerado com sucesso!");
  }, [navigate]);

  const handleDownload = (fileType: string) => {
    // Simulate file download
    toast.info(`Iniciando download: ${fileType}`);
    
    // In a real implementation, this would trigger an actual file download
    setTimeout(() => {
      toast.success(`Download de ${fileType} concluído!`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center">
          <Button 
            variant="ghost" 
            className="text-white mr-4" 
            onClick={() => navigate("/identificar-tabelas")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Resultado</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
          <CardContent className="p-6">
            <div className="text-center mb-8">
              <div className="inline-flex justify-center items-center p-4 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-600">Edital gerado com sucesso!</h2>
              <p className="text-gray-600 mt-2">
                Os arquivos do edital foram processados e estão prontos para download
              </p>
            </div>
            
            <div className="bg-gray-50 border rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-800 mb-2">Detalhes do Edital</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Nome do processo</p>
                  <p className="font-medium">{formData.nome}</p>
                </div>
                <div>
                  <p className="text-gray-500">Número</p>
                  <p className="font-medium">{formData.numero}</p>
                </div>
                <div>
                  <p className="text-gray-500">Modalidade</p>
                  <p className="font-medium">
                    {formData.modalidade?.replace("_", " ")?.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Data de abertura</p>
                  <p className="font-medium">
                    {new Date(formData.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-8">
              <h3 className="font-medium text-gray-800">Arquivos para Download</h3>
              
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4 border-gray-300"
                onClick={() => handleDownload("Edital Final")}
              >
                <div className="flex items-center">
                  <FileDown className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Edital Final</p>
                    <p className="text-xs text-gray-500">Documento .docx</p>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4 border-gray-300"
                onClick={() => handleDownload("Termo de Referência Editado")}
              >
                <div className="flex items-center">
                  <FileDown className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Termo de Referência Editado</p>
                    <p className="text-xs text-gray-500">Documento .docx</p>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4 border-gray-300"
                onClick={() => handleDownload("Tabela de Itens Tratada")}
              >
                <div className="flex items-center">
                  <FileDown className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Tabela de Itens Tratada</p>
                    <p className="text-xs text-gray-500">Planilha .xlsx</p>
                  </div>
                </div>
              </Button>
            </div>
            
            <Button 
              className="w-full bg-blue-700 hover:bg-blue-800 text-lg h-12"
              onClick={() => navigate("/")}
            >
              <Home className="mr-2 h-5 w-5" /> 
              Voltar ao Início
            </Button>
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

export default Resultado;
