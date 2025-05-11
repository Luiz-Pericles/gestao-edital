
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CriarEdital from "./pages/CriarEdital";
import IdentificarTabelas from "./pages/IdentificarTabelas";
import Resultado from "./pages/Resultado";
import VisualizarEditais from "./pages/VisualizarEditais";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/criar-edital" element={<CriarEdital />} />
          <Route path="/identificar-tabelas" element={<IdentificarTabelas />} />
          <Route path="/resultado" element={<Resultado />} />
          <Route path="/visualizar-editais" element={<VisualizarEditais />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
