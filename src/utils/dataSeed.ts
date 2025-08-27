
import { Patient, Medication } from '@/types';

const SEED_PATIENTS: Omit<Patient, 'id'>[] = [
  { name: 'MARIA JOSÉ DA SILVA', birthDate: '1978-03-15', cns: '123456789012345', phone: '(44) 99999-0001', address: 'Rua das Flores, 123' },
  { name: 'JOÃO CARLOS SANTOS', birthDate: '1985-07-22', cns: '234567890123456', phone: '(44) 99999-0002', address: 'Av. Principal, 456' },
  { name: 'ANA PAULA OLIVEIRA', birthDate: '1992-12-08', cns: '345678901234567', phone: '(44) 99999-0003', address: 'Rua da Paz, 789' },
  { name: 'CARLOS EDUARDO LIMA', birthDate: '1975-05-30', cns: '456789012345678', phone: '(44) 99999-0004', address: 'Rua São José, 321' },
  { name: 'FERNANDA ALVES COSTA', birthDate: '1988-09-14', cns: '567890123456789', phone: '(44) 99999-0005', address: 'Av. Brasil, 654' },
  { name: 'ROBERTO SILVA JUNIOR', birthDate: '1982-01-27', cns: '678901234567890', phone: '(44) 99999-0006', address: 'Rua Central, 987' },
  { name: 'LUCIANA PEREIRA MOURA', birthDate: '1990-11-03', cns: '789012345678901', phone: '(44) 99999-0007', address: 'Rua Nova, 147' },
  { name: 'ANTONIO MARCOS FERREIRA', birthDate: '1973-08-19', cns: '890123456789012', phone: '(44) 99999-0008', address: 'Av. Independência, 258' },
  { name: 'SANDRA REGINA BARBOSA', birthDate: '1995-04-12', cns: '901234567890123', phone: '(44) 99999-0009', address: 'Rua do Comércio, 369' },
  { name: 'PAULO HENRIQUE ROCHA', birthDate: '1980-06-25', cns: '012345678901234', phone: '(44) 99999-0010', address: 'Rua 7 de Setembro, 741' },
  { name: 'RITA DE CASSIA MENDES', birthDate: '1987-10-17', cns: '123450987654321', phone: '(44) 99999-0011', address: 'Av. Getúlio Vargas, 852' },
  { name: 'MARCELO AUGUSTO PINTO', birthDate: '1976-02-28', cns: '234561098765432', phone: '(44) 99999-0012', address: 'Rua Santa Rita, 963' },
  { name: 'CLAUDIA MARIA GOMES', birthDate: '1993-12-31', cns: '345672109876543', phone: '(44) 99999-0013', address: 'Rua dos Pioneiros, 159' },
  { name: 'EDSON LUIZ CAMPOS', birthDate: '1984-03-06', cns: '456783210987654', phone: '(44) 99999-0014', address: 'Av. Marechal Rondon, 357' },
  { name: 'PATRICIA HELENA DIAS', birthDate: '1991-07-13', cns: '567894321098765', phone: '(44) 99999-0015', address: 'Rua Paraná, 468' },
  { name: 'RICARDO CESAR NUNES', birthDate: '1979-11-29', cns: '678905432109876', phone: '(44) 99999-0016', address: 'Rua Curitiba, 579' },
  { name: 'SIMONE APARECIDA REIS', birthDate: '1986-05-21', cns: '789016543210987', phone: '(44) 99999-0017', address: 'Av. Londrina, 681' },
  { name: 'WAGNER JOSE MARTINS', birthDate: '1977-09-04', cns: '890127654321098', phone: '(44) 99999-0018', address: 'Rua Maringá, 792' },
  { name: 'VALERIA CRISTINA CRUZ', birthDate: '1994-01-16', cns: '901238765432109', phone: '(44) 99999-0019', address: 'Rua Cascavel, 893' },
  { name: 'SERGIO ROBERTO TEIXEIRA', birthDate: '1981-04-23', cns: '012349876543210', phone: '(44) 99999-0020', address: 'Av. Foz do Iguaçu, 904' },
  { name: 'ROSANA KELLY CARDOSO', birthDate: '1989-08-07', cns: '123456780123456', phone: '(44) 99999-0021', address: 'Rua Pato Branco, 105' },
  { name: 'NELSON APARECIDO SOUSA', birthDate: '1972-12-14', cns: '234567891234567', phone: '(44) 99999-0022', address: 'Rua Guarapuava, 216' },
  { name: 'DENISE FATIMA ARAUJO', birthDate: '1996-03-01', cns: '345678902345678', phone: '(44) 99999-0023', address: 'Av. Toledo, 327' },
  { name: 'FRANCISCO CARLOS BATISTA', birthDate: '1983-06-18', cns: '456789013456789', phone: '(44) 99999-0024', address: 'Rua Umuarama, 438' },
  { name: 'MONICA REGINA VIEIRA', birthDate: '1990-10-25', cns: '567890124567890', phone: '(44) 99999-0025', address: 'Rua Campo Mourão, 549' },
  { name: 'DOUGLAS FERNANDO MORAIS', birthDate: '1978-02-11', cns: '678901235678901', phone: '(44) 99999-0026', address: 'Av. Paranavaí, 650' },
  { name: 'ELIANE APARECIDA LOPES', birthDate: '1985-05-28', cns: '789012346789012', phone: '(44) 99999-0027', address: 'Rua Apucarana, 761' },
  { name: 'GUSTAVO HENRIQUE RAMOS', birthDate: '1992-09-15', cns: '890123457890123', phone: '(44) 99999-0028', address: 'Rua Arapongas, 872' },
  { name: 'HELENA MARIA CORREIA', birthDate: '1975-01-02', cns: '901234568901234', phone: '(44) 99999-0029', address: 'Av. Sarandi, 983' },
  { name: 'IVAN CARLOS FREITAS', birthDate: '1987-04-19', cns: '012345679012345', phone: '(44) 99999-0030', address: 'Rua Cianorte, 194' },
  { name: 'JULIANA CRISTINE MACHADO', birthDate: '1993-08-26', cns: '123456789123456', phone: '(44) 99999-0031', address: 'Rua Paranacity, 205' },
  { name: 'KLEBER JOSE RIBEIRO', birthDate: '1980-12-09', cns: '234567890234567', phone: '(44) 99999-0032', address: 'Av. Nova Esperança, 316' },
  { name: 'LILIAN FERNANDA GODOY', birthDate: '1988-03-24', cns: '345678901345678', phone: '(44) 99999-0033', address: 'Rua Cruzeiro do Oeste, 427' },
  { name: 'MARCIO LUIS SANTANA', birthDate: '1974-07-11', cns: '456789012456789', phone: '(44) 99999-0034', address: 'Rua Goioerê, 538' },
  { name: 'NEUSA APARECIDA BORGES', birthDate: '1991-11-05', cns: '567890123567890', phone: '(44) 99999-0035', address: 'Av. Altônia, 649' }
];

const SEED_MEDICATIONS: Omit<Medication, 'id'>[] = [
  { name: 'Paracetamol', dosage: '500mg', presentation: 'Comprimido', isControlled: false },
  { name: 'Dipirona', dosage: '500mg', presentation: 'Comprimido', isControlled: false },
  { name: 'Ibuprofeno', dosage: '400mg', presentation: 'Comprimido', isControlled: false },
  { name: 'Diclofenaco', dosage: '50mg', presentation: 'Comprimido', isControlled: false },
  { name: 'Omeprazol', dosage: '20mg', presentation: 'Cápsula', isControlled: false },
  { name: 'Losartana', dosage: '50mg', presentation: 'Comprimido', isControlled: false },
  { name: 'Enalapril', dosage: '10mg', presentation: 'Comprimido', isControlled: false },
  { name: 'Metformina', dosage: '850mg', presentation: 'Comprimido', isControlled: false },
  { name: 'Glibenclamida', dosage: '5mg', presentation: 'Comprimido', isControlled: false },
  { name: 'Sinvastatina', dosage: '20mg', presentation: 'Comprimido', isControlled: false },
  { name: 'Captopril', dosage: '25mg', presentation: 'Comprimido', isControlled: false },
  { name: 'Hidroclorotiazida', dosage: '25mg', presentation: 'Comprimido', isControlled: false },
  { name: 'Amoxicilina', dosage: '500mg', presentation: 'Cápsula', isControlled: false },
  { name: 'Azitromicina', dosage: '500mg', presentation: 'Comprimido', isControlled: false },
  { name: 'Cefalexina', dosage: '500mg', presentation: 'Cápsula', isControlled: false },
  { name: 'Dexametasona', dosage: '0,75mg', presentation: 'Comprimido', isControlled: false },
  { name: 'Prednisolona', dosage: '20mg', presentation: 'Comprimido', isControlled: false },
  { name: 'Salbutamol', dosage: '100mcg', presentation: 'Aerossol', isControlled: false },
  { name: 'Sertralina', dosage: '50mg', presentation: 'Comprimido', isControlled: true },
  { name: 'Fluoxetina', dosage: '20mg', presentation: 'Cápsula', isControlled: true },
  { name: 'Clonazepam', dosage: '2mg', presentation: 'Comprimido', isControlled: true },
  { name: 'Diazepam', dosage: '10mg', presentation: 'Comprimido', isControlled: true },
  { name: 'Alprazolam', dosage: '0,5mg', presentation: 'Comprimido', isControlled: true },
  { name: 'Lorazepam', dosage: '2mg', presentation: 'Comprimido', isControlled: true },
  { name: 'Zolpidem', dosage: '10mg', presentation: 'Comprimido', isControlled: true },
  { name: 'Tramadol', dosage: '50mg', presentation: 'Cápsula', isControlled: true },
  { name: 'Codeína', dosage: '30mg', presentation: 'Comprimido', isControlled: true },
  { name: 'Morfina', dosage: '10mg', presentation: 'Comprimido', isControlled: true },
  { name: 'Fentanila', dosage: '25mcg/h', presentation: 'Adesivo', isControlled: true },
  { name: 'Carbamazepina', dosage: '200mg', presentation: 'Comprimido', isControlled: true },
  { name: 'Fenitoína', dosage: '100mg', presentation: 'Comprimido', isControlled: true },
  { name: 'Ácido Valproico', dosage: '250mg', presentation: 'Comprimido', isControlled: true },
  { name: 'Gabapentina', dosage: '300mg', presentation: 'Cápsula', isControlled: true },
  { name: 'Pregabalina', dosage: '150mg', presentation: 'Cápsula', isControlled: true },
  { name: 'Risperidona', dosage: '2mg', presentation: 'Comprimido', isControlled: true },
  { name: 'Quetiapina', dosage: '100mg', presentation: 'Comprimido', isControlled: true }
];

export const initializeData = () => {
  // Only seed data if localStorage is empty
  const existingPatients = localStorage.getItem('sismed-patients');
  const existingMedications = localStorage.getItem('sismed-medications');

  if (!existingPatients || JSON.parse(existingPatients).length === 0) {
    const patients = SEED_PATIENTS.map((patient, index) => ({
      ...patient,
      id: `patient_${index + 1}`
    }));
    localStorage.setItem('sismed-patients', JSON.stringify(patients));
    console.log('✅ Pacientes inicializados:', patients.length);
  }

  if (!existingMedications || JSON.parse(existingMedications).length === 0) {
    const medications = SEED_MEDICATIONS.map((medication, index) => ({
      ...medication,
      id: `medication_${index + 1}`
    }));
    localStorage.setItem('sismed-medications', JSON.stringify(medications));
    console.log('✅ Medicamentos inicializados:', medications.length);
  }
};
