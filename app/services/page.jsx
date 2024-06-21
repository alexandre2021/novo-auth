// app/services/page.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';

const ServicesPage = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container p-4">
        <h1>Serviços</h1>
        {/* Conteúdo de serviços */}
      </div>
    </div>
  );
};

export default ServicesPage;
