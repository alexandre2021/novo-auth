// app/login/page.jsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      if (authError.message.includes('Email not confirmed')) {
        toast.error(
          <div>
            Seu email não foi confirmado. Por favor, verifique seu email.
            <button onClick={() => resendVerificationEmail(email)} className="btn btn-link p-0 m-0">
              Reenviar link de verificação
            </button>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            //style: { backgroundColor: '#f8d7da', color: '#721c24' },
          }
        );
      } else {
        console.error('Login error:', authError.message);
        toast.error('Falha no login', {
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
    } else {
      console.log('Login com sucesso:', authData);

      const { data: profissionalData, error: profissionalError } = await supabase
        .from('profissionais')
        .select('administrador, configuracao')
        .eq('email', email)
        .single();

      if (profissionalError) {
        console.error('Erro ao buscar dados do profissional:', profissionalError.message);
        toast.error('Erro ao buscar dados do profissional', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          //style: { backgroundColor: '#f8d7da', color: '#721c24' },
        });
      } else if (profissionalData) {
        console.log('Dados do profissional:', profissionalData);
        toast.success('Login com sucesso', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          //style: { backgroundColor: '#d4edda', color: '#155724' },
        });

        if (profissionalData.administrador && !profissionalData.configuracao) {
          localStorage.setItem('step1', 'true');
          setTimeout(() => {
            router.push('/step1');
          }, 2000);
        } else {
          localStorage.setItem('step1', 'false');
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }
      } else {
        console.error('Profissional não encontrado');
        toast.error('Profissional não encontrado', {
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
    }
  };

  const resendVerificationEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin, // Altere o redirecionamento conforme necessário
    });
    if (error) {
      console.error('Erro ao reenviar link de verificação:', error.message);
      toast.error('Erro ao reenviar link de verificação', {
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
      toast.success('Link de verificação reenviado com sucesso!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        //style: { backgroundColor: '#d4edda', color: '#155724' },
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <ToastContainer />
      <form className="w-25" onSubmit={handleSubmit}>
        <h2 className="mb-4">Login</h2>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Endereço de e-mail</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
        <div className="mt-3 text-center">
          <a href="/forgot-password" className="text-decoration-none">Esqueceu a senha?</a>
        </div>
        <div className="mt-3 text-center">
          <a href="/register" className="text-decoration-none">Não tem uma conta? Cadastre-se</a>
        </div>
      </form>
    </div>
  );
}
