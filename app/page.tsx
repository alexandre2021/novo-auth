// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/auth-js'; // Importa o tipo User do Supabase
import { supabase } from '../utils/supabase/client';
import Topbar from './components/Topbar';
import './styles/globals.css';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
      } else {
        console.log('User data:', data.user);
        setUser(data.user);
      }
    };

    getUser();
  }, []);

  return (
    <div>
      <Topbar user={user} />
      <h1 className="text-center">Welcome to our App!</h1>
    </div>
  );
}
