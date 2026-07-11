import { m, type Tx } from "../shared";
import type { ExerciseSetType } from "../../schema";

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

export const createExerciseSet = m(
  async ({ tx, args }: { tx: Tx; args: CreateExerciseSetArgs }) => {
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
    });
  },
);
