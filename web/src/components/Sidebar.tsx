
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Calendar,
    FileText,
    Activity,
    Users,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ClipboardList
} from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    // Define menus based on path
    const getMenu = () => {
        if (pathname.startsWith('/app/paciente')) {
            return [
                { name: 'Dashboard', href: '/app/paciente/dashboard', icon: LayoutDashboard },
                { name: 'Minhas Consultas', href: '/app/paciente/consultas', icon: Calendar },
                { name: 'Meus Exames', href: '/app/paciente/exames', icon: Activity },
                { name: 'Resultados', href: '/app/paciente/resultados', icon: FileText },
                { name: 'Agendar', href: '/app/paciente/agendar', icon: ClipboardList },
            ];
        } else if (pathname.startsWith('/app/atendente')) {
            return [
                { name: 'Agendamentos', href: '/app/atendente/agendamentos', icon: Calendar },
                { name: 'Pacientes', href: '/app/atendente/pacientes', icon: Users },
            ];
        } else if (pathname.startsWith('/app/medico')) {
            return [
                { name: 'Minha Agenda', href: '/app/medico/agenda', icon: Calendar },
                // Consultas and Exames usually accessed from agenda, but we can list them if needed
            ];
        } else if (pathname.startsWith('/admin')) {
            return [
                { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
                { name: 'Usuários', href: '/admin/usuarios', icon: Users },
                { name: 'Consultas', href: '/admin/consultas', icon: Calendar },
                { name: 'Exames', href: '/admin/exames', icon: Activity },
                { name: 'Resultados', href: '/admin/resultados', icon: FileText },
            ];
        }

        // Default or Fallback
        return [];
    };

    const menuItems = getMenu();
    const isPaciente = pathname.startsWith('/app/paciente');
    const isAtendente = pathname.startsWith('/app/atendente');
    const isMedico = pathname.startsWith('/app/medico');
    const isAdmin = pathname.startsWith('/admin');

    const roleLabel = isPaciente ? 'Paciente' :
        isAtendente ? 'Atendente' :
            isMedico ? 'Médico' :
                isAdmin ? 'Administrador' : '';

    return (
        <div className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
            <div className="p-4 flex items-center justify-between border-b border-gray-100 h-16">
                <div className={`flex items-center gap-2 ${collapsed ? 'justify-center w-full' : ''}`}>
                    {!collapsed && <Logo />}
                    {collapsed && <div className="font-bold text-cyan-600 text-xl">V&S</div>}
                </div>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 rounded-md hover:bg-gray-100 text-gray-500 lg:block hidden absolute right-[-12px] top-6 bg-white border border-gray-200 shadow-sm"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            <div className="p-4 border-b border-gray-100">
                {!collapsed ? (
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Perfil</p>
                        <p className="font-medium text-gray-900 mt-1">{roleLabel}</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-xs font-bold text-cyan-600">{roleLabel.substring(0, 3)}</p>
                    </div>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                ? 'bg-cyan-50 text-cyan-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            title={collapsed ? item.name : ''}
                        >
                            <item.icon size={20} className={isActive ? 'text-cyan-600' : 'text-gray-400'} />
                            {!collapsed && <span className="font-medium">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={() => {
                        // Logout mockado client-side
                        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'; // Deleta cookie
                        window.location.href = '/login';
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                    title={collapsed ? "Sair" : ''}
                >
                    <LogOut size={20} />
                    {!collapsed && <span className="font-medium">Sair</span>}
                </button>
            </div>
        </div>
    );
}
