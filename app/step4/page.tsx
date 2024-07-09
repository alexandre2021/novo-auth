'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase/client';
import '../styles/pages/step4.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputMask from 'react-input-mask';

export default function Step4() {
  const [cep, setCep] = useState<string>('');
  const [bairro, setBairro] = useState<string>('');
  const [logradouro, setLogradouro] = useState<string>('');
  const [numero, setNumero] = useState<string>('');
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

  // Verifica se os passos 1, 2 e 3 foram concluídos
  useEffect(() => {
    const step1Completed = sessionStorage.getItem('step1Completed');
    const step2Completed = sessionStorage.getItem('step2Completed');
    const step3Completed = sessionStorage.getItem('step3Completed');
    if (!step1Completed || !step2Completed || !step3Completed) {
      router.push('/step1');
    }
  }, [router]);

  // Recupera as informações salvas no sessionStorage
  useEffect(() => {
    const savedCep = sessionStorage.getItem('cep');
    const savedBairro = sessionStorage.getItem('bairro');
    const savedLogradouro = sessionStorage.getItem('logradouro');
    const savedNumero = sessionStorage.getItem('numero');
    
    if (savedCep) setCep(savedCep);
    if (savedBairro) setBairro(savedBairro);
    if (savedLogradouro) setLogradouro(savedLogradouro);
    if (savedNumero) setNumero(savedNumero);
  }, []);

  // Busca informações de endereço pelo CEP
  const fetchAddress = async () => {
    if (cep.length === 9) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
        const data = await response.json();
        if (data.erro) {
          toast.error('CEP não encontrado.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            //style: { backgroundColor: '#f8d7da', color: '#721c24' },
          });
        } else {
          setBairro(data.bairro);
          setLogradouro(data.logradouro);
        }
      } catch (error) {
        console.error('Erro ao buscar o endereço:', error);
      }
    }
  };

  useEffect(() => {
    fetchAddress();
  }, [cep]);

  const handleNextStep = () => {
    if (cep && bairro && logradouro && numero) {
      sessionStorage.setItem('cep', cep);
      sessionStorage.setItem('bairro', bairro);
      sessionStorage.setItem('logradouro', logradouro);
      sessionStorage.setItem('numero', numero);
      sessionStorage.setItem('step4Completed', 'true'); // Indicar que o passo 4 foi concluído
      router.push('/step5');
    } else {
      toast.error('Por favor, preencha todos os campos.', {
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
    sessionStorage.setItem('cep', cep);
    sessionStorage.setItem('bairro', bairro);
    sessionStorage.setItem('logradouro', logradouro);
    sessionStorage.setItem('numero', numero);
    router.push('/step3');
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="step4-container">
      <ToastContainer />
      <h1>Configuração da conta</h1>
      <h2>Endereço do estabelecimento</h2>
      <div className="step4-input-container">
        <InputMask
          mask="99999-999"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
        >
          {(inputProps) => <input {...inputProps} placeholder="CEP" />}
        </InputMask>
        <input
          type="text"
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
          placeholder="BAIRRO"
        />
        <input
          type="text"
          value={logradouro}
          onChange={(e) => setLogradouro(e.target.value)}
          placeholder="LOGRADOURO"
        />
        <input
          type="text"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="NÚMERO"
        />
      </div>
      <div className="step4-button-container">
        <div className="step4-btn-wrapper-left">
          <button className="step4-btn-secondary" onClick={handlePreviousStep}>Voltar</button>
        </div>
        <div className="step4-btn-wrapper-right">
          <button className="step4-btn-primary" onClick={handleNextStep}>Próximo</button>
        </div>
      </div>
      <div className="step4-step-indicator">
        <span className="step4-completed"></span>
        <span className="step4-completed"></span>
        <span className="step4-completed"></span>
        <span className="step4-active"></span>
        <span></span>
      </div>
    </div>
  );
}