
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '@/components/Button';
import Logo from '@/components/Logo';

export default function RecuperarSenhaPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Logo />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Recuperar Senha</h2>
                        <p className="text-gray-600">Digite seu email para receber um link de redefinição</p>
                    </div>

                    <form className="space-y-6">
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
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <Button className="w-full py-3 text-lg group">
                            Enviar Link
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <Link href="/login" className="flex items-center justify-center text-gray-600 hover:text-cyan-600 transition gap-2">
                            <ArrowLeft size={16} />
                            Voltar para o Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
