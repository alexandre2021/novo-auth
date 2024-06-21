# **Projeto de Gestão de Salão de Beleza (SaaS)**

## **Descrição do Projeto**

Este projeto é uma aplicação web mobile para gestão de salões de beleza, desenvolvida com Next.js para o frontend e Node.js com Supabase para o backend. A estrutura de arquivos é baseada na pasta app.

## **Tecnologias Utilizadas**

- **Frontend**: Next.js
- **Backend**: Node.js com Supabase
- **CSS**: Bootstrap

## **Estrutura de Arquivos**

- A estrutura do projeto é baseada na pasta app.
- O CSS é tratado por Bootstrap, e não Tailwind.

## **Autenticação e Autorização**

- Utilizamos o Supabase para autenticação de usuários, incluindo registro e recuperação de senha.

## **Middleware**

- Temos dois arquivos de middleware:
  - **middleware.js** na raiz: Originalmente pretendia-se consolidar tudo em um único middleware, mas a implementação atual ainda requer a análise do propósito deste arquivo.
  - **middleware.js** em utils/supabase: Responsável por gerenciar a sessão do usuário, incluindo a autenticação e a configuração de cookies.

## **Dificuldades Enfrentadas e Soluções**

1. **Erro com Client Components**:
    - **Descrição**: "You're importing a component that needs useEffect. It only works in a Client Component but none of its parents are marked with 'use client', so they're Server Components by default."
    - **Solução**: Incluímos a diretiva "use client" onde necessário.
2. **Erro com Exportação de Metadata**:
    - **Descrição**: "You are attempting to export 'metadata' from a component marked with 'use client', which is disallowed."
    - **Solução**: Removemos a exportação de metadata dos componentes marcados com "use client".
3. **Instalação Indesejada do TypeScript**:
    - **Descrição**: Ao rodar npm run dev, o Next.js insistia em instalar TypeScript e criar um arquivo tsconfig.json automaticamente.
    - **Solução**: Removemos todas as referências a arquivos TypeScript e modificamos a configuração para evitar a reinstalação.
4. **Erro de Dependência de TailwindCSS**:
    - **Descrição**: Problemas ao remover TailwindCSS, que causaram erros durante a compilação.
    - **Solução**: Garantimos que todas as dependências e configurações do TailwindCSS foram removidas completamente.
5. **Dificuldade com Exclusão de Arquivos TypeScript**:
    - **Descrição**: Ao excluir arquivos TypeScript, como tsconfig.json e next-env.d.ts, eles eram recriados automaticamente ao rodar npm run dev.
    - **Solução**: Removemos completamente qualquer configuração relacionada ao TypeScript no projeto.
6. **Problemas com Autenticação e Registro**:
    - **Descrição**: Configuração de autenticação e registro de usuários utilizando Supabase, incluindo o envio de e-mails de confirmação.
    - **Solução**: Implementamos corretamente as funcionalidades de registro e login, incluindo a recuperação de senha e validação por e-mail.
7. **Problemas ao Diferenciar Componentes Client e Server**:
    - **Descrição**: Dificuldade em identificar e separar componentes que deveriam ser client-side ou server-side.
    - **Solução**: Revisamos os componentes e ajustamos as diretivas use client e use server conforme necessário.
8. **Problemas Gerais de Configuração e Compilação**:
    - **Descrição**: Vários erros de configuração, como erros de compilação e dependências faltantes ou incorretas.
    - **Solução**: Corrigimos a configuração do projeto para garantir que todas as dependências e configurações estavam corretas.
9. **Configuração Incorreta do Supabase Client**:
    - **Erro**: Tivemos problemas na configuração inicial do cliente Supabase.
    - **Correção**: Corrigimos a configuração conforme o [vídeo de instalação do Supabase](https://www.youtube.com/watch?v=yDJcdDa6la0) e o [roteiro de instalação do Supabase](https://supabase.com/docs/guides/auth/server-side/nextjs).
10. **Erro com &lt;a&gt; que precisa de legacyBehavior**:
    - **Descrição**: Erro frequente ao utilizar o componente &lt;a&gt; dentro do &lt;Link&gt; do Next.js.
    - **Solução**: Ajustamos os componentes para usar legacyBehavior ou removemos &lt;a&gt; conforme necessário.

## **Como Contribuir**

1. Clone o repositório.
2. Crie uma branch para sua feature (git checkout -b feature/nova-feature).
3. Faça commit das suas alterações (git commit -m 'Adiciona nova feature').
4. Faça push para a branch (git push origin feature/nova-feature).
5. Abra um Pull Request.

## **Referências**

- [Vídeo de instalação do Supabase](https://www.youtube.com/watch?v=yDJcdDa6la0)
- [Roteiro de instalação do Supabase](https://supabase.com/docs/guides/auth/server-side/nextjs)