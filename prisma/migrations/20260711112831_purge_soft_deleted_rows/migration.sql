-- Data migration: permanently remove soft-deleted rows before Zero takes over sync.
-- Zero replicates real row deletes, so the `isDeleted` tombstone pattern is retired.
-- This migration is non-breaking for the running Replicache app: soft-deleted rows
-- were already filtered out client-side, so removing them changes nothing visible.
--
-- FK-safe order: delete individually-flagged children first, then flagged parents
-- (whose ON DELETE CASCADE removes any remaining children).

-- 1. Soft-deleted sets living under otherwise-live exercises.
DELETE FROM "ExerciseSet" WHERE "isDeleted" = true;

-- 2. Soft-deleted exercises (cascades their remaining sets).
DELETE FROM "Exercise" WHERE "isDeleted" = true;

-- 3. Soft-deleted sessions (cascades their exercises -> sets).
DELETE FROM "WorkoutSession" WHERE "isDeleted" = true;

-- 4. Soft-deleted templates (cascades implicit M2M join rows).
DELETE FROM "WorkoutSessionTemplate" WHERE "isDeleted" = true;

-- 5. ExerciseType has a RESTRICT FK from Exercise.typeId, so it cannot be deleted
--    while any exercise (including historical ones) still references it. First detach
--    soft-deleted types from users' pickers and templates so they stop appearing in
--    the UI, then hard-delete only the ones no live exercise references.
DELETE FROM "_ExerciseTypeToUser"
WHERE "A" IN (SELECT id FROM "ExerciseType" WHERE "isDeleted" = true);

DELETE FROM "_ExerciseTypeToWorkoutSessionTemplate"
WHERE "A" IN (SELECT id FROM "ExerciseType" WHERE "isDeleted" = true);

DELETE FROM "ExerciseType" t
WHERE t."isDeleted" = true
  AND NOT EXISTS (SELECT 1 FROM "Exercise" e WHERE e."typeId" = t.id);
