
import Link from 'next/link';
import { User, Mail, Lock, Phone, ArrowRight, Calendar } from 'lucide-react';
import Button from '@/components/Button';
import Logo from '@/components/Logo';

export default function CadastroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Crie sua conta</h2>
            <p className="text-gray-600">Junte-se a nós para cuidar da sua saúde</p>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

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

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition text-gray-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button className="w-full py-3 text-lg group mt-6">
              Criar Conta
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-600">Já tem uma conta? </span>
            <Link href="/login">
              <span className="font-semibold text-cyan-600 hover:text-cyan-500">Fazer login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
