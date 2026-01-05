
import React from 'react';

export default function MedicoExameDetalhesPage({ params }: { params: { id: string } }) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Detalhes do Exame</h1>
            <p>ID do Exame: {params.id}</p>
            {/* Laudo, imagens, etc */}
        </div>
    );
}
