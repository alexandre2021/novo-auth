// app/dashboard/page.jsx 1
import React from 'react';
import Sidebar from '../components/Sidebar';

const DashboardPage = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container p-4">
        <h1>Painel</h1>
        {/* Conteúdo do painel */}
      </div>
    </div>
  );
};

export default DashboardPage;
