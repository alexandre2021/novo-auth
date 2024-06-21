// components/Sidebar.js 1
'use client';

import React, { useState } from 'react';
import { House, Speedometer2, Calendar, PeopleFill, Scissors, PersonBadge, PersonCircle } from 'react-bootstrap-icons';
import { OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase/client';
import Image from 'next/image';

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.close();
      window.open('/', '_self');
    }
  };

  const renderTooltip = (text) => (
    <Tooltip id="button-tooltip">
      {text}
    </Tooltip>
  );

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{ width: '4.5rem', height: '100vh' }}>
      <div className="logo-container mb-3">
        <Image src="/logo.png" alt="Logo" width={40} height={40} />
      </div>
      <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
        <li className="nav-item">
          <OverlayTrigger placement="right" overlay={renderTooltip('Home')}>
            <a href="/" className="nav-link py-3 border-bottom">
              <House size={30} />
            </a>
          </OverlayTrigger>
        </li>
        <li className="nav-item">
          <OverlayTrigger placement="right" overlay={renderTooltip('Painel')}>
            <a href="/dashboard" className="nav-link py-3 border-bottom">
              <Speedometer2 size={30} />
            </a>
          </OverlayTrigger>
        </li>
        <li className="nav-item">
          <OverlayTrigger placement="right" overlay={renderTooltip('Calendário')}>
            <a href="/calendar" className="nav-link py-3 border-bottom">
              <Calendar size={30} />
            </a>
          </OverlayTrigger>
        </li>
        <li className="nav-item">
          <OverlayTrigger placement="right" overlay={renderTooltip('Clientes')}>
            <a href="/clients" className="nav-link py-3 border-bottom">
              <PeopleFill size={30} />
            </a>
          </OverlayTrigger>
        </li>
        <li className="nav-item">
          <OverlayTrigger placement="right" overlay={renderTooltip('Serviços')}>
            <a href="/services" className="nav-link py-3 border-bottom">
              <Scissors size={30} />
            </a>
          </OverlayTrigger>
        </li>
        <li className="nav-item">
          <OverlayTrigger placement="right" overlay={renderTooltip('Profissionais')}>
            <a href="/professionals" className="nav-link py-3 border-bottom">
              <PersonBadge size={30} />
            </a>
          </OverlayTrigger>
        </li>
      </ul>
      <div className="dropdown mt-auto">
        <Dropdown>
          <Dropdown.Toggle as="a" className="d-flex align-items-center">
            <PersonCircle size={30} className="me-2" />
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item href="/perfil">Perfil</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Sair</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Sidebar;






