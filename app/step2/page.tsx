'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase/client';
import '../styles/pages/step2.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Service {
  id: string;
  opcao: string;
  tipo_estabelecimento: string;
}

interface Category {
  categoria: string;
}

export default function Step2() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
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

  // Verifica se o passo 1 foi concluído
  useEffect(() => {
    const step1Completed = sessionStorage.getItem('step1Completed');
    if (!step1Completed) {
      router.push('/step1');
    }
  }, [router]);

  // Busca os serviços baseados no tipo de estabelecimento selecionado
  useEffect(() => {
    const fetchServices = async () => {
      const selectedType = sessionStorage.getItem('selectedType');
      if (selectedType) {
        const { data, error } = await supabase
          .from('servicos_opcoes_ref')
          .select('*')
          .eq('tipo_estabelecimento', selectedType);

        if (error) {
          console.error('Erro ao buscar serviços:', error);
        } else {
          setServices(data as Service[]);
          const savedSelectedType = sessionStorage.getItem('savedSelectedType');
          if (savedSelectedType !== selectedType) {
            sessionStorage.setItem('savedSelectedType', selectedType);
            sessionStorage.removeItem('selectedServices');
            sessionStorage.removeItem('categoriesSelected');
            // Marcar todos os serviços por padrão
            const allServices = (data as Service[]).map(service => service.opcao);
            setSelectedServices(allServices);
            sessionStorage.setItem('selectedServices', JSON.stringify(allServices));
          } else {
            const savedServices = JSON.parse(sessionStorage.getItem('selectedServices') || '[]');
            setSelectedServices(savedServices);
            const savedCategories = JSON.parse(sessionStorage.getItem('categoriesSelected') || '[]');
            setCategoriesSelected(savedCategories);
          }
        }
      }
    };
    fetchServices();
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    let updatedServices;
    if (checked) {
      updatedServices = [...selectedServices, value];
    } else {
      updatedServices = selectedServices.filter(service => service !== value);
    }
    setSelectedServices(updatedServices);
    sessionStorage.setItem('selectedServices', JSON.stringify(updatedServices));
  };

  const handleNextStep = async () => {
    if (selectedServices.length > 0) {
      sessionStorage.setItem('selectedServices', JSON.stringify(selectedServices));
      sessionStorage.setItem('step2Completed', 'true'); // Indicar que o passo 2 foi concluído
      
      // Buscar categorias dos serviços selecionados
      const { data, error } = await supabase
        .from('categorias_opcoes_ref')
        .select('categoria')
        .in('servico', selectedServices);
      
      if (error) {
        console.error('Erro ao buscar categorias:', error);
      } else {
        const categories = [...new Set((data as Category[]).map(category => category.categoria))];
        setCategoriesSelected(categories);
        sessionStorage.setItem('categoriesSelected', JSON.stringify(categories));
      }

      router.push('/step3');
    } else {
      toast.error('Por favor, selecione pelo menos um serviço.', {
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
    router.push('/step1');
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="step2-container">
      <ToastContainer />
      <h1>Configuração da conta</h1>
      <h2>Seleção de serviços</h2>
      <div className="step2-services-grid">
        {services.map((service) => (
          <div className="step2-col" key={service.id}>
            <input
              type="checkbox"
              id={service.id}
              name="services"
              value={service.opcao}
              checked={selectedServices.includes(service.opcao)} // Verifica se o checkbox está marcado
              onChange={handleCheckboxChange}
            />
            <label htmlFor={service.id}>{service.opcao}</label>
          </div>
        ))}
      </div>
      <div className="step2-button-container">
        <div className="step2-btn-wrapper-left">
          <button className="step2-btn-secondary" onClick={handlePreviousStep}>Voltar</button>
        </div>
        <div className="step2-btn-wrapper-right">
          <button className="step2-btn-primary" onClick={handleNextStep}>Próximo</button>
        </div>
      </div>
      <div className="step2-step-indicator">
        <span className="step2-completed"></span>
        <span className="step2-active"></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
