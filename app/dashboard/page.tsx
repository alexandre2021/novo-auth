// app/dashboard/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase/client';
import Sidebar from '../components/Sidebar';

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/'); // Direciona para a home se não estiver logado
        return;
      }

      console.log('User Data:', user);
      setUser(user); // Defina o estado do usuário aqui

      const isStep1 = localStorage.getItem('step1') === 'true';
      if (isStep1) {
        router.push('/step1'); // Direciona para a página step1 se a configuração não está concluída
      }
    };

    fetchData();
  }, []);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container p-4">
        <h1>Dashboard</h1>
        {/* Conteúdo de dashboard */}
      </div>
    </div>
  );
};

export default DashboardPage;
