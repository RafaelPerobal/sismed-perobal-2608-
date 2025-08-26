
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, User } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  cep: string;
}

const Pacientes = () => {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Maria da Silva Santos',
      cpf: '123.456.789-00',
      birthDate: '1985-03-15',
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123',
      city: 'Perobal',
      state: 'PR',
      cep: '87990-000'
    },
    {
      id: '2',
      name: 'João Carlos Oliveira',
      cpf: '987.654.321-00',
      birthDate: '1978-07-22',
      phone: '(11) 88888-8888',
      address: 'Av. Principal, 456',
      city: 'Perobal',
      state: 'PR',
      cep: '87990-000'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  const [formData, setFormData] = useState<Omit<Patient, 'id'>>({
    name: '',
    cpf: '',
    birthDate: '',
    phone: '',
    address: '',
    city: 'Perobal',
    state: 'PR',
    cep: ''
  });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm)
  );

  const resetForm = () => {
    setFormData({
      name: '',
      cpf: '',
      birthDate: '',
      phone: '',
      address: '',
      city: 'Perobal',
      state: 'PR',
      cep: ''
    });
    setEditingPatient(null);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      cpf: patient.cpf,
      birthDate: patient.birthDate,
      phone: patient.phone,
      address: patient.address,
      city: patient.city,
      state: patient.state,
      cep: patient.cep
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      setPatients(patients.filter(p => p.id !== id));
      toast.success('Paciente excluído com sucesso!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPatient) {
      setPatients(patients.map(p => 
        p.id === editingPatient.id 
          ? { ...formData, id: editingPatient.id }
          : p
      ));
      toast.success('Paciente atualizado com sucesso!');
    } else {
      const newPatient: Patient = {
        ...formData,
        id: Date.now().toString()
      };
      setPatients([...patients, newPatient]);
      toast.success('Paciente cadastrado com sucesso!');
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-medical-primary">
              Gestão de Pacientes
            </h1>
            <p className="text-muted-foreground mt-1">
              Cadastre e gerencie os pacientes do sistema
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="btn-medical-success"
                onClick={resetForm}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="medical-form-group">
                    <Label className="medical-form-label">Nome Completo *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="medical-form-group">
                    <Label className="medical-form-label">CPF *</Label>
                    <Input
                      value={formData.cpf}
                      onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="medical-form-group">
                    <Label className="medical-form-label">Data de Nascimento *</Label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="medical-form-group">
                    <Label className="medical-form-label">Telefone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div className="medical-form-group">
                  <Label className="medical-form-label">Endereço</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Rua, número, complemento"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="medical-form-group">
                    <Label className="medical-form-label">Cidade</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  
                  <div className="medical-form-group">
                    <Label className="medical-form-label">Estado</Label>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      maxLength={2}
                    />
                  </div>
                  
                  <div className="medical-form-group">
                    <Label className="medical-form-label">CEP</Label>
                    <Input
                      value={formData.cep}
                      onChange={(e) => setFormData({...formData, cep: e.target.value})}
                      placeholder="00000-000"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="btn-medical-primary">
                    {editingPatient ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-medical-primary" />
              Pacientes Cadastrados ({filteredPatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="medical-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Idade</th>
                    <th>Telefone</th>
                    <th>Cidade</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="font-medium">{patient.name}</td>
                      <td className="font-mono">{patient.cpf}</td>
                      <td>{calculateAge(patient.birthDate)} anos</td>
                      <td>{patient.phone}</td>
                      <td>{patient.city}/{patient.state}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(patient)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(patient.id)}
                            className="text-medical-danger hover:text-medical-danger"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Pacientes;
