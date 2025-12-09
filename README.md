# Clínica de Consultas e Exames — Especificação Técnica (API, Web, Mobile)

Documento de atividade de desenvolvimento para uma aplicação simples de clínica, dividida em três partes: API, Web e Mobile. Este material completa os detalhes faltantes (tecnologias, pacotes, funcionalidades, regras de negócio e colunas de tabelas) e padroniza decisões técnicas.

## Visão Geral

- Perfis do sistema: `admin`, `paciente`, `atendente`, `medico`
- Domínios principais: usuários, consultas, exames, resultados de exames
- Autenticação: JWT (token de acesso + refresh opcional)
- Banco de dados: PostgreSQL serverless (Neon) via Prisma ORM
- Documentação: Swagger/OpenAPI
- Estilos: Tailwind (Web), NativeWind (Mobile)
- Push: notificações para lembretes e atualização de status (Mobile)

---

## 1) API (Node.js + Express + Prisma)

### Linguagens
- JavaScript ou TypeScript

### Pacotes
- Obrigatórios:
  - `express` (framework HTTP)
  - `cors` (CORS)
  - `jsonwebtoken` (JWT; corrigindo o nome: não é `jwtwebtoken`)
  - `swagger-ui-express` + `swagger-jsdoc` (Swagger/OpenAPI)
  - `dotenv` (variáveis de ambiente)
  - `@prisma/client` + `prisma` (ORM)
  - `bcryptjs` (hash de senhas)
- Sugestões de pacotes:
  - `zod` (validação de entrada)
  - `uuid` (IDs auxiliares em processos internos, se necessário)

### Variáveis de Ambiente (.env)
- `DATABASE_URL`: string de conexão Neon (PostgreSQL)
- `JWT_SECRET`: segredo para assinar JWT
- `JWT_EXPIRES_IN`: expiração do access token (ex.: `15m`)
- `REFRESH_JWT_SECRET`: segredo para refresh token (opcional)
- `REFRESH_JWT_EXPIRES_IN`: expiração do refresh (ex.: `7d`)
- `CORS_ORIGIN`: origens permitidas (ex.: `http://localhost:3000,http://localhost:8081`)
- `SWAGGER_ENABLED`: `true`/`false`

### Segurança e Autorização
- Hash de senha com `bcryptjs` (ex.: salt 10)
- Autenticação via Bearer Token (JWT)
- Autorização por perfil (RBAC): middlewares `requireRole(['admin'])`, etc.
- CORS restrito por origem

### Documentação (Swagger)
- Definição por `swagger-jsdoc` + `swagger-ui-express` em `/docs`
- Inclui:
  - Auth (login, refresh)
  - Usuários (CRUD administrativo)
  - Consultas (CRUD; agendar, atualizar status)
  - Exames (CRUD; agendar, atualizar status)
  - Resultados de Exames (criar/listar/baixar)
  - Push Tokens (registrar token do dispositivo)

### Endpoints (Resumo)
- Autenticação:
  - `POST /auth/register` (paciente)
  - `POST /auth/login`
- Usuários (admin):
  - `GET /users` (admin)
  - `POST /users` (admin)
  - `GET /users/:id` (admin)
  - `PUT /users/:id` (admin)
  - `DELETE /users/:id` (admin)
- Consultas:
  - `POST /consultas` (paciente/atendente)
  - `GET /consultas` (admin/atendente/medico; paciente vê as suas)
  - `GET /consultas/:id` (autorizado)
  - `PUT /consultas/:id` (atualização: status/detalhes)
  - `DELETE /consultas/:id` (cancelamento conforme regra)
- Exames:
  - `POST /exames` (paciente/atendente)
  - `GET /exames` (admin/atendente/medico; paciente vê os seus)
  - `GET /exames/:id`
  - `PUT /exames/:id`
  - `DELETE /exames/:id`
- Resultados de Exames:
  - `POST /resultados` (medico/admin)
  - `GET /resultados` (paciente vê os seus; médico/admin amplo)
  - `GET /resultados/:id`
- Push Tokens:
  - `POST /push-tokens` (mobile: registrar/atualizar token Expo)
  - `DELETE /push-tokens/:id`

### Fluxos
- Cadastro paciente: `POST /auth/register` → login → token
- Login: `POST /auth/login` → retorna `accessToken` (+ `refreshToken` opcional)
- Agendamento:
  - Paciente solicita consulta/exame (escolhe médico/dia/hora)
  - Atendente pode agendar em nome do paciente
  - Regras verificam disponibilidade
- Execução:
  - Médico marca como realizada e anota detalhes
  - Exames geram resultado (arquivo/observações)
- Notificação:
  - Ao agendar/cancelar/atualizar status → envia push
  - Lembrete automático no dia marcado

### Tratamento de Erros (Padrão)
- Estrutura: `{ error: { code, message, details? } }`
- Códigos comuns:
  - `AUTH_INVALID_CREDENTIALS`, `AUTH_FORBIDDEN`
  - `VALIDATION_ERROR`
  - `RESOURCE_NOT_FOUND`
  - `SLOT_UNAVAILABLE`
  - `RATE_LIMITED`

---

## 2) Web (Next.js + Tailwind)

### Tecnologias e Pacotes
- Núcleo: `next`, `react`, `react-dom`
- Estilos: `tailwindcss`, `postcss`, `autoprefixer`
- Gerenciamento de Estado: `zustand` (slices: `auth`, `agenda`, `exames`)
- HTTP: `axios` (ou `fetch` nativo)
- Formulários: `react-hook-form` + `zod` (schemas)
- Ícones: `lucide-react` (opcional)
- Autenticação:
  - JWT em cookie HTTP-only (via rotas API do Next)
  - `middleware.ts` para proteger rotas

### Roteamento
- File-based routing nativo do Next.js (App Router)
- Segmentos protegidos por `middleware` (ex.: `/app/*`, `/admin/*`)

### Páginas Públicas
- `/` (Home)
- `/sobre` (Institucional)
- `/servicos` (Consultas e Exames)
- `/login`
- `/cadastro` (paciente)
- `/recuperar-senha` (opcional)

### Páginas Protegidas (com login)
- Paciente:
  - `/app/paciente/dashboard`
  - `/app/paciente/consultas`
  - `/app/paciente/exames`
  - `/app/paciente/resultados`
  - `/app/paciente/agendar`
- Atendente:
  - `/app/atendente/agendamentos`
  - `/app/atendente/pacientes`
- Médico:
  - `/app/medico/agenda`
  - `/app/medico/consultas/[id]`
  - `/app/medico/exames/[id]`
- Administrador:
  - `/admin/dashboard`
  - `/admin/usuarios`
  - `/admin/consultas`
  - `/admin/exames`
  - `/admin/resultados`

### Estilos
- Tailwind configurado com tema da clínica (cores, tipografia)
- Componentes reutilizáveis (botões, campos, tabelas, cards)

### Autorização na UI
- Guards por perfil (oculta/nega acesso conforme perfil)
- Fallbacks (ex.: redirect para `/login`)

---

## 3) Mobile (React Native + Expo)

### Tecnologias e Pacotes
- Núcleo: `expo`, `react-native`
- Roteamento: `expo-router` (file-based) ou `@react-navigation/native`
- Estado: `zustand` (slices: `auth`, `agenda`, `exames`)
- Estilos: `nativewind` (Tailwind para RN)
- HTTP: `axios`
- Formulários: `react-hook-form` + `zod` (schemas)
- Ícones: `lucide-react` (opcional)
- Armazenamento seguro: `expo-secure-store` (tokens)
- Push: `expo-notifications`

### Telas Públicas
- `/(public)/splash`
- `/(public)/login`
- `/(public)/cadastro`
- `/(public)/recuperar-senha` (opcional)

### Telas Protegidas (com login)
- Paciente:
  - `/(app)/dashboard`
  - `/(app)/consultas`
  - `/(app)/exames`
  - `/(app)/resultados`
  - `/(app)/agendar`
- Atendente:
  - `/(app)/atendente/agendamentos`
  - `/(app)/atendente/pacientes`
- Médico:
  - `/(app)/medico/agenda`
  - `/(app)/medico/consultas/[id]`
  - `/(app)/medico/exames/[id]`
- Admin (opcional no mobile):
  - `/(app)/admin/dashboard`

### Push Notifications
- Registro:
  - App obtém token via `expo-notifications`
  - Envia token para `POST /push-tokens`
- Disparo:
  - API dispara push (agendamento criado/atualizado/cancelado)
  - Lembrete no dia marcado
- Permissões e canais:
  - Solicitar permissão no primeiro uso
  - Configuração de canais Android (som/urgência)

---

## 4) Funcionalidades (Detalhamento)

- Cadastro:
  - Paciente se cadastra por Web/Mobile
  - Admin cria usuários de qualquer perfil
- Agendamento de Consultas/Exames:
  - Paciente solicita, Atendente confirma
  - Verificação de conflito de horários e disponibilidade do médico
- Execução e Registro:
  - Médico marca como realizada, adiciona detalhes
  - Resultados de exames: upload de arquivo e texto
- Acesso Administrativo:
  - Admin gerencia usuários, consultas, exames, resultados
  - Visão geral (dashboard) com métricas
- Notificações:
  - Lembrete de compromissos no dia
  - Atualizações de status (confirmado/cancelado/realizado)
- Conta e Segurança:
  - Login por email/senha
  - Troca de senha, recuperação (email)
  - Sessão com expiração

---

## 5) Regras de Negócio (Detalhamento)

- Acesso:
  - Somente `admin` acessa dashboard e CRUD amplo
  - `paciente` cadastra-se e acessa seus dados
  - `atendente` agenda e gerencia filas/horários
  - `medico` realiza consultas/exames e registra detalhes/resultados
- Agendamento:
  - Consulta/Exame só podem ser marcados em horários de expediente
  - Um médico não pode ter dois agendamentos no mesmo horário
  - Cancelamento até X horas antes (parametrizável), senão “não compareceu”
  - Estado do agendamento: `AGENDADA`, `REALIZADA`, `CANCELADA`, `NAO_COMPARECEU`
- Privacidade:
  - Paciente vê apenas seus dados/agendamentos/resultados
  - Médico vê seus pacientes do dia e históricos necessários
  - Admin pode ver tudo
- Senhas:
  - Mínimo 8 caracteres, complexidade recomendada
  - Hash com `bcryptjs`
- Auditoria:
  - Registrar ações administrativas (criação/alteração/remoção)
  - Data/hora e usuário responsável

---

## 6) Modelagem de Dados (Neon/Prisma)

### Observações Gerais
- IDs: `String @id @default(cuid())` (ou `UUID` com extensão Postgres)
- Datas: `DateTime`
- Integrações:
  - Perfis como `enum`
  - Status de agendamento como `enum`
- Índices/Restrições:
  - `@@unique` para email de usuário
  - Índices por médico e horário
  - Restrição única por `(medicoId, dataHora)` para evitar conflitos

### Enumerações
```prisma
enum Perfil {
  ADMIN
  PACIENTE
  ATENDENTE
  MEDICO
}

enum StatusAgendamento {
  AGENDADA
  REALIZADA
  CANCELADA
  NAO_COMPARECEU
}
```

### Tabelas/Modelos

```prisma
model Usuario {
  id         String  @id @default(cuid())
  nome       String
  email      String  @unique
  senhaHash  String
  perfil     Perfil
  ativo      Boolean @default(true)

  // Rastreamento
  criadoEm   DateTime @default(now())
  atualizadoEm DateTime @updatedAt

  // Relações
  consultasComoPaciente Consulta[] @relation("ConsultaPaciente")
  consultasComoMedico   Consulta[] @relation("ConsultaMedico")
  examesComoPaciente    Exame[]    @relation("ExamePaciente")
  examesComoMedico      Exame[]    @relation("ExameMedico")
  resultadosExames      ResultadoExame[]

  // Push tokens (tabela auxiliar)
  pushTokens PushToken[]
}

model Consulta {
  id         String   @id @default(cuid())
  dia        DateTime // dia da consulta
  hora       String   // HH:mm (mantendo o requisito original)
  dataHora   DateTime // coluna derivada útil para índices/consultas
  detalhes   String?  // observações do médico

  status     StatusAgendamento @default(AGENDADA)

  // Relações
  paciente   Usuario  @relation("ConsultaPaciente", fields: [pacienteId], references: [id])
  pacienteId String
  medico     Usuario  @relation("ConsultaMedico", fields: [medicoId], references: [id])
  medicoId   String

  criadoEm   DateTime @default(now())
  atualizadoEm DateTime @updatedAt

  @@index([medicoId, dataHora])
  @@index([pacienteId, dataHora])
  @@unique([medicoId, dataHora]) // evita conflito de horários
}

model Exame {
  id         String   @id @default(cuid())
  nome       String   // tipo de exame
  dia        DateTime
  hora       String
  dataHora   DateTime
  detalhes   String?  // observações

  status     StatusAgendamento @default(AGENDADA)

  // Relações
  paciente   Usuario  @relation("ExamePaciente", fields: [pacienteId], references: [id])
  pacienteId String
  medico     Usuario  @relation("ExameMedico", fields: [medicoId], references: [id])
  medicoId   String

  criadoEm   DateTime @default(now())
  atualizadoEm DateTime @updatedAt

  resultados ResultadoExame[]

  @@index([medicoId, dataHora])
  @@index([pacienteId, dataHora])
  @@unique([medicoId, dataHora])
}

model ResultadoExame {
  id         String  @id @default(cuid())
  detalhes   String? // laudo textual
  arquivoUrl String? // link para arquivo (PDF, imagem)
  publicadoEm DateTime @default(now())

  // Relações
  exame      Exame   @relation(fields: [exameId], references: [id])
  exameId    String
  paciente   Usuario @relation(fields: [pacienteId], references: [id])
  pacienteId String
  medico     Usuario @relation(fields: [medicoId], references: [id])
  medicoId   String

  criadoEm   DateTime @default(now())
  atualizadoEm DateTime @updatedAt

  @@index([exameId])
  @@index([pacienteId])
  @@index([medicoId])
}

// Tabela auxiliar para notificações push (multi-dispositivo por usuário)
model PushToken {
  id         String  @id @default(cuid())
  usuario    Usuario @relation(fields: [usuarioId], references: [id])
  usuarioId  String
  token      String  // token Expo/FCM
  plataforma String  // 'ios' | 'android' | 'web'
  ativo      Boolean @default(true)

  criadoEm   DateTime @default(now())
  atualizadoEm DateTime @updatedAt

  @@index([usuarioId])
  @@unique([token])
}
```

### Observações de Modelagem
- Mantidos `dia` e `hora` (requisito original) e adicionada `dataHora` para facilitar validações/relatórios
- `status` em `Consulta` e `Exame` segue regra de negócio
- `ResultadoExame` permite `arquivoUrl` para anexos
- `PushToken` é opcional, mas recomendado para multi-dispositivo

---

## 7) Integração com Neon (PostgreSQL Serverless)

- Criar projeto Neon e obter `DATABASE_URL` (Postgres)
- Prisma:
  - `npx prisma init` → define `DATABASE_URL` no `.env`
  - `npx prisma migrate dev --name init` (após escrever o schema)
  - `npx prisma generate`
- Performance:
  - Usar pooling (Neon fornece)
  - Configurar `pgbouncer` quando aplicável

---

## 8) Fluxos de Autenticação (JWT)

- Login:
  - Validação de credenciais
  - Geração de `accessToken` (curto) e `refreshToken` (opcional)
- Armazenamento:
  - Web: cookie HTTP-only (protege contra XSS)
  - Mobile: `expo-secure-store`
- Renovação:
  - `POST /auth/refresh` (se habilitado)
- Logout:
  - Invalidação/remoção do refresh e tokens locais

---

## 9) Estilo e UX

- Web:
  - Tailwind com componentes consistentes
  - Dark/Light Mode (opcional)
  - Acessibilidade (labels, aria, foco)
- Mobile:
  - NativeWind para estilos responsivos
  - Feedback visual para estados (loading, erro)
  - Deep links para notificações (abrir agendamento específico)

---

## 10) Métricas e Dashboard (Admin)

- Indicadores:
  - Consultas e exames por período
  - Cancelamentos e não comparecimentos
  - Resultados publicados
  - Capacidade por médico (ocupação)
- Filtros por data, médico, tipo de exame

---