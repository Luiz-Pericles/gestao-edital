
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Gestor de Editais</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Bem-vindo ao Gestor de Editais
                </h2>
                <p className="text-gray-600 mt-2">
                  Sistema de gerenciamento de editais de licitação
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full bg-blue-700 hover:bg-blue-800 text-lg py-6"
                  onClick={() => navigate("/criar-edital")}
                >
                  Criar Novo Edital
                </Button>
                <Button
                  className="w-full bg-gray-600 hover:bg-gray-700 text-lg py-6"
                  onClick={() => navigate("/visualizar-editais")}
                >
                  Visualizar Editais Gerados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-4">
        <div className="container mx-auto px-4 text-center">
          <p>Gestor de Editais © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
