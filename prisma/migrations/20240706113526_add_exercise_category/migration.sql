-- CreateEnum
CREATE TYPE "ExerciseTypeCategory" AS ENUM ('TIME', 'WEIGHT');

-- AlterTable
ALTER TABLE "ExerciseType" ADD COLUMN     "category" "ExerciseTypeCategory" NOT NULL DEFAULT 'WEIGHT';
