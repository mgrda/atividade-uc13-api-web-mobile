
import { Calendar, Clock, User, CheckCircle, XCircle, MoreVertical, FileText, Search } from 'lucide-react';
import Button from '@/components/Button';

export default function MedicoAgendaPage() {
    // Mock data
    const todayAppointments = [
        { id: 1, time: '08:00', patient: 'Ana Silva', type: 'Consulta Rotina', status: 'Concluído', avatar: 'AS' },
        { id: 2, time: '08:30', patient: 'Carlos Oliveira', type: 'Retorno', status: 'Em Andamento', avatar: 'CO' },
        { id: 3, time: '09:00', patient: 'Mariana Santos', type: 'Primeira Vez', status: 'Aguardando', avatar: 'MS' },
        { id: 4, time: '09:30', patient: 'Roberto Costa', type: 'Exame', status: 'Aguardando', avatar: 'RC' },
        { id: 5, time: '10:00', patient: 'Julia Ferreira', type: 'Retorno', status: 'Cancelado', avatar: 'JF' },
    ];

    const stats = [
        { label: 'Hoje', value: '12', sub: 'Consultas', color: 'bg-cyan-100 text-cyan-700' },
        { label: 'Aguardando', value: '4', sub: 'Pacientes', color: 'bg-orange-100 text-orange-700' },
        { label: 'Finalizados', value: '3', sub: 'Atendimentos', color: 'bg-green-100 text-green-700' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Concluído': return 'text-green-700 bg-green-50 border-green-200';
            case 'Em Andamento': return 'text-blue-700 bg-blue-50 border-blue-200';
            case 'Aguardando': return 'text-orange-700 bg-orange-50 border-orange-200';
            case 'Cancelado': return 'text-red-700 bg-red-50 border-red-200';
            default: return 'text-gray-700 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header com Stats */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Agenda do Dia</h1>
                    <p className="text-gray-500 flex items-center gap-2 mt-1">
                        <Calendar size={16} />
                        Quinta-feira, 19 de Dezembro
                    </p>
                </div>
                <div className="flex gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className={`px-4 py-2 rounded-xl flex flex-col items-center min-w-[100px] ${stat.color}`}>
                            <span className="text-2xl font-bold">{stat.value}</span>
                            <span className="text-xs font-medium uppercase tracking-wide opacity-80">{stat.sub}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filtros e Busca */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar paciente..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <select className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-cyan-500 bg-transparent cursor-pointer">
                        <option>Todos os Status</option>
                        <option>Aguardando</option>
                        <option>Finalizados</option>
                    </select>
                    <Button className="px-6">
                        Adicionar Encaixe
                    </Button>
                </div>
            </div>

            {/* Tabela de Agendamentos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="p-4 w-24">Horário</th>
                                <th className="p-4">Paciente</th>
                                <th className="p-4">Tipo</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {todayAppointments.map((apt) => (
                                <tr key={apt.id} className="hover:bg-cyan-50/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 font-medium text-gray-700">
                                            <Clock size={16} className="text-cyan-500" />
                                            {apt.time}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {apt.avatar}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{apt.patient}</p>
                                                <p className="text-xs text-gray-500">Prontuário: #829{apt.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded-md">
                                            {apt.type}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(apt.status)}`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {apt.status !== 'Concluído' && apt.status !== 'Cancelado' && (
                                                <button className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg tooltip" title="Iniciar Atendimento">
                                                    <FileText size={18} />
                                                </button>
                                            )}
                                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
