'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase/client';
import '../styles/pages/step3.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Profile {
  id: string;
  opcao: string;
  tipo_estabelecimento: string;
}

export default function Step3() {
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Verifica se o usuário está logado
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  // Verifica se os passos 1 e 2 foram concluídos
  useEffect(() => {
    const step1Completed = sessionStorage.getItem('step1Completed');
    const step2Completed = sessionStorage.getItem('step2Completed');
    if (!step1Completed || !step2Completed) {
      router.push('/step1');
    }
  }, [router]);

  // Busca os perfis baseados no tipo de estabelecimento selecionado
  useEffect(() => {
    const fetchProfiles = async () => {
      const selectedType = sessionStorage.getItem('selectedType');
      if (selectedType) {
        const { data, error } = await supabase
          .from('perfis_opcoes_ref')
          .select('*')
          .eq('tipo_estabelecimento', selectedType);
        if (error) {
          console.error('Erro ao buscar perfis:', error);
        } else {
          setProfiles(data as Profile[]);
          const savedSelectedTypePerfil = sessionStorage.getItem('savedSelectedTypePerfil');
          if (savedSelectedTypePerfil !== selectedType) {
            sessionStorage.setItem('savedSelectedTypePerfil', selectedType);
            sessionStorage.removeItem('selectedProfiles');
            // Marcar todos os perfis por padrão
            const allProfiles = (data as Profile[]).map(profile => profile.opcao);
            setSelectedProfiles(allProfiles);
            sessionStorage.setItem('selectedProfiles', JSON.stringify(allProfiles));
          } else {
            const savedProfiles = JSON.parse(sessionStorage.getItem('selectedProfiles') || '[]');
            setSelectedProfiles(savedProfiles);
          }
        }
      }
    };
    fetchProfiles();
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    let updatedProfiles;
    if (checked) {
      updatedProfiles = [...selectedProfiles, value];
    } else {
      updatedProfiles = selectedProfiles.filter(profile => profile !== value);
    }
    setSelectedProfiles(updatedProfiles);
    sessionStorage.setItem('selectedProfiles', JSON.stringify(updatedProfiles));
  };

  const handleNextStep = () => {
    if (selectedProfiles.length > 0) {
      sessionStorage.setItem('selectedProfiles', JSON.stringify(selectedProfiles));
      sessionStorage.setItem('step3Completed', 'true'); // Indicar que o passo 3 foi concluído
      router.push('/step4');
    } else {
      toast.error('Por favor, selecione pelo menos um perfil.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        //style: { backgroundColor: '#f8d7da', color: '#721c24' },
      });
    }
  };

  const handlePreviousStep = () => {
    router.push('/step2');
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="step3-container">
      <ToastContainer />
      <h1>Configuração da conta</h1>
      <h2>Seleção de perfis</h2>
      <div className="step3-services-grid">
        {profiles.map((profile) => (
          <div className="step3-col" key={profile.id}>
            <input
              type="checkbox"
              id={profile.id}
              name="profiles"
              value={profile.opcao}
              checked={selectedProfiles.includes(profile.opcao)}
              onChange={handleCheckboxChange}
            />
            <label htmlFor={profile.id}>{profile.opcao}</label>
          </div>
        ))}
      </div>
      <div className="step3-button-container">
        <div className="step3-btn-wrapper-left">
          <button className="step3-btn-secondary" onClick={handlePreviousStep}>Voltar</button>
        </div>
        <div className="step3-btn-wrapper-right">
          <button className="step3-btn-primary" onClick={handleNextStep}>Próximo</button>
        </div>
      </div>
      <div className="step3-step-indicator">
        <span className="step3-completed"></span>
        <span className="step3-complete"></span>
        <span className="step3-active"></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
