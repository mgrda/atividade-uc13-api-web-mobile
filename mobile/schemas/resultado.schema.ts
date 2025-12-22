import { object, string, date } from 'yup';

// Schema for exam results (resultados)
const resultadoSchema = object({
  examId: string().required('O ID do exame é obrigatório.'),
  patientId: string().required('O ID do paciente é obrigatório.'),
  result: string().required('O resultado é obrigatório.'),
  date: date().required('A data do resultado é obrigatória.'),
});

export default resultadoSchema;