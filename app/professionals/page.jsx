// app/professionals/page.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';

const ProfessionalsPage = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container p-4">
        <h1>Profissionais</h1>
        {/* Conteúdo de professionais */}
      </div>
    </div>
  );
};

export default ProfessionalsPage;
