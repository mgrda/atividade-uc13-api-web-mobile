'use client';

import { useStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { user, isAuthenticated } = useStore();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Verifica se está rodando no cliente para evitar erros de hidratação
        if (typeof window === 'undefined') return;

        if (!isAuthenticated || !user) {
            router.push('/login');
            return;
        }

        if (!allowedRoles.includes(user.role)) {
            // Se não tiver permissão, manda para o dashboard correto
            // ou home
            console.warn(`Acesso negado: Usuário com role ${user.role} tentou acessar rota protegida para ${allowedRoles.join(', ')}`);

            switch (user.role) {
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
        } else {
            setAuthorized(true);
        }
    }, [isAuthenticated, user, router, allowedRoles]);

    // Enquanto verifica, podemos mostrar um loading ou nada
    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            </div>
        );
    }

    return <>{children}</>;
}
