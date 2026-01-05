'use client';

import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '@/components/Button';
import Logo from '@/components/Logo';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/Input';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';

// Schema de validação
const loginSchema = z.object({
    email: z.string().nonempty('O e-mail é obrigatório').email('Formato de e-mail inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login } = useStore();

    const {
        register,
        handleSubmit: hookFormSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = (data: LoginFormData) => {
        const { email, password } = data;

        // Simulação de autenticação Cliente-Side
        let role = 'PACIENTE';
        let name = 'Paciente Teste';
        let id = '1';

        if (email.includes('admin')) {
            role = 'ADMIN';
            name = 'Administrador';
            id = 'admin-1';
        } else if (email.includes('medico')) {
            role = 'MEDICO';
            name = 'Dr. Silva';
            id = 'med-1';
        } else if (email.includes('atendente')) {
            role = 'ATENDENTE';
            name = 'Joana Atendente';
            id = 'atend-1';
        }

        const user = { id, name, email, role };
        const token = 'mock-token-client-side-' + Date.now();

        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
        login(user, token);

        switch (role) {
            case 'ADMIN':
                router.push('/admin/dashboard');
                break;
            case 'MEDICO':
                router.push('/app/medico/agenda');
                break;
            case 'ATENDENTE':
                router.push('/app/atendente/agendamentos');
                break;
            default:
                router.push('/app/paciente/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Logo />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h2>
                        <p className="text-gray-600">Acesse sua conta para gerenciar sua saúde</p>
                    </div>

                    <form className="space-y-6" onSubmit={hookFormSubmit(onSubmit)}>
                        <div>
                            <Input
                                label="Email"
                                type="email"
                                placeholder="seu@email.com"
                                {...register('email')}
                                error={errors.email}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-sm font-medium text-gray-700"></label>
                                <Link href="/recuperar-senha">
                                    <span className="text-sm text-cyan-600 hover:text-cyan-500 cursor-pointer">Esqueceu a senha?</span>
                                </Link>
                            </div>
                            <Input
                                label="Senha"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                error={errors.password}
                            />
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="w-full py-3 text-lg group">
                            {isSubmitting ? 'Entrando...' : 'Entrar'}
                            {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-gray-600">Não tem uma conta? </span>
                        <Link href="/cadastro">
                            <span className="font-semibold text-cyan-600 hover:text-cyan-500">Cadastre-se gratuitamente</span>
                        </Link>
                    </div>
                </div>
                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
                    <Link href="/">
                        <span className="text-sm text-gray-500 hover:text-gray-700">← Voltar para a página inicial</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
