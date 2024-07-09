// app/configuracoes/page.tsx
import React from 'react';
import Sidebar from '../components/Sidebar';

const ConfiguracoesPage: React.FC = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container p-4">
        <h1>Configurações</h1>
        {/* Conteúdo de configurações */}
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
