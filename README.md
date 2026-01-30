# Template React + TypeScript + Tailwind + Supabase

Template limpo e moderno para iniciar projetos React com TypeScript, Tailwind CSS e Supabase.

## 🚀 Tecnologias

- **React 19** com TypeScript
- **Vite** - Build tool rápida e moderna
- **Tailwind CSS** para estilização
- **Supabase** para backend (cliente configurado)
- **TanStack Router** para roteamento

## 📦 Instalação

```bash
npm i
```

## 🏃 Executando o Projeto

```bash
npm run dev
```

O projeto estará disponível em [http://localhost:5173](http://localhost:5173)

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa o linter

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── ui/             # Componentes de UI básicos
├── services/           # Serviços e integrações externas
│   └── supabaseClient.ts  # Cliente Supabase configurado
├── routes/             # Configuração do TanStack Router
├── types/              # Definições TypeScript
└── utils/              # Funções utilitárias
```

## 🔧 Configuração do Supabase (Opcional)

Se você quiser usar o Supabase, copie o arquivo `env.example` para `.env` e configure:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

O cliente Supabase já está configurado em `src/services/supabaseClient.ts` e pode ser importado diretamente nos seus componentes.

## 📝 Uso

Este é um template limpo, pronto para ser usado como base para seus projetos. A tela inicial mostra as tecnologias utilizadas e serve como ponto de partida.

Para mais detalhes sobre o template (estrutura, como estender, scripts), veja [TEMPLATE.md](./TEMPLATE.md).

## 📖 Documentação

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Router Documentation](https://tanstack.com/router)

## 📄 Licença

Este projeto está sob a licença MIT.
