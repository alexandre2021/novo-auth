/** @type {import('next').NextConfig} */
/*  garantir que as variáveis de ambiente estejam disponíveis no servidor e cliente*/
/*  automaticamente aplicada em todo o projeto pelo Next.js*/
/*  variáveis de ambiente prefixadas com NEXT_PUBLIC_ (anon) são automaticamente expostas/* 
/*  Role_key não tem o prefixo NEXT_PUBLIC_*/

const nextConfig = {
  env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
};

module.exports = nextConfig;
