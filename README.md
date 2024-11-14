# Sistema de Autenticação com JWT

Este projeto implementa um sistema de autenticação baseado em JSON Web Token (JWT), que protege rotas e permite acesso a determinads informações somente para usuários autenticados...

## 📂 Estrutura do Projeto

O projeto é composto por uma série de arquivos, destacando-se os seguintes:

- **`src/index.ts`** – Configura e inicializa a aplicação.
- **`src/database.ts`** – Gerencia a conexão e configuração do banco de dados.
- **`src/middlewares/jwt.middlewares.ts`** – Middleware para autenticação e validação de tokens JWT.
- **`src/middlewares/user.middlewares.ts`** – Middleware para validação e controle das operações de usuário.
- **`src/routes/index.ts`** – Define as rotas principais da aplicação.
- **`src/routes/static.ts`** – Serve arquivos estáticos, como HTML, CSS e JavaScript.
- **`src/routes/token.ts`** – Rotas para geração, renovação e verificação dos tokens JWT.
- **`src/routes/user.ts`** – Gerencia rotas de criação, listagem, atualização e remoção de usuários.
- **`src/util/jwtPromise.ts`** – Utilitário para operações JWT baseadas em promessas (decodificação, verificação, criação, etc.).

## 🚀 Configuração e Execução

### 1. Instalar Dependências
Para rodar o projeto, instale as dependências com o comando abaixo, executado no diretório do projeto:
```bash
npm install
```

### 2. Iniciar o Servidor
Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
```
A aplicação estará acessível em http://localhost:3000.

# 🧪 Testagem do Sistema
O sistema possui uma estrutura com páginas HTML estáticas para facilitar o acesso a diferentes áreas:

- **Login**: http://localhost:3000/index.html
- **Registro**: http://localhost:3000/registro.html
- **Acesso Privado**: http://localhost:3000/acesso-privado.html
- **Acesso Público**: http://localhost:3000/acesso-publico.html

## Passo a Passo de Testagem
### 1. **Login**
- Acesse a página de login e entre com as credenciais:
	- **Email**: ``susan@mail.com``
  - **Senha**: ``123123``
- Após o login, o sistema exibirá uma mensagem de sucesso e armazenará o token JWT no ``localStorage``. Você será redirecionado para a página de ``acesso-privado.html``.
### 2. **Carregar Lista de Usuários**
- Na página de acesso privado, use o botão "CARREGAR LISTA" para carregar uma lista de usuários cadastrados. Essa função é protegida e só funciona se o usuário estiver autenticado com um token válido.
### 3. **Logout**
- Para sair, clique no botão "SAIR". O token será removido, e o usuário será redirecionado para a página pública.
### 4. **Registro de Novo Usuário**
- Acesse a página de registro para criar um novo usuário. Após um registro bem-sucedido, o sistema redirecionará o usuário para a página de login, onde ele poderá entrar com as novas credenciais.
### 5. **Acesso Público**
- A página de acesso público está disponível em ``/acesso-publico.html``, com links para login e registro.
