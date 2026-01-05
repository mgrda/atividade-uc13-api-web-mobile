import React from 'react';
import Sidebar from '@/components/Sidebar';
import RoleGuard from '@/components/RoleGuard';

export default function AtendenteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={['ATENDENTE']}>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    <header className="bg-white shadow-sm h-16 flex items-center px-6 justify-between z-10 border-b border-purple-100">
                        <h1 className="text-xl font-semibold text-purple-800">
                            Recepção
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">Atendente</span>
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                                A
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 overflow-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </RoleGuard>
    );
}
