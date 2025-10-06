# Control Tasks - Backend

## Projeto Backend desenvolvido com NestJS, TypeScript, Prisma ORM e MySQL


## Tecnologias Utilizadas

### Backend
- [NestJS](https://nestjs.com/) - Framework Node.js
- [TypeScript](https://www.typescriptlang.org/) 
- [Prisma ORM](https://www.prisma.io/) - ORM para banco de dados
- [MySQL](https://www.mysql.com/) - Banco de dados relacional
- [JWT](https://jwt.io/) - Autenticação baseada em tokens
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - Hash de senhas

## Arquitetura do Backend

O backend segue uma **arquitetura em camadas** baseada em **Clean Architecture** e **Domain-Driven Design (DDD)**:

## Funcionalidades do Backend

### Sistema de Autenticação
- **JWT Token** - Autenticação baseada em tokens
- **Hash de senhas** - Bcrypt para segurança
- **Guards** - Proteção de rotas com decorators
- **Validação de usuário** - Middleware de autenticação

### Gerenciamento de Usuários
- **CRUD completo** - Create, Read, Update
- **Validação de dados** - Email único, validações de entrada
- **Tipos de usuário** - USER e ADMIN
- **Permissões** - Usuário só edita próprio perfil, Admin edita todos

### Gerenciamento de Notas/Tarefas
- **CRUD completo** - Create, Read, Update, Delete
- **Sistema de status** - 6 status diferentes (PENDING, TODO, IN_PROGRESS, REVIEW, COMPLETED, CANCELLED)
- **Prioridades** - 4 níveis (LOW, MEDIUM, HIGH, URGENT)
- **Categorias** - Notas e Tarefas
- **Atribuição** - Notas podem ser atribuídas a usuários
- **Filtros avançados** - Por título, status, prioridade, categoria, datas, usuário, equipe

### Sistema de Estatísticas
- **Contadores por status** - Quantas notas em cada status
- **Estatísticas por usuário** - Dashboard personalizado
- **Notas em atraso** - Lista de tarefas vencidas

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 22 ou superior)
- [MySQL](https://www.mysql.com/) (versão 8.0 ou superior)
- npm ou yarn
- Git

## Configuração e Instalação

### 1. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 2. Configure as variáveis de ambiente
Crie um arquivo .env na raiz da pasta `project-back`:

```env
# Database
DATABASE_URL="mysql://usuario:senha@localhost:3306/task_manager"

# API
PORT=3000
```

### 3. Configure o banco de dados

#### Crie o banco de dados MySQL
```sql
CREATE DATABASE notes;
```

#### Execute as migrações do Prisma
```bash
# Gera o cliente Prisma
npx prisma generate

# Executa as migrações (cria as tabelas)
npx prisma migrate dev

# Opcional: Visualizar o banco com Prisma Studio
npx prisma studio
```

### 4. Execute a aplicação

#### Modo de desenvolvimento
```bash
npm run start:dev
# ou
yarn start:dev
```

#### Modo de produção
```bash
# Build da aplicação
npm run build

# Executa a versão de produção
npm run start:prod
```

A API estará disponível em `http://localhost:3000`

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev        # Inicia em modo desenvolvimento (watch mode)
npm run start            # Inicia aplicação

# Banco de Dados
npx prisma generate      # Gera cliente Prisma
npx prisma migrate dev   # Executa migrações
npx prisma studio        # Interface visual do banco
npx prisma migrate reset # Reset completo do banco (CUIDADO!)
```

## Estrutura do Banco de Dados


## API Endpoints

### Autenticação
```http
POST /users/authenticate    # Login do usuário
POST /users                 # Registro de usuário
```

### Usuários
```http
GET    /users/:id          # Buscar usuário por ID
PUT    /users/:id          # Atualizar dados do usuário
```

### Notas/Tarefas
```http
GET    /notes                    # Listar todas as notas (com filtros)
GET    /notes/my-notes/:userId   # Notas do usuário específico
GET    /notes/team/:teamId       # Notas da equipe
GET    /notes/overdue/list       # Notas em atraso
GET    /notes/stats/:userId      # Estatísticas do usuário
GET    /notes/:id                # Buscar nota específica
POST   /notes                    # Criar nova nota
PUT    /notes/:id                # Atualizar nota
DELETE /notes/:id                # Deletar nota
PUT    /notes/:id/assign         # Atribuir nota a usuário
PUT    /notes/:id/unassign       # Desatribuir nota
```

### Filtros Disponíveis (Query Parameters)
```typescript
{
  title?: string;          // Busca por título
  status?: string;         // PENDING|TODO|IN_PROGRESS|REVIEW|COMPLETED|CANCELLED
  priority?: string;       // LOW|MEDIUM|HIGH|URGENT
  category?: string;       // note|task
  startDate?: string;      // Data início (ISO)
  endDate?: string;        // Data fim (ISO)
  assignedToId?: string;   // ID do responsável
  teamId?: string;         // ID da equipe
  createdById?: string;    // ID do criador
}
```

## Padrões Arquiteturais Utilizados

### Clean Architecture
- **Separação de responsabilidades** em camadas distintas
- **Inversão de dependência** - Use cases não dependem de infraestrutura
- **Testabilidade** - Lógica de negócio isolada

### Repository Pattern
- **Abstração do banco** - Use cases não conhecem Prisma diretamente
- **Facilita testes** - Mock dos repositórios
- **Flexibilidade** - Troca de ORM sem impacto

### Use Case Pattern
- **Lógica de negócio** centralizada em casos de uso
- **Single Responsibility** - Cada use case tem uma responsabilidade
- **Reutilização** - Use cases podem ser chamados de diferentes controllers

### Guard Pattern
- **Autenticação** - Proteção automática de rotas
- **Autorização** - Verificação de permissões
- **Decorators** - Aplicação simples com `@UseGuards()`

## Segurança Implementada

### Autenticação JWT
- **Token seguro** com secret forte
- **Expiração configurável** (365 dias)
- **Verificação automática** em rotas protegidas

### Hash de Senhas
- **Bcrypt** com salt rounds = 10
- **Senhas nunca expostas** em logs ou responses
- **Validação segura** no login

### Validações
- **DTOs tipados** com class-validator
- **Sanitização** de dados de entrada
- **Verificação de permissões** por usuário

## Tratamento de Erros

### 📋 Respostas Padronizadas
```typescript
// Sucesso
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}

// Erro
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### 🔍 HTTP Status Codes
- **200** - Success
- **400** - Bad Request / Validation Error
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Internal Server Error

## Monitoramento e Logs

### 📊 Logs de Desenvolvimento
- **Request/Response** logging em desenvolvimento
- **Error tracking** com stack traces
- **Database queries** visíveis em modo debug

### 🔧 Debug do Prisma
```bash
# Habilitar logs do Prisma
DEBUG=prisma:query npm run start:dev
```

## Ambiente de Produção

### Configurações Recomendadas
```env
NODE_ENV=production
DATABASE_URL="mysql://user:pass@host:port/database"
JWT_SECRET="your-super-secret-key-here"
PORT=3000
```

### 📦 Deploy
```bash
# Build da aplicação
npm run build

# Executar migrações em produção
npx prisma migrate deploy

# Iniciar aplicação
npm run start:prod
```

---
