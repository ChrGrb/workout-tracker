-- CreateEnum
CREATE TYPE "ExerciseTypeArea" AS ENUM ('CHEST', 'SHOULDERS', 'ARMS', 'CORE', 'BACK', 'LEGS');

-- AlterTable
ALTER TABLE "ExerciseType" ADD COLUMN     "area" "ExerciseTypeArea";
