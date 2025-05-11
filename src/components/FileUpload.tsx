
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";

interface FileUploadProps {
  acceptedTypes: string;
  onFileUpload: (file: File | null) => void;
  currentFile: File | null;
}

const FileUpload = ({ acceptedTypes, onFileUpload, currentFile }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileUpload(file);
  };

  const clearFile = () => {
    onFileUpload(null);
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
        >
          <Upload className="h-5 w-5" />
          <span>Clique para fazer upload</span>
          <span className="text-xs text-muted-foreground">
            {acceptedTypes.replace(/\./g, '').toUpperCase()}
          </span>
        </Button>
      ) : (
        <div className="border rounded-md p-3 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium truncate max-w-[200px]">
              {currentFile.name}
            </span>
            <span className="text-xs text-muted-foreground">
              ({Math.round(currentFile.size / 1024)} KB)
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={clearFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
