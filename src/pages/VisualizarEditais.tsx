
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for editais
const mockEditais = [
  {
    id: "001",
    nome: "Contratação de serviços de limpeza",
    numero: "001/2025",
    modalidade: "PREGÃO ELETRÔNICO",
    data: "2025-02-15",
    status: "Concluído"
  },
  {
    id: "002",
    nome: "Aquisição de material de escritório",
    numero: "002/2025",
    modalidade: "PREGÃO ELETRÔNICO",
    data: "2025-03-10",
    status: "Concluído"
  },
  {
    id: "003",
    nome: "Contratação de serviços de vigilância",
    numero: "003/2025",
    modalidade: "CONCORRÊNCIA",
    data: "2025-04-05",
    status: "Concluído"
  }
];

const VisualizarEditais = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [editais, setEditais] = useState(mockEditais);
  const [filteredEditais, setFilteredEditais] = useState(mockEditais);

  // Filter editais on search term change
  useEffect(() => {
    const filtered = editais.filter(
      (edital) =>
        edital.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        edital.numero.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEditais(filtered);
  }, [searchTerm, editais]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleView = (id: string) => {
    toast.info(`Visualizando edital ${id}`);
    // In a real app, this would navigate to a details page
  };

  const handleDownload = (id: string) => {
    toast.success(`Edital ${id} baixado com sucesso!`);
    // In a real app, this would trigger a file download
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center">
          <Button 
            variant="ghost" 
            className="text-white mr-4" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Visualizar Editais Gerados</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full shadow-lg">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Pesquisar por nome ou número do edital..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Modalidade</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEditais.length > 0 ? (
                    filteredEditais.map((edital) => (
                      <TableRow key={edital.id}>
                        <TableCell className="font-medium">{edital.numero}</TableCell>
                        <TableCell className="max-w-xs truncate">{edital.nome}</TableCell>
                        <TableCell>{edital.modalidade}</TableCell>
                        <TableCell>{new Date(edital.data).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {edital.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(edital.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(edital.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        <FileText className="mx-auto h-8 w-8 mb-2 text-gray-400" />
                        Nenhum edital encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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

export default VisualizarEditais;
