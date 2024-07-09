'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase/client';
import '../styles/pages/step1.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Estabelecimento {
  id: string;
  tipo: string;
  imagem_url: string;
}

export default function Step1() {
  const [selectedType, setSelectedType] = useState<string>('');
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Retrieve previously selected type from session storage
    const savedType = sessionStorage.getItem('selectedType');
    if (savedType) {
      setSelectedType(savedType);
    }
  }, []);

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

  // Busca os tipos de estabelecimento do Supabase
  useEffect(() => {
    const fetchEstablishments = async () => {
      const { data, error } = await supabase
        .from('tipos_estabelecimento_ref')
        .select('*');
      
      if (error) {
        console.error('Erro ao buscar estabelecimentos:', error);
      } else {
        setEstabelecimentos(data as Estabelecimento[]);
      }
    };
    fetchEstablishments();
  }, []);

  const handleNextStep = () => {
    if (selectedType) {
      sessionStorage.setItem('selectedType', selectedType); // Salvar o tipo selecionado
      sessionStorage.setItem('step1Completed', 'true'); // Indicar que o passo 1 foi concluído
      router.push('/step2');
    } else {
      toast.error('Por favor, selecione um tipo de estabelecimento.', {
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="step1-container">
      <h1>Configuração da conta</h1>
      <h2>Seleção do tipo de estabelecimento</h2>
      <div className="tipo-estabelecimento">
        {estabelecimentos.map((estabelecimento) => (
          <div className="col" key={estabelecimento.id}>
            <input
              type="radio"
              id={estabelecimento.id}
              name="establishment-type"
              value={estabelecimento.tipo}
              checked={selectedType === estabelecimento.tipo}
              onChange={() => setSelectedType(estabelecimento.tipo)}
            />
            <label htmlFor={estabelecimento.id}>
              <img src={estabelecimento.imagem_url} alt={estabelecimento.tipo} />
              <p>{estabelecimento.tipo}</p>
            </label>
          </div>
        ))}
      </div>      
      <button className="btn btn-primary" onClick={handleNextStep}>Próximo</button>
      <div className="step-indicator">
        <span className="active"></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="image-rights">
        Icons hair dryer, hair, spa and relax, physiotherapy, botox, nails, foot massage created by Freepik from <a href="https://www.flaticon.com" target="_blank" rel="noopener noreferrer">www.flaticon.com</a>
      </div>
      <ToastContainer />
    </div>
  );
}
