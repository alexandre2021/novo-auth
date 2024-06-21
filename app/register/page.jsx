'use client';

import { useState } from 'react';
import { supabase } from '../../utils/supabase/client';

export default function Register() {
  const [estabelecimento, setEstabelecimento] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      console.log('Verificando email...');
      const { error: checkError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy_password', // Senha dummy apenas para checar a existência do usuário
      });

      if (!checkError) {
        setError('Email já registrado');
        return;
      }

      if (checkError.message !== 'Invalid login credentials') {
        console.error('Erro ao verificar email:', checkError);
        setError('Erro ao verificar email');
        return;
      }

      console.log('Email não registrado, prosseguindo com registro...');

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            estabelecimento,
            nome,
            telefone,
          },
        },
        redirectTo: 'http://localhost:3000',
      });

      if (signUpError) {
        setError('Erro ao registrar usuário');
        console.error('Erro ao registrar usuário:', signUpError);
      } else {
        setError('Usuário registrado com sucesso. Por favor, verifique seu e-mail.');
      }
    } catch (error) {
      setError('Erro ao registrar usuário');
      console.error('Erro inesperado:', error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form className="w-25" onSubmit={handleSubmit}>
        <h2 className="mb-4">Cadastre-se</h2>
        {error && <div className="alert alert-danger">{error}</div>}
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
          <input
            type="tel"
            className="form-control"
            id="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
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
        <button type="submit" className="btn btn-primary w-100">Registrar</button>
        <div className="mt-3 text-center">
          <a href="/login" className="text-decoration-none">Já tem uma conta? Login</a>
        </div>
      </form>
    </div>
  );
}


