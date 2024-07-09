'use client';

import React, { useEffect, useState } from 'react';
import { Speedometer2, Calendar, People, Scissors, PersonBadge, PersonCircle, Gear } from 'react-bootstrap-icons';
import { OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase/client';
import Image from 'next/image';

const Sidebar = () => {
  const router = useRouter();
  const [pathname, setPathname] = useState<string>('');

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.close();
      window.open('/', '_self');
    }
  };

  const renderTooltip = (text: string) => (
    <Tooltip id="button-tooltip">
      {text}
    </Tooltip>
  );

  return (
    <div className="sidebar">
      <div className="logo-container mb-3">
        <a href="/">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
        </a>
      </div>
      <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
        <li className="nav-item">
          <OverlayTrigger placement="right" overlay={renderTooltip('Painel')}>
            <a href="/dashboard" className={`nav-link py-3 border-bottom ${pathname === '/dashboard' ? 'active' : ''}`}>
              <Speedometer2 size={30} className="sidebar-icon" fill="black" />
            </a>
          </OverlayTrigger>
        </li>
        <li className="nav-item">
          <OverlayTrigger placement="right" overlay={renderTooltip('Calendário')}>
            <a href="/calendar" className={`nav-link py-3 border-bottom ${pathname === '/calendar' ? 'active' : ''}`}>
              <Calendar size={30} className="sidebar-icon" fill="black"/>
            </a>
          </OverlayTrigger>
        </li>
        <li className="nav-item">
          <OverlayTrigger placement="right" overlay={renderTooltip('Clientes')}>
            <a href="/clients" className={`nav-link py-3 border-bottom ${pathname === '/clients' ? 'active' : ''}`}>
              <People size={30} className="sidebar-icon" fill="black"/>
            </a>
          </OverlayTrigger>
        </li>
        <li className="nav-item">
          <OverlayTrigger placement="right" overlay={renderTooltip('Serviços')}>
            <a href="/services" className={`nav-link py-3 border-bottom ${pathname === '/services' ? 'active' : ''}`}>
              <Scissors size={30} className="sidebar-icon" fill="black"/>
            </a>
          </OverlayTrigger>
        </li>
        <li className="nav-item">
          <OverlayTrigger placement="right" overlay={renderTooltip('Profissionais')}>
            <a href="/professionals" className={`nav-link py-3 border-bottom ${pathname === '/professionals' ? 'active' : ''}`}>
              <PersonBadge size={30} className="sidebar-icon" fill="black"/>
            </a>
          </OverlayTrigger>
        </li>
        <li className="nav-item">
          <OverlayTrigger placement="right" overlay={renderTooltip('Configurações')}>
            <a href="/configuracoes" className={`nav-link py-3 border-bottom ${pathname === '/configuracoes' ? 'active' : ''}`}>
              <Gear size={30} className="sidebar-icon" fill="black"/>
            </a>
          </OverlayTrigger>
        </li>
      </ul>
      <div className="dropdown mt-auto">
        <Dropdown>
          <Dropdown.Toggle as="a" className="d-flex align-items-center">
            <PersonCircle size={30} className="sidebar-icon me-0.1" />
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

