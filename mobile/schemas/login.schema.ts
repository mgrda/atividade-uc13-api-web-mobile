import { object, string } from 'yup';

// Schema for user login
const loginSchema = object({
  email: string().email('E-mail inválido.').required('O e-mail é obrigatório.'),
  password: string().required('A senha é obrigatória.'),
});

export default loginSchema;