
import React, { useState } from 'react';
import { FileText, User, Pill, ArrowRight, ArrowLeft, Printer } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatCNS } from '@/utils/cnsValidation';
import { Patient, Medication, PrescriptionMedication, Prescription } from '@/types';

const Receitas = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [prescriptionMonths, setPrescriptionMonths] = useState('1');
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [medicationPosologies, setMedicationPosologies] = useState<{[key: string]: string}>({});
  const [observations, setObservations] = useState('');

  const [patients] = useLocalStorage<Patient[]>('sismed-patients', []);
  const [medications] = useLocalStorage<Medication[]>('sismed-medications', []);
  const [prescriptions, setPrescriptions] = useLocalStorage<Prescription[]>('sismed-prescriptions', []);

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

  const handlePosologyChange = (medicationId: string, posology: string) => {
    setMedicationPosologies(prev => ({
      ...prev,
      [medicationId]: posology
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

  const generatePrescriptions = () => {
    const controlledMeds = selectedMedications
      .map(id => medications.find(m => m.id === id))
      .filter(med => med?.isControlled);
    
    const missingPosology = controlledMeds.some(med => 
      !medicationPosologies[med!.id] || medicationPosologies[med!.id].trim() === ''
    );

    if (missingPosology) {
      toast.error('Medicamentos controlados devem ter posologia preenchida');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient)!;
    const prescriptionMeds: PrescriptionMedication[] = selectedMedications.map(id => ({
      medication: medications.find(m => m.id === id)!,
      posology: medicationPosologies[id] || 'Conforme orientação médica'
    }));

    const monthsNum = parseInt(prescriptionMonths);
    const baseDate = new Date();
    
    // Generate multiple prescriptions for each month
    for (let month = 0; month < monthsNum; month++) {
      const prescriptionDate = new Date(baseDate);
      prescriptionDate.setMonth(prescriptionDate.getMonth() + month);
      
      const prescription: Prescription = {
        id: `RX${Date.now()}-${month + 1}`,
        patientId: patient.id,
        patientName: patient.name,
        patientCNS: patient.cns,
        medications: prescriptionMeds,
        months: 1, // Each prescription is for 1 month
        observations: observations,
        date: prescriptionDate.toISOString(),
        professionalName: professional.name
      };

      setPrescriptions(prev => [...prev, prescription]);
    }

    // Generate single PDF with all prescriptions
    setTimeout(() => {
      generateMultiplePrescriptionsPDF(patient, prescriptionMeds, baseDate, monthsNum);
    }, 100);

    toast.success(`${monthsNum} receita(s) gerada(s) com sucesso!`);
    
    // Reset form
    setCurrentStep(1);
    setSelectedPatient('');
    setSelectedMedications([]);
    setMedicationPosologies({});
    setObservations('');
  };

  const formatDateToPerobal = (date: Date) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `Perobal, dia ${day} de ${month} de ${year}`;
  };

  const generateMultiplePrescriptionsPDF = (
    patient: Patient, 
    medications: PrescriptionMedication[], 
    baseDate: Date,
    totalMonths: number
  ) => {
    const newWindow = window.open('', '_blank');
    if (!newWindow) return;

    const calculateAge = (birthDate: string) => {
      const today = new Date();
      const birth = new Date(birthDate);
      return today.getFullYear() - birth.getFullYear();
    };

    const generateSinglePrescriptionHTML = (prescriptionDate: Date, monthNumber: number) => {
      const generateViaHTML = (viaType: string) => `
        <div class="prescription-via">
          <div class="via-label">${viaType}</div>
          
          <div class="header">
            <div class="logo-section">
              <img src="/lovable-uploads/b954f439-274b-409b-9378-b06f8008eb70.png" alt="Prefeitura" />
              <img src="/lovable-uploads/013137d0-d9de-4ac8-b7de-d43bb3463c78.png" alt="SISMED" />
            </div>
            <div class="title">SISTEMA DE SAÚDE MUNICIPAL DE PEROBAL</div>
            <div class="subtitle">RECEITA MÉDICA ${totalMonths > 1 ? `- ${monthNumber}ª VIA DE ${totalMonths}` : ''}</div>
          </div>

          <div class="professional-info">
            <strong>Profissional:</strong> ${professional.name}<br>
            <strong>Registro:</strong> ${professional.registry}<br>
            <strong>Especialidade:</strong> ${professional.specialty || 'Clínica Geral'}
          </div>

          <div class="patient-info">
            <strong>Paciente:</strong> ${patient.name}<br>
            <strong>CNS:</strong> ${formatCNS(patient.cns)}<br>
            <strong>Idade:</strong> ${calculateAge(patient.birthDate)} anos<br>
            <strong>Data:</strong> ${formatDateToPerobal(prescriptionDate)}
          </div>

          <div class="medications">
            <strong>Medicamentos Prescritos:</strong>
            ${medications.map(item => `
              <div class="medication-item">
                <div class="medication-name">
                  ${item.medication.name} ${item.medication.dosage} - ${item.medication.presentation}
                  ${item.medication.isControlled ? '<span class="controlled-badge">CONTROLADO</span>' : ''}
                </div>
                <div class="medication-posology">${item.posology}</div>
              </div>
            `).join('')}
          </div>

          ${observations ? `<div class="observations"><strong>Observações:</strong><br>${observations}</div>` : ''}

          <div class="footer">
            <div>Válido por 30 dias a partir de ${formatDateToPerobal(prescriptionDate)}</div>
            <div class="signature-line"></div>
            <div style="text-align: center; margin-top: 5px;">
              ${professional.name}<br>
              ${professional.registry}
            </div>
          </div>
        </div>
      `;

      return `
        <div class="prescription-page">
          <div class="prescription-container">
            ${generateViaHTML('VIA DA FARMÁCIA')}
            ${generateViaHTML('VIA DO PACIENTE')}
          </div>
        </div>
      `;
    };

    // Generate all prescriptions HTML
    let allPrescriptionsHTML = '';
    for (let month = 0; month < totalMonths; month++) {
      const prescriptionDate = new Date(baseDate);
      prescriptionDate.setMonth(prescriptionDate.getMonth() + month);
      allPrescriptionsHTML += generateSinglePrescriptionHTML(prescriptionDate, month + 1);
    }

    const prescriptionHTML = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Receitas Médicas - ${totalMonths} ${totalMonths === 1 ? 'Via' : 'Vias'}</title>
        <style>
          @page { size: A4 landscape; margin: 1cm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 12px; background: white; color: black; }
          
          .prescription-page {
            page-break-after: always;
            height: 100vh;
          }
          
          .prescription-page:last-child {
            page-break-after: auto;
          }
          
          .prescription-container { 
            display: flex; 
            gap: 10px; 
            height: 100%; 
          }
          
          .prescription-via { 
            flex: 1; 
            border: 2px solid #fbbf24; 
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
          
          .via-label { 
            text-align: center; 
            font-weight: bold; 
            color: #1e40af; 
            margin-bottom: 20px;
            font-size: 14px;
          }
          
          .header { 
            text-align: center; 
            border-bottom: 2px solid #1e40af; 
            padding-bottom: 15px; 
            margin-bottom: 20px;
          }
          
          .logo-section { display: flex; justify-content: center; gap: 20px; margin-bottom: 10px; }
          .logo-section img { height: 40px; }
          .title { color: #1e40af; font-size: 18px; font-weight: bold; }
          .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
          
          .professional-info, .patient-info { 
            background: #f8f9fa; 
            padding: 10px; 
            border: 2px solid #fbbf24;
            border-radius: 5px; 
            margin-bottom: 20px;
          }
          
          .medications { margin-bottom: 20px; }
          .medication-item { 
            padding: 8px; 
            border-bottom: 1px solid #eee; 
            margin-bottom: 10px;
          }
          .medication-name { font-weight: bold; color: black; }
          .medication-posology { margin-top: 5px; font-style: italic; }
          
          .controlled-badge { 
            background: #fca5a5; 
            color: #991b1b; 
            border: 1px solid #f87171;
            padding: 2px 6px; 
            border-radius: 3px; 
            font-size: 10px;
            margin-left: 10px;
          }
          
          .observations { margin-bottom: 20px; padding: 10px; background: #f8f9fa; border: 2px solid #fbbf24; border-radius: 5px; }
          
          .footer { 
            margin-top: 30px; 
            border-top: 2px solid #fbbf24; 
            padding-top: 15px;
          }
          
          .signature-line { 
            border-bottom: 2px solid #000; 
            width: 300px; 
            margin: 30px auto 10px;
          }
        </style>
      </head>
      <body>
        ${allPrescriptionsHTML}
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
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Emissão de Receitas
            </h1>
            <p className="text-muted-foreground mt-1">
              Prescreva medicamentos e gere receitas múltiplas
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className="step-item">
            <div className={`step-number ${currentStep >= 1 ? 'active' : 'inactive'}`}>1</div>
            <span className="text-sm font-medium text-foreground">Seleção</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="step-item">
            <div className={`step-number ${currentStep >= 2 ? 'active' : 'inactive'}`}>2</div>
            <span className="text-sm font-medium text-foreground">Posologia</span>
          </div>
        </div>

        {/* Step 1: Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Selection */}
              <Card className="medical-card">
                <CardHeader className="medical-card-header">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-medical-primary" />
                    Seleção do Paciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="medical-form-group">
                    <Label className="medical-form-label">Paciente *</Label>
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger className="border-2 border-medical-warning">
                        <SelectValue placeholder="Selecione o paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map(patient => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} - {formatCNS(patient.cns)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="medical-form-group">
                    <Label className="medical-form-label">Quantidade de Meses</Label>
                    <Select value={prescriptionMonths} onValueChange={setPrescriptionMonths}>
                      <SelectTrigger className="border-2 border-medical-warning">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map(month => (
                          <SelectItem key={month} value={month.toString()}>
                            {month} {month === 1 ? 'mês' : 'meses'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Patient Info */}
              {selectedPatient && (
                <Card className="medical-card">
                  <CardHeader className="medical-card-header">
                    <CardTitle>Dados do Paciente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const patient = patients.find(p => p.id === selectedPatient)!;
                      const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear();
                      return (
                        <div className="space-y-2">
                          <div><strong>Nome:</strong> {patient.name}</div>
                          <div><strong>CNS:</strong> {formatCNS(patient.cns)}</div>
                          <div><strong>Idade:</strong> {age} anos</div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Medication Selection */}
            <Card className="medical-card">
              <CardHeader className="medical-card-header">
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-medical-primary" />
                  Seleção de Medicamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medications.map(medication => (
                    <div key={medication.id} className="flex items-center space-x-3 p-3 border-2 border-medical-warning rounded-lg hover:bg-gray-50">
                      <Checkbox
                        id={medication.id}
                        checked={selectedMedications.includes(medication.id)}
                        onCheckedChange={() => handleMedicationToggle(medication.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={medication.id} className="font-medium cursor-pointer text-foreground">
                          {medication.name} {medication.dosage}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {medication.presentation}
                          {medication.isControlled && (
                            <span className="ml-2 controlled-badge">
                              CONTROLADO
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

        {/* Step 2: Posology */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card className="medical-card">
              <CardHeader className="medical-card-header">
                <CardTitle>Definir Posologia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMedications.map(medicationId => {
                  const medication = medications.find(m => m.id === medicationId)!;
                  return (
                    <div key={medicationId} className="p-4 border-2 border-medical-warning rounded-lg bg-white">
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="font-semibold text-foreground">
                          {medication.name} {medication.dosage} - {medication.presentation}
                        </h4>
                        {medication.isControlled && (
                          <span className="controlled-badge">
                            CONTROLADO
                          </span>
                        )}
                      </div>
                      <div className="medical-form-group">
                        <Label className="medical-form-label">
                          Posologia {medication.isControlled ? '*' : ''}
                        </Label>
                        <Input
                          value={medicationPosologies[medicationId] || ''}
                          onChange={(e) => handlePosologyChange(medicationId, e.target.value)}
                          placeholder="Ex: 1 comprimido de 8 em 8 horas por 7 dias"
                          className="border-2 border-medical-warning"
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
                    className="border-2 border-medical-warning"
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
                  <Button onClick={generatePrescriptions} className="btn-medical-success">
                    <Printer className="h-4 w-4 mr-2" />
                    Gerar {prescriptionMonths} Receita{parseInt(prescriptionMonths) > 1 ? 's' : ''}
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
