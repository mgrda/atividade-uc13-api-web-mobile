
import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white shadow-sm h-16 flex items-center px-6 justify-between z-10">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Clínica Vida & Saúde
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold">
                            U
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
