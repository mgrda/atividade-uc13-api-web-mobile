
import React from 'react';

export default function MedicoConsultaDetalhesPage({ params }: { params: { id: string } }) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Detalhes da Consulta</h1>
            <p>ID da Consulta: {params.id}</p>
            {/* Prontuário, anotações, etc */}
        </div>
    );
}
