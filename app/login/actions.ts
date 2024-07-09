// app/login/actions.ts
// recebe dados dos formulário de login e cadastro usa signInWithPassword e signUp

'use server'

import { redirect } from 'next/navigation'
import { supabaseAdmin } from '../../utils/supabase/server'

export async function login(formData: FormData): Promise<void> {
  const supabase = supabaseAdmin;

  const { email, password } = Object.fromEntries(formData.entries()) as { email: string, password: string };

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Login error:', error.message);
    redirect('/error');
  } else {
    redirect('/dashboard');
  }
}

export async function signup(formData: FormData): Promise<void> {
  const supabase = supabaseAdmin;

  const { email, password } = Object.fromEntries(formData.entries()) as { email: string, password: string };

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error('Signup error:', error.message);
    redirect('/error');
  } else {
    redirect('/login');
  }
}
