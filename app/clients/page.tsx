// app/calendar/page.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';

const ClientsPage = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container p-4">
        <h1>Clientes</h1>
        {/* Conteúdo de clientes */}
      </div>
    </div>
  );
};

export default ClientsPage;
