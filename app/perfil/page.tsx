// app/perfil/page.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';

const PerfilPage = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container p-4">
        <h1>Perfil</h1>
        {/* Perfil do usuário */}
      </div>
    </div>
  );
};

export default PerfilPage;