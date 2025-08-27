import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Pill, FileText, LogOut, User, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
interface ProfessionalData {
  type: string;
  name: string;
  registry: string;
  healthUnit: string;
}
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState<ProfessionalData | null>(null);
  useEffect(() => {
    const professionalData = sessionStorage.getItem('sismed-current-professional');
    if (professionalData) {
      setProfessional(JSON.parse(professionalData));
    }
  }, []);
  const handleLogout = () => {
    sessionStorage.removeItem('sismed-current-professional');
    toast.success('Sessão encerrada com sucesso!');
    navigate('/identificacao');
  };
  const menuItems = [{
    path: '/',
    icon: Home,
    label: 'Dashboard'
  }, {
    path: '/pacientes',
    icon: Users,
    label: 'Pacientes'
  }, {
    path: '/medicamentos',
    icon: Pill,
    label: 'Medicamentos'
  }, {
    path: '/receitas',
    icon: FileText,
    label: 'Receitas'
  }];
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-medical-warning shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <img src="/lovable-uploads/b954f439-274b-409b-9378-b06f8008eb70.png" alt="Prefeitura de Perobal" className="h-12" />
            
            <div>
              <h1 className="text-xl font-bold text-medical-primary">
                SISMED Perobal
              </h1>
              <p className="text-sm text-gray-600">
                Sistema de Saúde Municipal
              </p>
            </div>
          </div>

          {professional && <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <User className="h-4 w-4" />
                  {professional.name}
                </div>
                <div className="text-xs text-gray-600">
                  {professional.type}
                  {professional.registry && ` • ${professional.registry}`}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Building2 className="h-3 w-3" />
                  {professional.healthUnit}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                <LogOut className="h-4 w-4 mr-1" />
                Sair
              </Button>
            </div>}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r-2 border-medical-warning min-h-[calc(100vh-80px)] p-4">
          <nav className="space-y-2">
            {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-medical-primary text-white' : 'text-gray-700 hover:bg-medical-warning/10 hover:text-medical-primary'}`}>
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>;
          })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>;
};
export default Layout;