
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Pill, AlertTriangle } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface Medication {
  id: string;
  name: string;
  activeIngredient: string;
  concentration: string;
  pharmaceuticalForm: string;
  manufacturer: string;
  isControlled: boolean;
  controlType?: string;
}

const Medicamentos = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      activeIngredient: 'Paracetamol',
      concentration: '500mg',
      pharmaceuticalForm: 'Comprimido',
      manufacturer: 'EMS',
      isControlled: false
    },
    {
      id: '2',
      name: 'Amoxicilina 500mg',
      activeIngredient: 'Amoxicilina',
      concentration: '500mg',
      pharmaceuticalForm: 'Cápsula',
      manufacturer: 'Medley',
      isControlled: false
    },
    {
      id: '3',
      name: 'Clonazepam 2mg',
      activeIngredient: 'Clonazepam',
      concentration: '2mg',
      pharmaceuticalForm: 'Comprimido',
      manufacturer: 'Roche',
      isControlled: true,
      controlType: 'B1'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  
  const [formData, setFormData] = useState<Omit<Medication, 'id'>>({
    name: '',
    activeIngredient: '',
    concentration: '',
    pharmaceuticalForm: '',
    manufacturer: '',
    isControlled: false,
    controlType: ''
  });

  const pharmaceuticalForms = [
    'Comprimido',
    'Cápsula',
    'Xarope',
    'Suspensão',
    'Solução',
    'Pomada',
    'Creme',
    'Gel',
    'Supositório',
    'Injetável'
  ];

  const controlTypes = [
    'A1 - Entorpecentes',
    'A2 - Entorpecentes',
    'A3 - Psicotrópicos',
    'B1 - Psicotrópicos',
    'B2 - Psicotrópicos',
    'C1 - Outras Substâncias',
    'C2 - Retinóicos',
    'C3 - Imunossupressores'
  ];

  const filteredMedications = medications.filter(medication =>
    medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      activeIngredient: '',
      concentration: '',
      pharmaceuticalForm: '',
      manufacturer: '',
      isControlled: false,
      controlType: ''
    });
    setEditingMedication(null);
  };

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setFormData({
      name: medication.name,
      activeIngredient: medication.activeIngredient,
      concentration: medication.concentration,
      pharmaceuticalForm: medication.pharmaceuticalForm,
      manufacturer: medication.manufacturer,
      isControlled: medication.isControlled,
      controlType: medication.controlType || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este medicamento?')) {
      setMedications(medications.filter(m => m.id !== id));
      toast.success('Medicamento excluído com sucesso!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMedication) {
      setMedications(medications.map(m => 
        m.id === editingMedication.id 
          ? { ...formData, id: editingMedication.id }
          : m
      ));
      toast.success('Medicamento atualizado com sucesso!');
    } else {
      const newMedication: Medication = {
        ...formData,
        id: Date.now().toString()
      };
      setMedications([...medications, newMedication]);
      toast.success('Medicamento cadastrado com sucesso!');
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-medical-primary">
              Gestão de Medicamentos
            </h1>
            <p className="text-muted-foreground mt-1">
              Cadastre e gerencie os medicamentos do sistema
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="btn-medical-success"
                onClick={resetForm}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Medicamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingMedication ? 'Editar Medicamento' : 'Novo Medicamento'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="medical-form-group">
                    <Label className="medical-form-label">Nome Comercial *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Paracetamol 500mg"
                      required
                    />
                  </div>
                  
                  <div className="medical-form-group">
                    <Label className="medical-form-label">Princípio Ativo *</Label>
                    <Input
                      value={formData.activeIngredient}
                      onChange={(e) => setFormData({...formData, activeIngredient: e.target.value})}
                      placeholder="Ex: Paracetamol"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="medical-form-group">
                    <Label className="medical-form-label">Concentração *</Label>
                    <Input
                      value={formData.concentration}
                      onChange={(e) => setFormData({...formData, concentration: e.target.value})}
                      placeholder="Ex: 500mg, 5mg/ml"
                      required
                    />
                  </div>
                  
                  <div className="medical-form-group">
                    <Label className="medical-form-label">Forma Farmacêutica *</Label>
                    <Select 
                      value={formData.pharmaceuticalForm} 
                      onValueChange={(value) => setFormData({...formData, pharmaceuticalForm: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a forma" />
                      </SelectTrigger>
                      <SelectContent>
                        {pharmaceuticalForms.map(form => (
                          <SelectItem key={form} value={form}>{form}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="medical-form-group">
                  <Label className="medical-form-label">Fabricante</Label>
                  <Input
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                    placeholder="Ex: EMS, Medley, Eurofarma"
                  />
                </div>

                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="controlled"
                      checked={formData.isControlled}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData, 
                          isControlled: checked as boolean,
                          controlType: checked ? formData.controlType : ''
                        })
                      }
                    />
                    <Label htmlFor="controlled" className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-medical-warning" />
                      Medicamento Controlado
                    </Label>
                  </div>
                  
                  {formData.isControlled && (
                    <div className="medical-form-group">
                      <Label className="medical-form-label">Tipo de Controle *</Label>
                      <Select 
                        value={formData.controlType} 
                        onValueChange={(value) => setFormData({...formData, controlType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {controlTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
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
                    {editingMedication ? 'Atualizar' : 'Cadastrar'}
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
                placeholder="Buscar por nome ou princípio ativo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Medications Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-medical-primary" />
              Medicamentos Cadastrados ({filteredMedications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="medical-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Princípio Ativo</th>
                    <th>Concentração</th>
                    <th>Forma</th>
                    <th>Fabricante</th>
                    <th>Controle</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedications.map((medication) => (
                    <tr key={medication.id}>
                      <td className="font-medium">{medication.name}</td>
                      <td>{medication.activeIngredient}</td>
                      <td>{medication.concentration}</td>
                      <td>{medication.pharmaceuticalForm}</td>
                      <td>{medication.manufacturer}</td>
                      <td>
                        {medication.isControlled ? (
                          <span className="bg-medical-warning/20 text-medical-warning px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {medication.controlType?.split(' - ')[0]}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">Livre</span>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(medication)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(medication.id)}
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

export default Medicamentos;
