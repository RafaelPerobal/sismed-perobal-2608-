
import React from 'react';
import { Users, Pill, FileText, Plus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  // Mock data - in real app this would come from localStorage/API
  const stats = {
    patients: 1250,
    medications: 89,
    prescriptions: 456
  };

  const recentPrescriptions = [
    {
      id: 'RX001',
      patient: 'Maria da Silva',
      date: '2024-08-26',
      medications: 2,
      status: 'Emitida'
    },
    {
      id: 'RX002', 
      patient: 'João Santos',
      date: '2024-08-26',
      medications: 1,
      status: 'Emitida'
    },
    {
      id: 'RX003',
      patient: 'Ana Costa',
      date: '2024-08-25',
      medications: 3,
      status: 'Emitida'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-medical-primary">
              Dashboard SISMED
            </h1>
            <p className="text-muted-foreground mt-1">
              Sistema de Saúde Municipal de Perobal
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/pacientes')}
              className="btn-medical-success"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
            <Button 
              onClick={() => navigate('/receitas')}
              className="btn-medical-primary"
            >
              <FileText className="h-4 w-4 mr-2" />
              Nova Receita
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total de Pacientes"
            value={stats.patients}
            icon={Users}
            onClick={() => navigate('/pacientes')}
          />
          <StatsCard
            title="Total de Medicamentos"
            value={stats.medications}
            icon={Pill}
            onClick={() => navigate('/medicamentos')}
          />
          <StatsCard
            title="Receitas Emitidas"
            value={stats.prescriptions}
            icon={FileText}
            onClick={() => navigate('/receitas')}
          />
        </div>

        {/* Recent Prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-medical-primary" />
              Receitas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="medical-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Paciente</th>
                    <th>Data</th>
                    <th>Medicamentos</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPrescriptions.map((prescription) => (
                    <tr key={prescription.id}>
                      <td className="font-mono text-medical-primary">
                        {prescription.id}
                      </td>
                      <td className="font-medium">{prescription.patient}</td>
                      <td>
                        {new Date(prescription.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td>
                        <span className="bg-medical-secondary/20 text-medical-primary px-2 py-1 rounded-full text-xs">
                          {prescription.medications} medicamento(s)
                        </span>
                      </td>
                      <td>
                        <span className="bg-medical-success/20 text-medical-success px-2 py-1 rounded-full text-xs">
                          {prescription.status}
                        </span>
                      </td>
                      <td>
                        <Button variant="outline" size="sm">
                          Reimprimir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/pacientes')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-medical-success/20 rounded-full">
                  <Users className="h-6 w-6 text-medical-success" />
                </div>
                <div>
                  <h3 className="font-semibold">Gerenciar Pacientes</h3>
                  <p className="text-sm text-muted-foreground">
                    Cadastrar, editar e buscar pacientes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/medicamentos')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-medical-primary/20 rounded-full">
                  <Pill className="h-6 w-6 text-medical-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Gerenciar Medicamentos</h3>
                  <p className="text-sm text-muted-foreground">
                    Cadastrar e editar medicamentos do sistema
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
