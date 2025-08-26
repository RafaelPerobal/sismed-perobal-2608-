
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Identificacao from "./pages/Identificacao";
import Index from "./pages/Index";
import Pacientes from "./pages/Pacientes";
import Medicamentos from "./pages/Medicamentos";
import Receitas from "./pages/Receitas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para proteger rotas que necessitam de identificação
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isIdentified, setIsIdentified] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIdentification = () => {
      const currentProfessional = sessionStorage.getItem('sismed-current-professional');
      setIsIdentified(!!currentProfessional);
    };

    checkIdentification();
  }, []);

  if (isIdentified === null) {
    return <div>Carregando...</div>;
  }

  if (!isIdentified) {
    return <Navigate to="/identificacao" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/identificacao" element={<Identificacao />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/pacientes" element={
            <ProtectedRoute>
              <Pacientes />
            </ProtectedRoute>
          } />
          <Route path="/medicamentos" element={
            <ProtectedRoute>
              <Medicamentos />
            </ProtectedRoute>
          } />
          <Route path="/receitas" element={
            <ProtectedRoute>
              <Receitas />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
