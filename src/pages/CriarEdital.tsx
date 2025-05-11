import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import FileUpload from "@/components/FileUpload";

const CriarEdital = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    numero: "",
    modalidade: "",
    data: "",
    objeto: "",
  });
  const [termoReferencia, setTermoReferencia] = useState<File | null>(null);
  const [tabelaItens, setTabelaItens] = useState<File | null>(null);
  const [isExcelValid, setIsExcelValid] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      modalidade: value
    });
  };

  const handleTermoUpload = (file: File | null) => {
    setTermoReferencia(file);
    if (file) {
      toast.success(`Arquivo carregado: ${file.name}`);
    }
  };

  const handleTabelaUpload = (file: File | null, isValid: boolean = false) => {
    setTabelaItens(file);
    setIsExcelValid(isValid);
    if (file && isValid) {
      toast.success(`Arquivo carregado: ${file.name}`);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.nome || !formData.numero || !formData.modalidade ||
      !formData.data || !formData.objeto || !termoReferencia || !tabelaItens) {
      toast.error("Por favor, preencha todos os campos e faça o upload dos arquivos necessários.");
      return;
    }

    // Validate Excel file
    if (!isExcelValid) {
      toast.error("A planilha Excel não está no formato correto. Por favor, verifique e tente novamente.");
      return;
    }

    setLoading(true);

    try {
      // Store files and form data in session storage
      sessionStorage.setItem("editalFormData", JSON.stringify(formData));

      // Convert files to Base64 and store them
      const termoReader = new FileReader();
      const tabelaReader = new FileReader();

      termoReader.onload = function () {
        sessionStorage.setItem("termoReferencia", JSON.stringify({
          name: termoReferencia?.name,
          content: termoReader.result
        }));
      };

      tabelaReader.onload = function () {
        sessionStorage.setItem("tabelaItens", JSON.stringify({
          name: tabelaItens?.name,
          content: tabelaReader.result
        }));

        // Navigate after both files are stored
        toast.success("Arquivos carregados com sucesso!");
        navigate("/identificar-tabelas");
      };

      // Read the files
      termoReader.readAsDataURL(termoReferencia as File);
      tabelaReader.readAsDataURL(tabelaItens as File);

    } catch (error) {
      console.error("Erro:", error);
      toast.error("Ocorreu um erro ao processar os arquivos. Tente novamente.");
    } finally {
      setLoading(false);
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
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Criar Novo Edital</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do processo</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Digite o nome do processo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="numero">Número do processo</Label>
                  <Input
                    id="numero"
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    placeholder="Ex: 001/2025"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="modalidade">Modalidade da licitação</Label>
                  <Select
                    value={formData.modalidade}
                    onValueChange={handleSelectChange}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pregao_eletronico">Pregão Eletrônico</SelectItem>
                      <SelectItem value="pregao_presencial">Pregão Presencial</SelectItem>
                      <SelectItem value="concorrencia">Concorrência</SelectItem>
                      <SelectItem value="tomada_precos">Tomada de Preços</SelectItem>
                      <SelectItem value="convite">Convite</SelectItem>
                      <SelectItem value="leilao">Leilão</SelectItem>
                      <SelectItem value="concurso">Concurso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="data">Data de abertura</Label>
                  <Input
                    id="data"
                    name="data"
                    type="date"
                    value={formData.data}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="objeto">Objeto da contratação</Label>
                  <Textarea
                    id="objeto"
                    name="objeto"
                    value={formData.objeto}
                    onChange={handleInputChange}
                    placeholder="Descreva o objeto da contratação"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload do Termo de Referência (.docx)</Label>
                  <FileUpload
                    acceptedTypes={".docx,.doc"}
                    onFileUpload={handleTermoUpload}
                    currentFile={termoReferencia}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload da Tabela de Itens (.xlsx)</Label>
                  <FileUpload
                    acceptedTypes={".xlsx,.xls"}
                    onFileUpload={handleTabelaUpload}
                    currentFile={tabelaItens}
                    validateFile={true}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2 inline-block" /> : "Próximo"}
                </Button>
              </div>
            </form>
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

export default CriarEdital;
