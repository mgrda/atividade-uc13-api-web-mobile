
import React from 'react';
import { Calendar, Activity, FileText, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PacienteDashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Olá, João Silva</h1>
                    <p className="text-gray-600">Bem-vindo ao seu painel de saúde.</p>
                </div>
                <Link
                    href="/app/paciente/agendar"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition"
                >
                    Novo Agendamento
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Próxima Consulta</h3>
                        <p className="text-gray-600 text-sm mt-1">Dr. Carlos Silva (Cardiologista)</p>
                        <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                            <Clock size={12} /> 24/10/2023 às 14:30
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Exames Agendados</h3>
                        <p className="text-gray-600 text-sm mt-1">Hemograma Completo</p>
                        <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                            <Clock size={12} /> 25/10/2023 às 08:00
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Resultados Recentes</h3>
                        <p className="text-gray-600 text-sm mt-1">Todos os exames em dia</p>
                        <Link href="/app/paciente/resultados" className="text-cyan-600 text-xs font-semibold mt-2 block hover:underline">
                            Ver histórico
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Avisos Importantes</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                            <p className="text-sm text-yellow-800 font-medium">Campanha de Vacinação</p>
                            <p className="text-xs text-yellow-700 mt-1">A vacina da gripe já está disponível. Agende seu horário.</p>
                        </div>
                        <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                            <p className="text-sm text-blue-800 font-medium">Atualização Cadastral</p>
                            <p className="text-xs text-blue-700 mt-1">Por favor, confirme seu número de telefone na próxima visita.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Status de Saúde</h3>
                    {/* Chart or simple stats could go here */}
                    <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-400 text-sm">Gráfico de Histórico de Pressão</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
