# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/672d8676-259a-421f-ab12-9dd27fd34e88

## Como executar este projeto

### Frontend e Backend

Este projeto contém tanto o frontend React quanto um backend Node.js separado para processamento de eventos.

```sh
# Passo 1: Clone o repositório
git clone <URL_DO_GIT>

# Passo 2: Navegue até a pasta do projeto
cd <NOME_DO_PROJETO>

# Passo 3: Instale as dependências do frontend
npm i

# Passo 4: Configure as variáveis de ambiente do backend
cp server/.env.example server/.env
# Edite o arquivo server/.env com suas credenciais

# Passo 5: Instale as dependências do backend
cd server
npm i
cd ..

# Passo 6: Execute o frontend
npm run dev

# Passo 7: Em outra janela de terminal, execute o backend
cd server
npm run dev
```

**Nota**: Para que o backend funcione corretamente, você precisa configurar:
- Um servidor Redis (para uso do BullMQ)
- Credenciais do Meta Pixel e Conversions API

## Estrutura do projeto

### Frontend (React + TypeScript)

O frontend usa React, Tailwind CSS e shadcn-ui.

### Backend (Node.js + TypeScript)

O backend está na pasta `server/` e consiste em:

- API Express para receber eventos
- BullMQ para processamento assíncrono
- Integração com Meta Conversions API
- Validação com Zod
- Filas para processamento resiliente

## Como usar a API do backend

### Verificação de saúde
```
GET /healthz
```

### Envio de eventos
```
POST /track
{
  "event_name": "ViewContent",
  "value": 10.99,
  "currency": "BRL",
  "custom_data": {
    "content_name": "Produto X",
    "content_type": "product"
  }
}
```

## Como editar o código

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/672d8676-259a-421f-ab12-9dd27fd34e88) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Como posso implantar este projeto?

Simply open [Lovable](https://lovable.dev/projects/672d8676-259a-421f-ab12-9dd27fd34e88) and click on Share -> Publish.

## Posso conectar um domínio personalizado ao meu projeto Lovable?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
