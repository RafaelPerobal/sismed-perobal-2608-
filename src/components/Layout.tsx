
import React from 'react';
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

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Pacientes', href: '/pacientes', icon: Users },
    { name: 'Medicamentos', href: '/medicamentos', icon: Pill },
    { name: 'Receitas', href: '/receitas', icon: FileText },
  ];

  // Mock professional data - in real app this would come from context/state
  const professional = {
    name: 'Dr. João Silva',
    type: 'Médico',
    registry: 'CRM 12345-SP',
    specialty: 'Clínica Geral'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/b954f439-274b-409b-9378-b06f8008eb70.png" 
              alt="Prefeitura de Perobal" 
              className="h-12 w-auto"
            />
            <div className="border-l border-border pl-4">
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
                <div className="font-semibold">{professional.name}</div>
                <div className="text-sm opacity-90">
                  {professional.type} • {professional.registry}
                </div>
              </div>
              <button className="ml-4 p-2 hover:bg-medical-secondary/10 rounded-md transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border shadow-sm min-h-[calc(100vh-80px)]">
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
          <div className="mt-8 p-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-medical-success">
              <Activity className="h-4 w-4" />
              Sistema Online
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Perobal Health v3.0
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
