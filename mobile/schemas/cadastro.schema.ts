import { object, string } from 'yup';

// Schema for user registration (cadastro)
const cadastroSchema = object({
  name: string().required('O nome é obrigatório.'),
  email: string().email('E-mail inválido.').required('O e-mail é obrigatório.'),
  password: string().min(6, 'A senha deve ter pelo menos 6 caracteres.').required('A senha é obrigatória.'),
});

export default cadastroSchema;