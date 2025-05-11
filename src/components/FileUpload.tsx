import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  acceptedTypes: string;
  onFileUpload: (file: File | null, isValid?: boolean) => void;
  currentFile: File | null;
  validateFile?: boolean;
}

const FileUpload = ({
  acceptedTypes,
  onFileUpload,
  currentFile,
  validateFile = false
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateExcel = async (file: File) => {
    setIsValidating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('tabela_itens', file);

      const response = await fetch('http://localhost:8000/validar-excel/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao validar arquivo');
      }

      const data = await response.json();
      toast.success("Arquivo válido!");
      onFileUpload(file, true);
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao validar arquivo';
      setError(message);
      toast.error(message);
      onFileUpload(file, false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && validateFile) {
      await validateExcel(file);
    } else if (file) {
      onFileUpload(file, true);
    }
  };

  const clearFile = () => {
    onFileUpload(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        ref={fileInputRef}
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
      />

      {!currentFile ? (
        <Button
          type="button"
          variant="outline"
          className="border-dashed border-2 h-24 flex flex-col items-center justify-center gap-2"
          onClick={handleClick}
          disabled={isValidating}
        >
          {isValidating ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
              <span>Validando arquivo...</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              <span>Clique para fazer upload</span>
              <span className="text-xs text-muted-foreground">
                {acceptedTypes.replace(/\./g, '').toUpperCase()}
              </span>
            </>
          )}
        </Button>
      ) : (
        <div className={`flex items-center justify-between p-4 border rounded-lg ${error ? 'border-red-500 bg-red-50' : ''}`}>
          <div className="flex items-center gap-3">
            {error ? (
              <AlertCircle className="h-8 w-8 text-red-500" />
            ) : (
              <FileText className="h-8 w-8 text-blue-500" />
            )}
            <div>
              <p className="font-medium">{currentFile.name}</p>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearFile}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
