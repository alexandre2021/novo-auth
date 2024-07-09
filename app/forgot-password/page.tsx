'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Lógica para enviar e-mail de recuperação de senha
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form className="w-25" onSubmit={handleSubmit}>
        <h2 className="mb-4">Recuperar Senha</h2>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Endereço de e-mail</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Enviar E-mail de Recuperação</button>
        <div className="mt-3 text-center">
          <a href="/login" className="text-decoration-none">Voltar ao Login</a>
        </div>
      </form>
    </div>
  );
}
