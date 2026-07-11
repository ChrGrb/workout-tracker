-- Run ONCE against the Neon upstream database (the app DB), as the app DB owner.
--
-- Zero replicates whatever this publication contains. We list only the application
-- tables, which deliberately EXCLUDES the Auth.js secret tables ("Account",
-- "Session", "VerificationToken") and Prisma's migration bookkeeping. Those tables
-- hold OAuth access/refresh tokens and session tokens and must never reach clients.
--
-- The two underscore-prefixed tables are Prisma's implicit many-to-many join tables
-- (exercise types <-> users, exercise types <-> templates); Zero needs them to
-- resolve the `exerciseTypes` relationships.

CREATE PUBLICATION zero_data FOR TABLE
  "User",
  "Settings",
  "WorkoutSession",
  "WorkoutSessionTemplate",
  "Exercise",
  "ExerciseType",
  "ExerciseSet",
  "_ExerciseTypeToUser",
  "_ExerciseTypeToWorkoutSessionTemplate";

-- If you later add a synced table, ALTER PUBLICATION zero_data ADD TABLE "NewTable";
