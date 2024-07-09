'use client';

import { useState, FormEvent } from 'react';
import { supabase } from '../../utils/supabase/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputMask from 'react-input-mask';
import '../styles/pages/register.css';


export default function Register() {
  const [estabelecimento, setEstabelecimento] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [telefone, setTelefone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [acceptPolicies, setAcceptPolicies] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        //style: { backgroundColor: '#f8d7da', color: '#721c24' },
      });
      return;
    }

    if (!acceptPolicies) {
      toast.error('Você deve aceitar os termos e políticas de uso', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        //style: { backgroundColor: '#f8d7da', color: '#721c24' },
      });
      return;
    }

    try {
      console.log('Verificando email...');

      // Verificar existência de email
      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('email')
        .eq('email', email);

      if (userData && userData.length > 0) {
        toast.error('Email já registrado', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          //style: { backgroundColor: '#f8d7da', color: '#721c24' },
        });
        return;
      }

      // Verificar existência de nome do estabelecimento
      const { data: estabelecimentoData, error: estabelecimentoError } = await supabase
        .from('estabelecimentos')
        .select('nome')
        .eq('nome', estabelecimento);

      if (estabelecimentoData && estabelecimentoData.length > 0) {
        toast.error('Nome do estabelecimento já registrado', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          //style: { backgroundColor: '#f8d7da', color: '#721c24' },
        });
        return;
      }

      console.log('Email e estabelecimento não registrados, prosseguindo com registro...');

      // Registrar usuário
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
            telefone,
          },
        },
      });

      if (signUpError) {
        toast.error('Erro ao registrar usuário', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          //style: { backgroundColor: '#f8d7da', color: '#721c24' },
        });
        console.error('Erro ao registrar usuário:', signUpError);
        return;
      }

      // Criar registro na tabela estabelecimentos
      const { data: newEstabelecimentoData, error: newEstabelecimentoError } = await supabase
        .from('estabelecimentos')
        .insert([
          { nome: estabelecimento },
        ])
        .select();

      if (newEstabelecimentoError) {
        toast.error('Erro ao registrar estabelecimento', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          //style: { backgroundColor: '#f8d7da', color: '#721c24' },
        });
        console.error('Erro ao registrar estabelecimento:', newEstabelecimentoError);
        return;
      }

      const estabelecimentoId = newEstabelecimentoData[0].id;

      // Criar registro na tabela profissionais
      const { data: profissionalData, error: profissionalError } = await supabase
        .from('profissionais')
        .insert([
          {
            estabelecimento_id: estabelecimentoId,
            nome,
            email,
            telefone,
            administrador: true,
            configuracao: false,
          },
        ])
        .select();

      if (profissionalError) {
        toast.error('Erro ao registrar profissional', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          //style: { backgroundColor: '#f8d7da', color: '#721c24' },
        });
        console.error('Erro ao registrar profissional:', profissionalError);
        return;
      }

      const profissionalId = profissionalData[0].id;

      // Atualizar registro na tabela estabelecimentos com o ID do profissional
      const { error: updateError } = await supabase
        .from('estabelecimentos')
        .update({ profissionais: [profissionalId] })
        .eq('id', estabelecimentoId);

      if (updateError) {
        toast.error('Erro ao atualizar estabelecimento', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          //style: { backgroundColor: '#f8d7da', color: '#721c24' },
        });
        console.error('Erro ao atualizar estabelecimento:', updateError);
        return;
      }

      toast.success('Usuário registrado com sucesso. Por favor, verifique seu e-mail.', {
        position: "top-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        //style: { backgroundColor: '#d4edda', color: '#155724' },
      });
      setTimeout(() => {
        window.location.href = '/';
      }, 3000); // 3 segundos
    } catch (error) {
      toast.error('Erro ao registrar usuário', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        //style: { backgroundColor: '#f8d7da', color: '#721c24' },
      });
      console.error('Erro inesperado:', error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form className="w-25" onSubmit={handleSubmit}>
        <h2 className="mb-4">Cadastre-se</h2>
        <ToastContainer />
        <div className="mb-3">
          <label htmlFor="estabelecimento" className="form-label">Estabelecimento</label>
          <input
            type="text"
            className="form-control"
            id="estabelecimento"
            value={estabelecimento}
            onChange={(e) => setEstabelecimento(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">Nome</label>
          <input
            type="text"
            className="form-control"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="telefone" className="form-label">Telefone</label>
          <InputMask
            mask="(99) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          >
            {(inputProps) => <input {...inputProps} className="form-control" id="telefone" required />}
          </InputMask>
        </div>
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
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirme a Senha</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3 register-checkbox">
          <input
            type="checkbox"
            id="acceptPolicies"
            required
            checked={acceptPolicies}
            onChange={() => setAcceptPolicies(!acceptPolicies)}
          />
          <label htmlFor="acceptPolicies" className="form-label">
            Aceito os <a href="/politicas" target="_blank" className="link-terms">termos e políticas</a>
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-100">Registrar</button>
        <div className="mt-3 text-center">
          <a href="/login" className="text-decoration-none">Já tem uma conta? Login</a>
        </div>
      </form>
    </div>
  );




}
