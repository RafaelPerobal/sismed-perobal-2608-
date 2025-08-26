
import { Patient, Medication } from '../types';

export const seedPatients: Patient[] = [
  { id: '1', name: 'IGOR MARTINS FERREIRA', birthDate: '2001-03-27', cns: '707103879941220', phone: '', address: '' },
  { id: '2', name: 'MARIA VERONICE GARBUGIO CASAVECHIA', birthDate: '1957-10-31', cns: '701207023822217', phone: '', address: '' },
  { id: '3', name: 'VANESSA CASAVECHIA CIA', birthDate: '1980-08-11', cns: '709608626663377', phone: '', address: '' },
  { id: '4', name: 'EDILMA CRIVOI', birthDate: '1978-03-27', cns: '700904925268690', phone: '', address: '' },
  { id: '5', name: 'JOÃO RODRIGUES D´ALARME', birthDate: '1940-01-12', cns: '898003946575562', phone: '', address: '' },
  { id: '6', name: 'MARCIO RISATO CAMPIOLO', birthDate: '1985-05-27', cns: '709004887035819', phone: '', address: '' },
  { id: '7', name: 'RAIMUNDO EDSON FERREIRA LIMA', birthDate: '1972-03-11', cns: '704007311548060', phone: '', address: '' },
  { id: '8', name: 'WILMAR FERREIRA LIMA', birthDate: '1969-11-06', cns: '708907776199410', phone: '', address: '' },
  { id: '9', name: 'ALIFER SOARES', birthDate: '2019-05-26', cns: '704705785840430', phone: '', address: '' },
  { id: '10', name: 'CAROLINA MARTINS MACHADO DOS SANTOS', birthDate: '1937-05-22', cns: '702500318940333', phone: '', address: '' },
];

export const seedMedications: Medication[] = [
  { id: '1', name: 'AMITRIPTILINA', dosage: '25MG', presentation: 'COMPRIMIDO', isControlled: false },
  { id: '2', name: 'ÁCIDO VALPROICO', dosage: '250MG', presentation: 'COMPRIMIDO', isControlled: false },
  { id: '3', name: 'ÁCIDO VALPROICO', dosage: '500MG', presentation: 'COMPRIMIDO', isControlled: false },
  { id: '4', name: 'ÁCIDO VALPROICO', dosage: '50MG/ML', presentation: 'SUSPENSÃO ORAL', isControlled: false },
  { id: '5', name: 'BIPERIDENO CLORIDRATO', dosage: '2MG', presentation: 'COMPRIMIDO', isControlled: true },
  { id: '6', name: 'CARBAMAZEPINA', dosage: '200MG', presentation: 'COMPRIMIDO', isControlled: false },
  { id: '7', name: 'CARBAMAZEPINA', dosage: '20MG/ML', presentation: 'SUSPENSÃO', isControlled: false },
  { id: '8', name: 'CARBONATO DE LÍTIO', dosage: '300MG', presentation: 'COMPRIMIDO', isControlled: true },
  { id: '9', name: 'CLOMIPRAMINA CLORIDRATO', dosage: '25MG', presentation: 'COMPRIMIDO', isControlled: false },
  { id: '10', name: 'CLONAZEPAM', dosage: '2MG', presentation: 'COMPRIMIDO', isControlled: true },
  { id: '11', name: 'CLONAZEPAM', dosage: '2.5MG/ML', presentation: 'SOLUÇÃO ORAL', isControlled: true },
  { id: '12', name: 'CLORPROMAZINA CLORIDRATO', dosage: '25MG', presentation: 'COMPRIMIDO', isControlled: true },
  { id: '13', name: 'CLORPROMAZINA CLORIDRATO', dosage: '100MG', presentation: 'COMPRIMIDO', isControlled: true },
  { id: '14', name: 'DESVENLAFAXINA SUCCINATO', dosage: '50MG', presentation: 'COMPRIMIDO', isControlled: false },
  { id: '15', name: 'DIAZEPAM', dosage: '5MG', presentation: 'COMPRIMIDO', isControlled: true },
];

export const initializeData = () => {
  // Initialize patients if not exists
  const existingPatients = localStorage.getItem('sismed-patients');
  if (!existingPatients) {
    localStorage.setItem('sismed-patients', JSON.stringify(seedPatients));
  }

  // Initialize medications if not exists
  const existingMedications = localStorage.getItem('sismed-medications');
  if (!existingMedications) {
    localStorage.setItem('sismed-medications', JSON.stringify(seedMedications));
  }
};
