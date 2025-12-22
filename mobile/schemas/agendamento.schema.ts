import { object, string, date } from 'yup';

// Schema for scheduling (agendamento)
const agendamentoSchema = object({
  date: date().required('A data é obrigatória.'),
  time: string().required('O horário é obrigatório.'),
  patientId: string().required('O ID do paciente é obrigatório.'),
  doctorId: string().required('O ID do médico é obrigatório.'),
});

export default agendamentoSchema;