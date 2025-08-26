
import React, { useState } from 'react';
import { FileText, User, Pill, ArrowRight, ArrowLeft, Printer, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
}

interface Medication {
  id: string;
  name: string;
  activeIngredient: string;
  isControlled: boolean;
  controlType?: string;
}

interface PrescriptionMedication {
  medication: Medication;
  dosage: string;
}

const Receitas = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [prescriptionMonths, setPrescriptionMonths] = useState('1');
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [medicationDosages, setMedicationDosages] = useState<{[key: string]: string}>({});
  const [observations, setObservations] = useState('');

  // Mock data
  const patients: Patient[] = [
    { id: '1', name: 'Maria da Silva Santos', cpf: '123.456.789-00', birthDate: '1985-03-15' },
    { id: '2', name: 'João Carlos Oliveira', cpf: '987.654.321-00', birthDate: '1978-07-22' },
    { id: '3', name: 'Ana Costa Ferreira', cpf: '456.789.123-00', birthDate: '1990-11-08' }
  ];

  const medications: Medication[] = [
    { id: '1', name: 'Paracetamol 500mg', activeIngredient: 'Paracetamol', isControlled: false },
    { id: '2', name: 'Amoxicilina 500mg', activeIngredient: 'Amoxicilina', isControlled: false },
    { id: '3', name: 'Clonazepam 2mg', activeIngredient: 'Clonazepam', isControlled: true, controlType: 'B1' },
    { id: '4', name: 'Losartana 50mg', activeIngredient: 'Losartana', isControlled: false },
    { id: '5', name: 'Metformina 850mg', activeIngredient: 'Metformina', isControlled: false }
  ];

  const professional = {
    name: 'Dr. João Silva',
    type: 'Médico',
    registry: 'CRM 12345-SP',
    specialty: 'Clínica Geral'
  };

  const handleMedicationToggle = (medicationId: string) => {
    setSelectedMedications(prev => 
      prev.includes(medicationId)
        ? prev.filter(id => id !== medicationId)
        : [...prev, medicationId]
    );
  };

  const handleDosageChange = (medicationId: string, dosage: string) => {
    setMedicationDosages(prev => ({
      ...prev,
      [medicationId]: dosage
    }));
  };

  const goToStep2 = () => {
    if (!selectedPatient) {
      toast.error('Selecione um paciente');
      return;
    }
    if (selectedMedications.length === 0) {
      toast.error('Selecione pelo menos um medicamento');
      return;
    }
    setCurrentStep(2);
  };

  const generatePrescription = () => {
    // Validate controlled medications have dosage
    const controlledMeds = selectedMedications
      .map(id => medications.find(m => m.id === id))
      .filter(med => med?.isControlled);
    
    const missingDosage = controlledMeds.some(med => 
      !medicationDosages[med!.id] || medicationDosages[med!.id].trim() === ''
    );

    if (missingDosage) {
      toast.error('Medicamentos controlados devem ter posologia preenchida');
      return;
    }

    // Generate prescription
    const patient = patients.find(p => p.id === selectedPatient)!;
    const prescriptionMeds: PrescriptionMedication[] = selectedMedications.map(id => ({
      medication: medications.find(m => m.id === id)!,
      dosage: medicationDosages[id] || 'Conforme orientação médica'
    }));

    generatePrescriptionPDF(patient, prescriptionMeds);
  };

  const generatePrescriptionPDF = (patient: Patient, medications: PrescriptionMedication[]) => {
    const newWindow = window.open('', '_blank');
    if (!newWindow) return;

    const prescriptionHTML = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Receita Médica</title>
        <style>
          @page { size: A4 landscape; margin: 1cm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 12px; }
          .prescription-container { display: flex; gap: 10px; height: 100vh; }
          .prescription-via { 
            flex: 1; 
            border: 2px solid #1e5f8b; 
            padding: 20px; 
            background: white;
            position: relative;
          }
          .prescription-via:first-child::after {
            content: '';
            position: absolute;
            right: -5px;
            top: 0;
            bottom: 0;
            width: 2px;
            border-right: 2px dashed #666;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #1e5f8b; 
            padding-bottom: 15px; 
            margin-bottom: 20px;
          }
          .logo-section { display: flex; justify-content: center; gap: 20px; margin-bottom: 10px; }
          .logo-section img { height: 40px; }
          .title { color: #1e5f8b; font-size: 18px; font-weight: bold; }
          .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
          .professional-info { 
            background: #f8f9fa; 
            padding: 10px; 
            border-radius: 5px; 
            margin-bottom: 20px;
          }
          .patient-info { 
            background: #e8f4f8; 
            padding: 10px; 
            border-radius: 5px; 
            margin-bottom: 20px;
          }
          .medications { margin-bottom: 20px; }
          .medication-item { 
            padding: 8px; 
            border-bottom: 1px solid #eee; 
            margin-bottom: 10px;
          }
          .medication-name { font-weight: bold; color: #1e5f8b; }
          .medication-dosage { margin-top: 5px; font-style: italic; }
          .controlled-badge { 
            background: #ffc107; 
            color: #000; 
            padding: 2px 6px; 
            border-radius: 3px; 
            font-size: 10px;
            margin-left: 10px;
          }
          .footer { 
            margin-top: 30px; 
            border-top: 1px solid #ddd; 
            padding-top: 15px;
          }
          .signature-line { 
            border-bottom: 1px solid #000; 
            width: 300px; 
            margin: 30px auto 10px;
          }
          .via-label { 
            text-align: center; 
            font-weight: bold; 
            color: #1e5f8b; 
            margin-bottom: 20px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="prescription-container">
          ${generateViaHTML('VIA DA FARMÁCIA', patient, medications)}
          ${generateViaHTML('VIA DO PACIENTE', patient, medications)}
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    newWindow.document.write(prescriptionHTML);
    newWindow.document.close();

    // Save prescription record
    const prescriptionRecord = {
      id: `RX${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      medications: medications,
      date: new Date().toISOString(),
      professionalName: professional.name,
      observations: observations
    };

    // In real app, this would go to localStorage
    console.log('Prescription generated:', prescriptionRecord);
    toast.success('Receita gerada com sucesso!');
    
    // Reset form
    setCurrentStep(1);
    setSelectedPatient('');
    setSelectedMedications([]);
    setMedicationDosages({});
    setObservations('');
  };

  const generateViaHTML = (viaType: string, patient: Patient, medications: PrescriptionMedication[]) => {
    const calculateAge = (birthDate: string) => {
      const today = new Date();
      const birth = new Date(birthDate);
      return today.getFullYear() - birth.getFullYear();
    };

    return `
      <div class="prescription-via">
        <div class="via-label">${viaType}</div>
        
        <div class="header">
          <div class="logo-section">
            <img src="/lovable-uploads/b954f439-274b-409b-9378-b06f8008eb70.png" alt="Prefeitura" />
            <img src="/lovable-uploads/013137d0-d9de-4ac8-b7de-d43bb3463c78.png" alt="SISMED" />
          </div>
          <div class="title">SISTEMA DE SAÚDE MUNICIPAL DE PEROBAL</div>
          <div class="subtitle">RECEITA MÉDICA</div>
        </div>

        <div class="professional-info">
          <strong>Profissional:</strong> ${professional.name}<br>
          <strong>Registro:</strong> ${professional.registry}<br>
          <strong>Especialidade:</strong> ${professional.specialty}
        </div>

        <div class="patient-info">
          <strong>Paciente:</strong> ${patient.name}<br>
          <strong>CPF:</strong> ${patient.cpf}<br>
          <strong>Idade:</strong> ${calculateAge(patient.birthDate)} anos<br>
          <strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}
        </div>

        <div class="medications">
          <strong>Medicamentos Prescritos:</strong>
          ${medications.map(item => `
            <div class="medication-item">
              <div class="medication-name">
                ${item.medication.name}
                ${item.medication.isControlled ? `<span class="controlled-badge">CONTROLADO ${item.medication.controlType}</span>` : ''}
              </div>
              <div class="medication-dosage">${item.dosage}</div>
            </div>
          `).join('')}
        </div>

        ${observations ? `<div><strong>Observações:</strong><br>${observations}</div>` : ''}

        <div class="footer">
          <div>Válida por ${prescriptionMonths} mês(es)</div>
          <div class="signature-line"></div>
          <div style="text-align: center; margin-top: 5px;">
            ${professional.name}<br>
            ${professional.registry}
          </div>
        </div>
      </div>
    `;
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-medical-primary">
              Emissão de Receitas
            </h1>
            <p className="text-muted-foreground mt-1">
              Prescreva medicamentos e gere receitas profissionais
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className="step-item">
            <div className={`step-number ${currentStep >= 1 ? 'active' : 'inactive'}`}>1</div>
            <span className="text-sm font-medium">Seleção</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="step-item">
            <div className={`step-number ${currentStep >= 2 ? 'active' : 'inactive'}`}>2</div>
            <span className="text-sm font-medium">Posologia</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="step-item">
            <div className={`step-number ${currentStep >= 3 ? 'completed' : 'inactive'}`}>3</div>
            <span className="text-sm font-medium">Impressão</span>
          </div>
        </div>

        {/* Step 1: Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-medical-primary" />
                    Seleção do Paciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="medical-form-group">
                    <Label className="medical-form-label">Paciente *</Label>
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map(patient => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} - {patient.cpf}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="medical-form-group">
                    <Label className="medical-form-label">Validade da Receita</Label>
                    <Select value={prescriptionMonths} onValueChange={setPrescriptionMonths}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 mês</SelectItem>
                        <SelectItem value="2">2 meses</SelectItem>
                        <SelectItem value="3">3 meses</SelectItem>
                        <SelectItem value="6">6 meses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Patient Info */}
              {selectedPatient && (
                <Card>
                  <CardHeader>
                    <CardTitle>Dados do Paciente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const patient = patients.find(p => p.id === selectedPatient)!;
                      const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear();
                      return (
                        <div className="space-y-2">
                          <div><strong>Nome:</strong> {patient.name}</div>
                          <div><strong>CPF:</strong> {patient.cpf}</div>
                          <div><strong>Idade:</strong> {age} anos</div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Medication Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-medical-primary" />
                  Seleção de Medicamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medications.map(medication => (
                    <div key={medication.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                      <Checkbox
                        id={medication.id}
                        checked={selectedMedications.includes(medication.id)}
                        onCheckedChange={() => handleMedicationToggle(medication.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={medication.id} className="font-medium cursor-pointer">
                          {medication.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {medication.activeIngredient}
                          {medication.isControlled && (
                            <span className="ml-2 bg-medical-warning/20 text-medical-warning px-2 py-1 rounded text-xs">
                              Controlado {medication.controlType}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={goToStep2} className="btn-medical-primary">
                    Definir Posologia
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Dosage */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Definir Posologia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMedications.map(medicationId => {
                  const medication = medications.find(m => m.id === medicationId)!;
                  return (
                    <div key={medicationId} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="font-semibold">{medication.name}</h4>
                        {medication.isControlled && (
                          <span className="bg-medical-warning/20 text-medical-warning px-2 py-1 rounded-full text-xs">
                            Controlado {medication.controlType}
                          </span>
                        )}
                      </div>
                      <div className="medical-form-group">
                        <Label className="medical-form-label">
                          Posologia {medication.isControlled ? '*' : ''}
                        </Label>
                        <Input
                          value={medicationDosages[medicationId] || ''}
                          onChange={(e) => handleDosageChange(medicationId, e.target.value)}
                          placeholder="Ex: 1 comprimido de 8 em 8 horas por 7 dias"
                          required={medication.isControlled}
                        />
                      </div>
                    </div>
                  );
                })}

                <div className="medical-form-group">
                  <Label className="medical-form-label">Observações Gerais</Label>
                  <Textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Observações adicionais para o paciente..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <Button onClick={generatePrescription} className="btn-medical-success">
                    <Printer className="h-4 w-4 mr-2" />
                    Gerar e Imprimir Receita
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Receitas;
