# 📝 Control Tasks - Backend API

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-11.0.1-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.16.2-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

API REST para sistema de gerenciamento de notas e tarefas com colaboração em equipe, construída com NestJS seguindo princípios de Clean Architecture.

</div>

---

## Sobre o Projeto

**Control Tasks Backend** é uma API robusta e escalável para gerenciamento de tarefas e anotações. Desenvolvida com NestJS e TypeScript, implementa Clean Architecture para garantir separação de responsabilidades, testabilidade e manutenibilidade do código.

### Principais Características

-  **Autenticação JWT** - Sistema completo de autenticação com API tokens
-  **Gerenciamento de Usuários** - Registro, login e perfis de usuário
-  **CRUD de Tarefas** - Criação, leitura, atualização e exclusão de notas/tarefas
-  **Sistema de Prioridades** - Níveis LOW, MEDIUM, HIGH, URGENT
-  **Status Workflow** - PENDING → TODO → IN_PROGRESS → REVIEW → COMPLETED/CANCELLED
-  **Categorização** - Diferenciação entre notas e tarefas
-  **Colaboração em Equipe** - Estrutura de times com administrador
-  **Filtros Avançados** - Busca por múltiplos critérios (título, status, prioridade, datas, etc.)
-  **Estatísticas** - Métricas de produtividade por usuário
-  **Segurança** - Hash bcrypt para senhas, guards para rotas protegidas

---

## Tecnologias

### Core

- **[NestJS](https://nestjs.com/)** `^11.0.1` - Framework Node.js progressivo para aplicações server-side
- **[TypeScript](https://www.typescriptlang.org/)** `^5.7.3` - Superset JavaScript com tipagem estática
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript

### Database & ORM

- **[Prisma](https://www.prisma.io/)** `^6.16.2` - ORM moderno para TypeScript/Node.js
- **[MySQL](https://www.mysql.com/)** - Sistema de gerenciamento de banco de dados relacional
- **[@prisma/client](https://www.prisma.io/docs/concepts/components/prisma-client)** - Cliente gerado automaticamente para type-safe queries

### Autenticação & Segurança

- **[@nestjs/jwt](https://docs.nestjs.com/security/authentication#jwt-token)** `^11.0.0` - Integração JWT para NestJS
- **[@nestjs/passport](https://docs.nestjs.com/security/authentication)** `^11.0.5` - Integração Passport.js
- **[Passport](https://www.passportjs.org/)** `^0.7.0` - Middleware de autenticação
- **[passport-jwt](http://www.passportjs.org/packages/passport-jwt/)** `^4.0.1` - Estratégia JWT para Passport
- **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)** `^6.0.0` - Hash seguro de senhas

### Validação & Transformação

- **[class-validator](https://github.com/typestack/class-validator)** `^0.14.2` - Validação declarativa baseada em decorators
- **[class-transformer](https://github.com/typestack/class-transformer)** `^0.5.1` - Transformação de objetos plain para classes

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn** ou **pnpm**
- **MySQL** (versão 8.0 ou superior)

---

## Instalação

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd project-back
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/notes"
SHADOW_DATABASE_URL="mysql://user:password@localhost:3306/notes_shadow"

# Server
PORT=3000
```

4. **Execute as migrações do banco de dados**

```bash
# Gera o cliente Prisma
npx prisma generate

# Aplica as migrações
npx prisma migrate deploy

# (Opcional) Visualizar banco de dados no Prisma Studio
npx prisma studio
```

---

## Como Usar

### Desenvolvimento

Inicie o servidor:

```bash
npm run start
```

A API estará disponível em `http://localhost:3000`

---

## Estrutura do Projeto

```
project-back/
├── prisma/
│   ├── migrations/          # Migrações do banco de dados
│   └── schema.prisma        # Schema do Prisma (models, enums, relations)
├── src/
│   ├── application/         # Camada de Aplicação (Clean Architecture)
│   │   ├── entities/       # Entidades de domínio com lógica de negócio
│   │   │   ├── note.entity.ts      # Entidade Note com métodos de domínio
│   │   │   ├── user.entity.ts
│   │   │   ├── team.entity.ts
│   │   │   └── api-token.entity.ts
│   │   └── use-cases/      # Casos de uso (business logic)
│   │       ├── auth/       # Autenticação e tokens
│   │       ├── notes/      # CRUD e operações de notas
│   │       └── user/       # Gerenciamento de usuários
│   ├── infra/              # Camada de Infraestrutura
│   │   ├── auth/          # Guards e decorators de autenticação
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── current-user.decorator.ts
│   │   │   └── auth.module.ts
│   │   ├── controllers/   # Endpoints HTTP (REST)
│   │   │   ├── user.controller.ts
│   │   │   └── notes.controller.ts
│   │   ├── database/      # Prisma e repositórios
│   │   │   ├── prisma-service.ts
│   │   │   ├── database.module.ts
│   │   │   └── repositories/
│   │   │       ├── prisma-user.repository.ts
│   │   │       ├── prisma-note.repository.ts
│   │   │       └── prisma-api-token.repository.ts
│   │   ├── dtos/          # Data Transfer Objects (validação)
│   │   │   ├── user/
│   │   │   └── notes/
│   │   └── notes-system.module.ts  # Módulo principal da aplicação
│   ├── helpers/           # Utilitários e helpers
│   ├── app.module.ts      # Módulo raiz da aplicação
│   └── main.ts            # Entry point (bootstrap)
├── test/                  # Testes (unit & e2e)
├── .eslintrc.js           # Configuração ESLint
├── nest-cli.json          # Configuração NestJS CLI
├── tsconfig.json          # Configuração TypeScript
└── package.json           # Dependências e scripts
```

---

## Arquitetura

### Clean Architecture

O projeto implementa **Clean Architecture** com separação clara entre camadas:

#### 1. **Application Layer** (`src/application/`)

**Entities** - Modelos de domínio com lógica de negócio:
- `Note`: Métodos como `complete()`, `cancel()`, `assignTo()`, `isOverdue()`, `canBeEditedBy()`
- `User`: Lógica relacionada a usuários
- `Team`: Lógica de equipes
- `ApiToken`: Lógica de tokens

**Use Cases** - Casos de uso encapsulando regras de negócio:
- Cada operação é uma classe com método `execute()`
- Exemplos: `CreateNoteUseCase`, `AuthenticateUserUseCase`, `AssignNoteUseCase`

#### 2. **Infrastructure Layer** (`src/infra/`)

**Controllers** - Gerenciam requisições HTTP
**Database** - Implementação Prisma (repositories)
**Auth** - Guards, estratégias e decorators
**DTOs** - Validação de entrada com class-validator

### Fluxo de Requisição

```
┌──────────┐      ┌────────────┐      ┌──────────┐      ┌────────────┐
│  Client  │─────>│ Controller │─────>│ Use Case │─────>│ Repository │
│ (HTTP)   │      │  (Route)   │      │ (Logic)  │      │ (Prisma)   │
└──────────┘      └────────────┘      └──────────┘      └────────────┘
                        │                    │                  │
                        v                    v                  v
                  ┌─────────┐          ┌─────────┐        ┌─────────┐
                  │   DTO   │          │ Entity  │        │ Database│
                  │Validation│         │ Domain  │        │  MySQL  │
                  └─────────┘          └─────────┘        └─────────┘
```

---

## Modelos de Dados

### User
```prisma
model User {
  id         Int      @id @default(autoincrement())
  email      String   @unique
  name       String
  password   String   // Hash bcrypt
  userType   UserType @default(USER)  // ADMIN | USER
  teamId     Int?
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}
```

### Note
```prisma
model Note {
  id           Int        @id @default(autoincrement())
  title        String
  description  String?
  status       NoteStatus @default(PENDING)
  priority     Priority   @default(MEDIUM)
  category     Category?  // note | task
  assignedToId Int?
  createdById  Int
  teamId       Int?
  dueDate      DateTime?
  created_at   DateTime   @default(now())
  updated_at   DateTime   @updatedAt
}
```

### Enums

**NoteStatus**: `PENDING` | `TODO` | `IN_PROGRESS` | `REVIEW` | `COMPLETED` | `CANCELLED`

**Priority**: `LOW` | `MEDIUM` | `HIGH` | `URGENT`

**Category**: `note` | `task`

**UserType**: `ADMIN` | `USER`

---

## Autenticação

### Fluxo de Autenticação

```
┌─────────────┐       ┌─────────────┐       ┌──────────────┐
│   Client    │       │   Backend   │       │   Database   │
└──────┬──────┘       └──────┬──────┘       └──────┬───────┘
       │                     │                     │
       │  POST /users/auth   │                     │
       │  {email, password}  │                     │
       │────────────────────>│                     │
       │                     │  Busca user         │
       │                     │────────────────────>│
       │                     │<────────────────────│
       │                     │  Valida bcrypt      │
       │                     │                     │
       │                     │  Cria API Token     │
       │                     │────────────────────>│
       │                     │<────────────────────│
       │   { token, user }   │                     │
       │<────────────────────│                     │
       │                     │                     │
       │  Requests com       │                     │
       │  Authorization:     │                     │
       │  Bearer <token>     │                     │
       │────────────────────>│  Valida token       │
       │                     │────────────────────>│
       │                     │<────────────────────│
       │   Response          │                     │
       │<────────────────────│                     │
```

### Sistema de Tokens

1. **Login** → `POST /users/authenticate`
   - Valida credenciais (email + senha bcrypt)
   - Gera API token único
   - Armazena na tabela `ApiToken`
   - Retorna token para o cliente

2. **Requisições Autenticadas**
   - Header: `Authorization: Bearer <token>`
   - `ApiTokenGuard` valida o token
   - Decorator `@CurrentUser()` injeta usuário autenticado

3. **Expiração & Revogação**
   - Tokens podem ter `expiresAt` configurável
   - Flag `revoked` para invalidar tokens
   - Cascade delete ao remover usuário

---

## API Endpoints

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `POST` | `/users` | Criar novo usuário | ❌ |
| `POST` | `/users/authenticate` | Login e obter token | ❌ |

### Usuários

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/users/:id` | Buscar usuário por ID | ✅ |
| `PUT` | `/users/:id` | Atualizar usuário (apenas próprio perfil ou ADMIN) | ✅ |

### Notas/Tarefas

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/notes` | Listar todas as notas com filtros | ✅ |
| `GET` | `/notes/my-notes/:userId` | Notas do usuário (criadas ou atribuídas) | ✅ |
| `GET` | `/notes/stats/:userId` | Estatísticas do usuário | ✅ |
| `GET` | `/notes/:id` | Buscar nota específica | ✅ |
| `POST` | `/notes` | Criar nova nota | ✅ |
| `PUT` | `/notes/:id` | Atualizar nota | ✅ |
| `DELETE` | `/notes/:id` | Deletar nota | ✅ |
| `PUT` | `/notes/:id/assign` | Atribuir nota a usuário | ✅ |
| `PUT` | `/notes/:id/unassign` | Remover atribuição | ✅ |

### Filtros Disponíveis (Query Params)

**GET `/notes` e `/notes/my-notes/:userId`**

```typescript
{
  title?: string;          // Busca parcial no título
  status?: NoteStatus;     // PENDING, TODO, IN_PROGRESS, etc.
  priority?: Priority;     // LOW, MEDIUM, HIGH, URGENT
  category?: Category;     // note, task
  assignedToId?: number;   // ID do responsável
  teamId?: number;         // ID da equipe
  createdById?: number;    // ID do criador
  startDate?: string;      // Data inicial (ISO)
  endDate?: string;        // Data final (ISO)
}
```

### Formato de Resposta

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
```

### Segurança Implementada

- ✅ Hash bcrypt (salt rounds 10) para senhas
- ✅ Guards em rotas protegidas (`@UseGuards(ApiTokenGuard)`)
- ✅ Validação de entrada com class-validator
- ✅ Verificação de permissões (usuários só editam próprio perfil)
- ✅ Tokens únicos com expiração configurável

---

## Boas Práticas Implementadas

- ✅ **Clean Architecture** - Separação clara entre domínio e infraestrutura
- ✅ **SOLID Principles** - Single Responsibility, Dependency Injection
- ✅ **Repository Pattern** - Abstração da camada de dados
- ✅ **Use Case Pattern** - Encapsulamento de regras de negócio
- ✅ **DTO Validation** - Validação automática com decorators
- ✅ **Type Safety** - TypeScript em todo o código
- ✅ **Error Handling** - Tratamento consistente de erros HTTP
- ✅ **Database Indexing** - Índices em campos de busca frequente
- ✅ **Relations Management** - Relacionamentos Prisma otimizados
- ✅ **Soft Delete Ready** - Estrutura preparada para soft deletes

---

## Scripts NPM

```json
{
  "start": "nest start",                    // Inicia servidor
  "start:dev": "nest start --watch",        // Desenvolvimento (hot reload)
  "start:debug": "nest start --debug --watch", // Debug mode
  "start:prod": "node dist/main",           // Produção
  "build": "nest build",                    // Build TypeScript
  "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix", // Linting
  "format": "prettier --write \"src/**/*.ts\"" // Formatação
}
```

---

## Deploy

### Variáveis de Ambiente (Produção)

```env
DATABASE_URL="mysql://user:password@host:port/database"
PORT=3000
```

### Build & Start

```bash
# Build
npm run build

# Aplicar migrações
npx prisma migrate deploy

# Iniciar
npm run start:prod
```

---

## Autores

- **Júlio César Afonso Fernandes Silva** - [@juliocesarfs](https://github.com/juliocesarfs)
- **Alex Moreira de Andrade** - [@alexmoreira01](https://github.com/alexmoreira01)

---

<div align="center">

**[⬆ Voltar ao topo](#-control-tasks---backend-api)**

</div>
