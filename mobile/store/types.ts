export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Exame {
  id: string;
  name: string;
  date: string;
  result?: string;
}

export interface Agendamento {
  date: string;
  time: string;
  patientId: string;
  doctorId: string;
}