-- Phase 1b: drop Replicache scaffolding now that Zero handles sync.
-- Run AFTER the soft-delete purge (20260711112831_purge_soft_deleted_rows) and
-- after cutting over to Zero. This is BREAKING for any remaining Replicache client.

-- Per-row version stamps and the redundant User.settingsId pointer.
ALTER TABLE "User" DROP COLUMN IF EXISTS "settingsId", DROP COLUMN IF EXISTS "versionUpdatedAt";
ALTER TABLE "Settings" DROP COLUMN IF EXISTS "versionUpdatedAt";

-- Soft-delete flags (deletes are real row deletes under Zero) + version stamps.
ALTER TABLE "WorkoutSession" DROP COLUMN IF EXISTS "isDeleted", DROP COLUMN IF EXISTS "versionUpdatedAt";
ALTER TABLE "WorkoutSessionTemplate" DROP COLUMN IF EXISTS "isDeleted", DROP COLUMN IF EXISTS "versionUpdatedAt";
ALTER TABLE "Exercise" DROP COLUMN IF EXISTS "isDeleted", DROP COLUMN IF EXISTS "versionUpdatedAt";
ALTER TABLE "ExerciseType" DROP COLUMN IF EXISTS "isDeleted", DROP COLUMN IF EXISTS "versionUpdatedAt";
ALTER TABLE "ExerciseSet" DROP COLUMN IF EXISTS "isDeleted", DROP COLUMN IF EXISTS "versionUpdatedAt";

-- Redundant unique index on WorkoutSession.id (the primary key already enforces it).
DROP INDEX IF EXISTS "WorkoutSession_id_key";

-- Replicache bookkeeping tables (Zero manages its own client/version state).
DROP TABLE IF EXISTS "ReplicacheClient";
DROP TABLE IF EXISTS "ReplicacheSpace";
