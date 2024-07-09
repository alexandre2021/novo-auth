'use client';
import { useState, FormEvent } from 'react';
import { supabase } from '../../utils/supabase/client';

export default function ResendVerification() {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Email digitado:', email);
    
    const { data: user, error: fetchError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError) {
      console.error('Erro ao buscar usuário por email:', fetchError.message);
      setMessage('Email não encontrado.');
      return;
    }

    // Solicitar que o usuário faça login novamente para acionar o envio do e-mail de verificação
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: 'dummyPassword', // Senha fictícia, ajuste conforme necessário
    });

    if (signInError) {
      console.error('Erro ao solicitar novo link de verificação:', signInError.message);
      setMessage('Erro ao solicitar novo link de verificação. Por favor, tente novamente.');
    } else {
      setMessage('Link de verificação enviado com sucesso. Verifique seu e-mail.');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2 className="text-center">Link inválido ou expirado</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Solicitar novo link</button>
      </form>
    </div>
  );
}
