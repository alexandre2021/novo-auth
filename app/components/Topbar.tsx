'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../utils/supabase/client';
import { PersonCircle } from 'react-bootstrap-icons';
import { User } from '@supabase/auth-js'; // Importa o tipo User do Supabase

interface TopbarProps {
  user: User | null;
}

const Topbar: React.FC<TopbarProps> = ({ user }) => {
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
