// components/Topbar.js 1
'use client';
import React from 'react';
import Link from 'next/link';
import { PersonCircle } from 'react-bootstrap-icons';

const Topbar = ({ user }) => {
  return (
    <div className="topbar">
      <Link href="/" legacyBehavior>
        <a>Agendo Mais</a>
      </Link>
      {user ? (
        <div>
          <PersonCircle size={30} style={{ marginRight: '10px' }} />
          <Link href="/dashboard" legacyBehavior>
            <a>{user.email}</a>
          </Link>
        </div>
      ) : (
        <Link href="/login" legacyBehavior>
          <a className="button-login">Login</a>
        </Link>
      )}
    </div>
  );
};

export default Topbar;


