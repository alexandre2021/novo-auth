'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase/client';
import '../styles/pages/step5.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Schedule {
  start: string;
  end: string;
  isOpen: boolean;
}

export default function Step5() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  const initialSchedule: Record<string, Schedule> = {
    'Segunda-Feira': { start: '09:00', end: '18:00', isOpen: true },
    'Terça-Feira': { start: '09:00', end: '18:00', isOpen: true },
    'Quarta-Feira': { start: '09:00', end: '18:00', isOpen: true },
    'Quinta-Feira': { start: '09:00', end: '18:00', isOpen: true },
    'Sexta-Feira': { start: '09:00', end: '18:00', isOpen: true },
    'Sábado-Feira': { start: '09:00', end: '18:00', isOpen: true },
    'Domingo-Feira': { start: '-', end: '-', isOpen: false },
  };

  const [schedule, setSchedule] = useState<Record<string, Schedule>>(initialSchedule);

  useEffect(() => {
    const step1Completed = sessionStorage.getItem('step1Completed');
    const step2Completed = sessionStorage.getItem('step2Completed');
    const step3Completed = sessionStorage.getItem('step3Completed');
    const step4Completed = sessionStorage.getItem('step4Completed');

    if (step1Completed && step2Completed && step3Completed && step4Completed) {
      setIsAuthorized(true);
    } else {
      router.push('/step1');
    }
  }, [router]);

  useEffect(() => {
    const savedSchedule = sessionStorage.getItem('schedule');
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
    }
  }, []);

  const handleScheduleChange = (day: string, key: keyof Schedule, value: string | boolean) => {
    setSchedule(prevSchedule => {
      let updatedDaySchedule: Schedule = { ...prevSchedule[day], [key]: value };

      if (day === 'Domingo-Feira' && key === 'isOpen' && value) {
        updatedDaySchedule = { start: '09:00', end: '18:00', isOpen: true };
      }

      if (key === 'start' && typeof value === 'string' && value >= prevSchedule[day].end) {
        toast.error('O horário de início deve ser anterior ao horário de término.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          //style: { backgroundColor: '#f8d7da', color: '#721c24' },
        });
        return prevSchedule;
      }

      if (key === 'end' && typeof value === 'string' && value <= prevSchedule[day].start) {
        toast.error('O horário de término deve ser após o horário de início.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          //style: { backgroundColor: '#f8d7da', color: '#721c24' },
        });
        return prevSchedule;
      }

      return {
        ...prevSchedule,
        [day]: updatedDaySchedule,
      };
    });
  };

  const handleNextStep = async () => {
    const selectedSchedule = Object.keys(schedule).reduce((acc: (string | null)[], day) => {
      const daySchedule = schedule[day];
      if (daySchedule.isOpen) {
        acc.push(daySchedule.start);
        acc.push(daySchedule.end);
      } else {
        acc.push(null);
        acc.push(null);
      }
      return acc;
    }, []);
  
    sessionStorage.setItem('schedule', JSON.stringify(schedule));
    sessionStorage.setItem('selectedSchedule', JSON.stringify(selectedSchedule));
    sessionStorage.setItem('step5Completed', 'true');
  
    const selectedType = sessionStorage.getItem('selectedType');
    const selectedServices = JSON.parse(sessionStorage.getItem('selectedServices') || '[]');
    const selectedProfiles = JSON.parse(sessionStorage.getItem('selectedProfiles') || '[]');
    const selectedCategories = JSON.parse(sessionStorage.getItem('categoriesSelected') || '[]');
    const cep = sessionStorage.getItem('cep');
    const bairro = sessionStorage.getItem('bairro');
    const logradouro = sessionStorage.getItem('logradouro');
    const numero = sessionStorage.getItem('numero');
  
    const address = `${logradouro}, ${numero}, ${bairro}, ${cep}`;
  
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profissionalData, error: profissionalError } = await supabase
        .from('profissionais')
        .select('estabelecimento_id')
        .eq('email', user.email)
        .single();
  
      if (profissionalError) throw profissionalError;
  
      const estabelecimentoId = profissionalData.estabelecimento_id;
  
      const { error: estabelecimentoError } = await supabase
        .from('estabelecimentos')
        .update({
          tipo_estabelecimento: selectedType,
          endereco: address,
          segunda: schedule['Segunda-Feira'],
          terca: schedule['Terça-Feira'],
          quarta: schedule['Quarta-Feira'],
          quinta: schedule['Quinta-Feira'],
          sexta: schedule['Sexta-Feira'],
          sabado: schedule['Sábado-Feira'],
          domingo: schedule['Domingo-Feira']
        })
        .eq('id', estabelecimentoId);
  
      if (estabelecimentoError) throw estabelecimentoError;
  
      const servicePromises = selectedServices.map((service: string) => {
        return supabase.from('servicos_opcoes').insert([
          { estabelecimento_id: estabelecimentoId, opcao: service }
        ]);
      });
      await Promise.all(servicePromises);
  
      const profilePromises = selectedProfiles.map((profile: string) => {
        return supabase.from('perfis_opcoes').insert([
          { estabelecimento_id: estabelecimentoId, opcao: profile }
        ]);
      });
      await Promise.all(profilePromises);
  
      const categoryPromises = selectedCategories.map((category: string) => {
        return supabase.from('categorias_opcoes').insert([
          { estabelecimento_id: estabelecimentoId, opcao: category }
        ]);
      });
      await Promise.all(categoryPromises);
  
      const { error: updateProfissionalError } = await supabase
        .from('profissionais')
        .update({ configuracao: true })
        .eq('email', user.email);
  
      if (updateProfissionalError) throw updateProfissionalError;
  
      toast.success('Dados salvos com sucesso!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        //style: { backgroundColor: '#d4edda', color: '#155724' },
      });
  
      setTimeout(() => {
        localStorage.setItem('step1', 'false');
        sessionStorage.clear();
        router.push('/dashboard');
      }, 2000);
  
    } catch (error) {
      console.error('Erro ao salvar os dados:', error.message);
      toast.error('Erro ao salvar os dados. Tente novamente.', {
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
    sessionStorage.setItem('schedule', JSON.stringify(schedule));
    router.push('/step4');
  };

  if (!isAuthorized) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="step5-container">
      <h1>Configuração da conta</h1>
      <h2>Horário de funcionamento</h2>
      <div className="step5-schedule-list">
        {Object.keys(schedule).map((day) => (
          <div className="day-row" key={day}>
            <label className="day-label">
              <input
                type="checkbox"
                checked={schedule[day].isOpen}
                onChange={(e) => handleScheduleChange(day, 'isOpen', e.target.checked)}
              />
              {day}
            </label>
            {schedule[day].isOpen ? (
              <div className="time-inputs">
                <select
                  value={schedule[day].start}
                  onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                >
                  {Array.from({ length: 24 }, (_, hour) =>
                  ['00', '10', '20', '30', '40', '50'].map(min => (
                    <option key={`${hour}:${min}`} value={`${String(hour).padStart(2, '0')}:${min}`}>
                      {`${String(hour).padStart(2, '0')}:${min}`}
                    </option>
                  ))
                )}
                </select>
                <select
                  value={schedule[day].end}
                  onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                >
                  {Array.from({ length: 24 }, (_, hour) =>
                    ['00', '10', '20', '30', '40', '50'].map(min => (
                      <option key={`${hour}:${min}`} value={`${String(hour).padStart(2, '0')}:${min}`}>
                        {`${String(hour).padStart(2, '0')}:${min}`}
                      </option>
                    ))
                  )}
                </select>
              </div>
            ) : (
              <div className="closed-time">
                <span>-</span>
                <span>-</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="step5-button-container">
        <div className="step5-btn-wrapper-left">
          <button className="step5-btn-secondary" onClick={handlePreviousStep}>Voltar</button>
        </div>
        <div className="step5-btn-wrapper-right">
          <button className="step5-btn-primary" onClick={handleNextStep}>Salvar</button>
        </div>
      </div>
      <div className="step5-step-indicator">
        <span className="step5-completed"></span>
        <span className="step5-completed"></span>
        <span className="step5-completed"></span>
        <span className="step5-completed"></span>
        <span className="step5-active"></span>
      </div>
      <ToastContainer />
    </div>
  );
}
