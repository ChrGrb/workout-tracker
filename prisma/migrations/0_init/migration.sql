-- CreateEnum
CREATE TYPE "ExerciseSetType" AS ENUM ('WARMUP', 'WORKOUT', 'COOLDOWN');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "settingsId" TEXT NOT NULL DEFAULT '',
    "versionUpdatedAt" INTEGER DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "useTimer" BOOLEAN NOT NULL DEFAULT true,
    "timerValue" DOUBLE PRECISION NOT NULL DEFAULT 180000,
    "versionUpdatedAt" INTEGER DEFAULT 0,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL DEFAULT 'Session',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "versionUpdatedAt" INTEGER DEFAULT 0,

    CONSTRAINT "WorkoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSessionTemplate" (
    "versionUpdatedAt" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Template',

    CONSTRAINT "WorkoutSessionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "averageWeight" DOUBLE PRECISION,
    "averageReps" INTEGER,
    "typeId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previousScore" DOUBLE PRECISION,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "versionUpdatedAt" INTEGER DEFAULT 0,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "versionUpdatedAt" INTEGER DEFAULT 0,

    CONSTRAINT "ExerciseType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseSet" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "exerciseSetType" "ExerciseSetType" NOT NULL DEFAULT 'WORKOUT',
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "versionUpdatedAt" INTEGER DEFAULT 0,
    "additionalWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "ExerciseSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReplicacheSpace" (
    "versionAt" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ReplicacheSpace_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "ReplicacheClient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientGroupId" TEXT NOT NULL,
    "lastMutationId" INTEGER NOT NULL DEFAULT 0,
    "lastModifiedVersion" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "_ExerciseTypeToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExerciseTypeToWorkoutSessionTemplate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutSession_id_key" ON "WorkoutSession"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseType_name_key" ON "ExerciseType"("name");

-- CreateIndex
CREATE INDEX "ReplicacheSpace_userId_idx" ON "ReplicacheSpace"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReplicacheClient_id_key" ON "ReplicacheClient"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseTypeToUser_AB_unique" ON "_ExerciseTypeToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseTypeToUser_B_index" ON "_ExerciseTypeToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseTypeToWorkoutSessionTemplate_AB_unique" ON "_ExerciseTypeToWorkoutSessionTemplate"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseTypeToWorkoutSessionTemplate_B_index" ON "_ExerciseTypeToWorkoutSessionTemplate"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSession" ADD CONSTRAINT "WorkoutSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSessionTemplate" ADD CONSTRAINT "WorkoutSessionTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ExerciseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseSet" ADD CONSTRAINT "ExerciseSet_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplicacheSpace" ADD CONSTRAINT "ReplicacheSpace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseTypeToUser" ADD CONSTRAINT "_ExerciseTypeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ExerciseType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseTypeToUser" ADD CONSTRAINT "_ExerciseTypeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseTypeToWorkoutSessionTemplate" ADD CONSTRAINT "_ExerciseTypeToWorkoutSessionTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "ExerciseType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseTypeToWorkoutSessionTemplate" ADD CONSTRAINT "_ExerciseTypeToWorkoutSessionTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkoutSessionTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

