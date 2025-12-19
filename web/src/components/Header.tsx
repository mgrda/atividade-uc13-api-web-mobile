'use client';

import Link from 'next/link';
import { Home, FileText, Stethoscope } from 'lucide-react';
import Logo from './Logo';
import { useStore } from '@/store';

export default function Header() {
  const { user, isAuthenticated, logout } = useStore();
  return (
    <header className="bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <Link href="/" className="text-2xl font-bold">
            Clínica Vida & Saúde
          </Link>
        </div>


        <ul className="flex items-center gap-6">
          <li>
            <Link href="/" className="hover:opacity-80 transition flex items-center gap-2">
              <Home size={20} />
              Início
            </Link>
          </li>
          <li>
            <Link href="/servicos" className="hover:opacity-80 transition flex items-center gap-2">
              <Stethoscope size={20} />
              Serviços
            </Link>
          </li>
          <li>
            <Link href="/sobre" className="hover:opacity-80 transition flex items-center gap-2">
              <FileText size={20} />
              Sobre
            </Link>
          </li>
          {isAuthenticated && user ? (
            <li className="flex items-center gap-4">
              <span className="text-sm font-medium">Olá, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-full font-bold hover:bg-red-600 transition shadow-md text-sm"
              >
                Sair
              </button>
            </li>
          ) : (
            <li>
              <Link href="/login" className="bg-white text-teal-600 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition shadow-md">
                Entrar
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
