
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Pill, 
  FileText, 
  User,
  LogOut,
  Activity
} from 'lucide-react';
import { initializeData } from '../utils/dataSeed';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    initializeData();
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Pacientes', href: '/pacientes', icon: Users },
    { name: 'Medicamentos', href: '/medicamentos', icon: Pill },
    { name: 'Receitas', href: '/receitas', icon: FileText },
  ];

  const professional = {
    name: 'Dr. João Silva',
    type: 'Médico',
    registry: 'CRM 12345-SP',
    specialty: 'Clínica Geral'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b-2 border-medical-warning shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/b954f439-274b-409b-9378-b06f8008eb70.png" 
              alt="Prefeitura de Perobal" 
              className="h-12 w-auto"
            />
            <div className="border-l-2 border-medical-warning pl-4">
              <img 
                src="/lovable-uploads/013137d0-d9de-4ac8-b7de-d43bb3463c78.png" 
                alt="SISMED" 
                className="h-10 w-auto"
              />
            </div>
          </div>
          
          <div className="professional-header">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5" />
              <div>
                <div className="font-semibold text-white">{professional.name}</div>
                <div className="text-sm opacity-90 text-white">
                  {professional.type} • {professional.registry}
                </div>
              </div>
              <button className="ml-4 p-2 hover:bg-white/10 rounded-md transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-medical-primary border-r-2 border-medical-warning shadow-sm min-h-[calc(100vh-80px)]">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`medical-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* System Status */}
          <div className="mt-8 p-4 border-t-2 border-white/20">
            <div className="flex items-center gap-2 text-sm text-green-300">
              <Activity className="h-4 w-4" />
              Sistema Online
            </div>
            <div className="text-xs text-white/70 mt-1">
              SISMED Perobal v3.0
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
