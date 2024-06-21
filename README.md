# Novo Auth

## Descrição do Projeto
Aplicativo web mobile para gestão de salões de beleza (SaaS) usando Next.js para o frontend e Node.js com Supabase para o backend.

## Estrutura do Projeto
- Baseado na pasta `app`
- Uso de `bootstrap` para CSS

## Dificuldades Enfrentadas e Soluções
- **Erro com Client Components:** Necessidade de incluir a diretiva `use client`
- **Erro com Exportação de Metadata:** Remover exportação de metadata em componentes marcados com `use client`
- **Instalação Indesejada do TypeScript:** Remover referências a arquivos TypeScript e evitar reinstalação
- **Erro de Dependência de TailwindCSS:** Remover completamente TailwindCSS
- **Dificuldade com Exclusão de Arquivos TypeScript:** Remover configurações relacionadas ao TypeScript
- **Problemas com Autenticação e Registro:** Implementar registro e login com Supabase
- **Problemas ao Diferenciar Componentes Client e Server:** Ajustar diretivas `use client` e `use server`
- **Problemas Gerais de Configuração e Compilação:** Corrigir configuração do projeto
- **Configuração Incorreta do Supabase Client:** Corrigir conforme tutorial do Supabase
- **Erro com `<Link>` e `<a>`:** Utilizar `legacyBehavior` em `<Link>` quando necessário

## Configuração dos Middlewares
- Dois arquivos middleware:
  - **Raiz:** Atualmente sem funcionalidade clara
  - **`utils/supabase/middleware.js`:** Configuração e atualização da sessão do Supabase

## Outros Detalhes
- Não usamos TypeScript
- CSS tratado por Bootstrap

## Links Úteis
- [Video tutorial](https://www.youtube.com/watch?v=yDJcdDa6la0)
- [Documentação Supabase](https://supabase.com/docs/guides/auth/server-side/nextjs)

## Comandos Git
Para atualizar o `README.md` localmente e fazer o push:
1. `notepad README.md`
2. `git add README.md`
3. `git commit -m "Atualiza o README.md com informações detalhadas"`
4. `git push origin main`
