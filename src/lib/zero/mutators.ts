import {
  defineMutators,
  defineMutatorWithType,
  type Transaction,
} from "@rocicorp/zero";
import { zql, type Schema } from "./schema";
import type {
  ExerciseSetType,
  ExerciseTypeCategory,
  ExerciseTypeArea,
} from "./generated/schema";

// Context carried into every mutator. On the server it is the authenticated user
// (verified JWT); on the client it is the signed-in user from the Z instance.
export type ZeroAuthData = { userID: string } | undefined;

type Tx = Transaction<Schema>;

// NOTE (Phase 6 cleanup): the `isDeleted: false` lines below track the current
// Prisma schema. Once the breaking migration drops that column and the Zero schema
// is regenerated, remove them.

// On the server, refuse to act for a different user than the token says.
function assertOwner(tx: Tx, ctx: ZeroAuthData, userId: string) {
  if (tx.location === "server" && ctx && ctx.userID !== userId) {
    throw new Error("Not authorized");
  }
}

export type CreateSessionArgs = {
  id: string;
  userId: string;
  name: string;
  createdAt: number;
};
export type UpdateSessionArgs = {
  id: string;
  name?: string;
  finished?: boolean;
};
export type CreateExerciseArgs = {
  id: string;
  userId: string;
  typeId: string;
  sessionId: string;
  createdAt: number;
};
export type CreateExerciseSetArgs = {
  id: string;
  exerciseId: string;
  exerciseSetType: ExerciseSetType;
  reps: number;
  weight: number;
  additionalWeight: number;
  time: number;
  notes: string;
  createdAt: number;
};
export type UpdateSettingsArgs = {
  id: string;
  userId: string;
  useTimer: boolean;
  timerValue: number;
};
export type CreateExerciseTypeArgs = {
  id: string;
  userId: string;
  name: string;
  category: ExerciseTypeCategory;
  area?: ExerciseTypeArea;
  description?: string;
};
export type UpdateExerciseTypeArgs = {
  id: string;
  name?: string;
  category?: ExerciseTypeCategory;
  area?: ExerciseTypeArea;
  description?: string;
};
export type CreateTemplateArgs = {
  id: string;
  userId: string;
  name: string;
  createdAt: number;
  exerciseTypeIds: string[];
};
export type UpdateTemplateArgs = {
  id: string;
  name?: string;
  exerciseTypeIds?: string[];
};

const m = defineMutatorWithType<Schema, ZeroAuthData>();

export const mutators = defineMutators({
  session: {
    create: m(
      async ({ tx, args, ctx }: { tx: Tx; args: CreateSessionArgs; ctx: ZeroAuthData }) => {
        assertOwner(tx, ctx, args.userId);
        await tx.mutate.workoutSession.insert({
          id: args.id,
          userId: args.userId,
          name: args.name,
          createdAt: args.createdAt,
          finished: false,
          isDeleted: false,
        });
      },
    ),
    update: m(async ({ tx, args }: { tx: Tx; args: UpdateSessionArgs }) => {
      await tx.mutate.workoutSession.update({
        id: args.id,
        ...(args.name !== undefined ? { name: args.name } : {}),
        ...(args.finished !== undefined ? { finished: args.finished } : {}),
      });
    }),
    // Real delete. Zero's client store has no FK cascade, so remove children first.
    delete: m(async ({ tx, args }: { tx: Tx; args: { id: string } }) => {
      const exercises = await tx.run(zql.exercise.where("sessionId", args.id));
      for (const exercise of exercises) {
        const sets = await tx.run(
          zql.exerciseSet.where("exerciseId", exercise.id),
        );
        for (const set of sets) {
          await tx.mutate.exerciseSet.delete({ id: set.id });
        }
        await tx.mutate.exercise.delete({ id: exercise.id });
      }
      await tx.mutate.workoutSession.delete({ id: args.id });
    }),
  },

  exercise: {
    create: m(
      async ({ tx, args, ctx }: { tx: Tx; args: CreateExerciseArgs; ctx: ZeroAuthData }) => {
        assertOwner(tx, ctx, args.userId);
        await tx.mutate.exercise.insert({
          id: args.id,
          userId: args.userId,
          typeId: args.typeId,
          sessionId: args.sessionId,
          createdAt: args.createdAt,
          score: 0,
          isDeleted: false,
        });
      },
    ),
    delete: m(async ({ tx, args }: { tx: Tx; args: { id: string } }) => {
      const sets = await tx.run(zql.exerciseSet.where("exerciseId", args.id));
      for (const set of sets) {
        await tx.mutate.exerciseSet.delete({ id: set.id });
      }
      await tx.mutate.exercise.delete({ id: args.id });
    }),
  },

  exerciseSet: {
    create: m(async ({ tx, args }: { tx: Tx; args: CreateExerciseSetArgs }) => {
      await tx.mutate.exerciseSet.insert({
        id: args.id,
        exerciseId: args.exerciseId,
        exerciseSetType: args.exerciseSetType,
        reps: args.reps,
        weight: args.weight,
        additionalWeight: args.additionalWeight,
        time: args.time,
        notes: args.notes,
        createdAt: args.createdAt,
        isDeleted: false,
      });
    }),
    delete: m(async ({ tx, args }: { tx: Tx; args: { id: string } }) => {
      await tx.mutate.exerciseSet.delete({ id: args.id });
    }),
  },

  settings: {
    update: m(
      async ({ tx, args, ctx }: { tx: Tx; args: UpdateSettingsArgs; ctx: ZeroAuthData }) => {
        assertOwner(tx, ctx, args.userId);
        await tx.mutate.settings.upsert({
          id: args.id,
          userId: args.userId,
          useTimer: args.useTimer,
          timerValue: args.timerValue,
        });
      },
    ),
  },

  exerciseType: {
    create: m(
      async ({ tx, args, ctx }: { tx: Tx; args: CreateExerciseTypeArgs; ctx: ZeroAuthData }) => {
        assertOwner(tx, ctx, args.userId);
        await tx.mutate.exerciseType.insert({
          id: args.id,
          name: args.name,
          category: args.category,
          area: args.area,
          description: args.description,
          isDeleted: false,
        });
        // Link the type to the user (implicit M2M join table, A=type, B=user).
        await tx.mutate._exerciseTypeToUser.insert({
          A: args.id,
          B: args.userId,
        });
      },
    ),
    update: m(async ({ tx, args }: { tx: Tx; args: UpdateExerciseTypeArgs }) => {
      await tx.mutate.exerciseType.update({
        id: args.id,
        ...(args.name !== undefined ? { name: args.name } : {}),
        ...(args.category !== undefined ? { category: args.category } : {}),
        ...(args.area !== undefined ? { area: args.area } : {}),
        ...(args.description !== undefined
          ? { description: args.description }
          : {}),
      });
    }),
    // Unlink from the user; hard-delete the type only if no exercise references it
    // (mirrors the historical RESTRICT FK — keeps history resolvable).
    delete: m(
      async ({ tx, args, ctx }: { tx: Tx; args: { id: string; userId: string }; ctx: ZeroAuthData }) => {
        assertOwner(tx, ctx, args.userId);
        await tx.mutate._exerciseTypeToUser.delete({
          A: args.id,
          B: args.userId,
        });
        const referencing = await tx.run(
          zql.exercise.where("typeId", args.id).limit(1),
        );
        if (referencing.length === 0) {
          await tx.mutate.exerciseType.delete({ id: args.id });
        }
      },
    ),
  },

  template: {
    create: m(
      async ({ tx, args, ctx }: { tx: Tx; args: CreateTemplateArgs; ctx: ZeroAuthData }) => {
        assertOwner(tx, ctx, args.userId);
        await tx.mutate.workoutSessionTemplate.insert({
          id: args.id,
          userId: args.userId,
          name: args.name,
          createdAt: args.createdAt,
          isDeleted: false,
        });
        for (const typeId of args.exerciseTypeIds) {
          await tx.mutate._exerciseTypeToWorkoutSessionTemplate.insert({
            A: typeId,
            B: args.id,
          });
        }
      },
    ),
    update: m(async ({ tx, args }: { tx: Tx; args: UpdateTemplateArgs }) => {
      if (args.name !== undefined) {
        await tx.mutate.workoutSessionTemplate.update({
          id: args.id,
          name: args.name,
        });
      }
      if (args.exerciseTypeIds !== undefined) {
        const existing = await tx.run(
          zql._exerciseTypeToWorkoutSessionTemplate.where("B", args.id),
        );
        for (const row of existing) {
          await tx.mutate._exerciseTypeToWorkoutSessionTemplate.delete({
            A: row.A,
            B: row.B,
          });
        }
        for (const typeId of args.exerciseTypeIds) {
          await tx.mutate._exerciseTypeToWorkoutSessionTemplate.insert({
            A: typeId,
            B: args.id,
          });
        }
      }
    }),
    delete: m(async ({ tx, args }: { tx: Tx; args: { id: string } }) => {
      const existing = await tx.run(
        zql._exerciseTypeToWorkoutSessionTemplate.where("B", args.id),
      );
      for (const row of existing) {
        await tx.mutate._exerciseTypeToWorkoutSessionTemplate.delete({
          A: row.A,
          B: row.B,
        });
      }
      await tx.mutate.workoutSessionTemplate.delete({ id: args.id });
    }),
  },
});

export type Mutators = typeof mutators;
