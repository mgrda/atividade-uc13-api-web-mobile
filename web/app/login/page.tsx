'use client';

import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '@/components/Button';
import Logo from '@/components/Logo';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simulação de login - Em produção isso viria de uma API
        console.log('Login attempt:', { email });

        // Login mockado
        login({
            id: '1',
            name: 'Paciente Teste',
            email: email
        }, 'mock-token-123456');

        alert('Login realizado com sucesso! (Modo Simulação)');
        router.push('/');
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

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Senha
                                </label>
                                <Link href="/recuperar-senha">
                                    <span className="text-sm text-cyan-600 hover:text-cyan-500">Esqueceu a senha?</span>
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full py-3 text-lg group">
                            Entrar
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
