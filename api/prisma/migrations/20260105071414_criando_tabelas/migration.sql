-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('ADMIN', 'PACIENTE', 'ATENDENTE', 'MEDICO');

-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('AGENDADA', 'REALIZADA', 'CANCELADA', 'NAO_COMPARECEU');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "perfil" "Perfil" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id" TEXT NOT NULL,
    "dia" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "detalhes" TEXT,
    "status" "StatusAgendamento" NOT NULL DEFAULT 'AGENDADA',
    "pacienteId" TEXT NOT NULL,
    "medicoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exame" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dia" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "detalhes" TEXT,
    "status" "StatusAgendamento" NOT NULL DEFAULT 'AGENDADA',
    "pacienteId" TEXT NOT NULL,
    "medicoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultadoExame" (
    "id" TEXT NOT NULL,
    "detalhes" TEXT,
    "arquivoUrl" TEXT,
    "publicadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exameId" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "medicoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResultadoExame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushToken" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "plataforma" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PushToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Consulta_medicoId_dataHora_idx" ON "Consulta"("medicoId", "dataHora");

-- CreateIndex
CREATE INDEX "Consulta_pacienteId_dataHora_idx" ON "Consulta"("pacienteId", "dataHora");

-- CreateIndex
CREATE UNIQUE INDEX "Consulta_medicoId_dataHora_key" ON "Consulta"("medicoId", "dataHora");

-- CreateIndex
CREATE INDEX "Exame_medicoId_dataHora_idx" ON "Exame"("medicoId", "dataHora");

-- CreateIndex
CREATE INDEX "Exame_pacienteId_dataHora_idx" ON "Exame"("pacienteId", "dataHora");

-- CreateIndex
CREATE UNIQUE INDEX "Exame_medicoId_dataHora_key" ON "Exame"("medicoId", "dataHora");

-- CreateIndex
CREATE INDEX "ResultadoExame_exameId_idx" ON "ResultadoExame"("exameId");

-- CreateIndex
CREATE INDEX "ResultadoExame_pacienteId_idx" ON "ResultadoExame"("pacienteId");

-- CreateIndex
CREATE INDEX "ResultadoExame_medicoId_idx" ON "ResultadoExame"("medicoId");

-- CreateIndex
CREATE INDEX "PushToken_usuarioId_idx" ON "PushToken"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "PushToken_token_key" ON "PushToken"("token");

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exame" ADD CONSTRAINT "Exame_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exame" ADD CONSTRAINT "Exame_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultadoExame" ADD CONSTRAINT "ResultadoExame_exameId_fkey" FOREIGN KEY ("exameId") REFERENCES "Exame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultadoExame" ADD CONSTRAINT "ResultadoExame_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultadoExame" ADD CONSTRAINT "ResultadoExame_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushToken" ADD CONSTRAINT "PushToken_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
