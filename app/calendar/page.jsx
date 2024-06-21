// app/calendar/page.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';

const CalendarPage = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container p-4">
        <h1>Calendário</h1>
        {/* Conteúdo do calendário */}
      </div>
    </div>
  );
};

export default CalendarPage;
