import { defineQueries, defineQueryWithType } from "@rocicorp/zero";
import { zql, type Schema } from "./schema";

// Read authorization lives here: every query is scoped to the authenticated user
// via `ctx.userID`. The server re-evaluates these with the verified user id, so a
// client cannot read another user's rows regardless of what it requests.
export type QueryContext = { userID: string };

const q = defineQueryWithType<Schema, QueryContext>();

export const queries = defineQueries({
  // The signed-in user plus their settings.
  me: q(({ ctx }) => zql.user.where("id", ctx.userID).related("settings").one()),

  // All of the user's sessions, newest first, with their exercises -> sets & type.
  sessions: q(({ ctx }) =>
    zql.workoutSession
      .where("userId", ctx.userID)
      .related("exercises", (e) => e.related("sets").related("type"))
      .orderBy("createdAt", "desc"),
  ),

  // A single session (still scoped to the user).
  sessionById: q(({ args, ctx }: { args: { id: string }; ctx: QueryContext }) =>
    zql.workoutSession
      .where("userId", ctx.userID)
      .where("id", args.id)
      .related("exercises", (e) => e.related("sets").related("type"))
      .one(),
  ),

  // The user's exercise-type picker (types linked to them via the join table).
  exerciseTypes: q(({ ctx }) =>
    zql.exerciseType.whereExists("users", (u) => u.where("id", ctx.userID)),
  ),

  // The user's templates with their attached exercise types.
  templates: q(({ ctx }) =>
    zql.workoutSessionTemplate
      .where("userId", ctx.userID)
      .related("exerciseTypes"),
  ),

  // Past exercises of a given type for score history (replaces the old
  // getSessions read-mutator + client scan).
  previousExercisesOfType: q(
    ({ args, ctx }: { args: { typeId: string }; ctx: QueryContext }) =>
      zql.exercise
        .where("userId", ctx.userID)
        .where("typeId", args.typeId)
        .related("sets")
        .related("type")
        .orderBy("createdAt", "desc"),
  ),
});
