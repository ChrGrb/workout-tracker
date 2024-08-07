import type { PrismaClient } from "@prisma/client";
import utilsApiMutationsExerciseCreate from "./session/exercise/mutationsExerciseCreate";
import { number } from "zod";
import utilsApiMutationsSessionCreate from "./session/mutationsSessionCreate";
import utilsApiMutationsSessionUpdate from "./session/mutationSessionUpdate";
import utilsApiMutationsExerciseSetCreate from "./session/exercise/exerciseSet/mutationsExerciseSetCreate";
import utilsApiMutationsExerciseUpdate from "./session/exercise/mutationsExerciseUpdate";
import utilsApiMutationsExerciseSetUpdate from "./session/exercise/exerciseSet/mutationsExerciseSetUpdate";
import utilsApiMutationsUserSettingsUpdate from "./user/settings/mutationuserSettingsUpdate";
import utilsApiLastMutationIdSave from "../client/lastMutationIdSave";
import utilsApiMutationsExerciseTypeCreate from "./exerciseType/mutationsExerciseTypeCreate";
import utilsApiMutationsExerciseTypeDelete from "./exerciseType/mutationsExerciseTypeDelete";
import utilsApiMutationsUserWorkoutSessionTemplateUpdate from "./user/workoutSessionTemplate/mutationUserWorkoutSessionTemplateUpdate";
import utilsApiMutationsUserWorkoutSessionTemplateCreate from "./user/workoutSessionTemplate/mutationsUserWorkoutSessionTemplateCreate";
import utilsApiMutationsExerciseTypeUpdate from "./exerciseType/mutationsExerciseTypeUpdate";

const utilsApiMutations = async ({
  replicacheClientGroupId,
  mutations,
  userId,
  tx,
  versionNext,
}: {
  replicacheClientGroupId: string;
  mutations: any;
  userId: string;
  tx: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >;
  versionNext: number;
}) => {
  for await (const mutation of mutations) {
    const { lastMutationId } = (await tx.replicacheClient.findFirst({
      where: { id: mutation.clientID },
      select: { lastMutationId: true },
    })) ?? { lastMutationId: 0 };

    // Verify before processing mutation
    if (mutation.id < lastMutationId + 1) {
      continue;
    }

    if (mutation.id > lastMutationId + 1) {
      break;
    }

    try {
      let nextMutationId = lastMutationId + 1;
      let replicacheClientId = mutation.clientID as string;

      if (mutation.name === "createExercise")
        await utilsApiMutationsExerciseCreate({
          args: mutation.args,
          userId,
          tx,
          versionNext,
        });
      if (mutation.name === "deleteExercise")
        await utilsApiMutationsExerciseUpdate({
          args: mutation.args,
          userId,
          tx,
          versionNext,
        });
      if (mutation.name === "createExerciseSet")
        await utilsApiMutationsExerciseSetCreate({
          args: mutation.args,
          tx,
          versionNext,
        });
      if (mutation.name === "deleteExerciseSet")
        await utilsApiMutationsExerciseSetUpdate({
          args: mutation.args,
          tx,
          versionNext,
        });
      if (mutation.name === "createSession")
        await utilsApiMutationsSessionCreate({
          args: mutation.args,
          userId,
          tx,
          versionNext,
        });
      if (mutation.name === "updateSession")
        await utilsApiMutationsSessionUpdate({
          args: mutation.args,
          tx,
          versionNext,
        });
      if (mutation.name === "deleteSession")
        await utilsApiMutationsSessionUpdate({
          args: mutation.args,
          tx,
          versionNext,
        });
      if (mutation.name === "updateUserSettings")
        await utilsApiMutationsUserSettingsUpdate({
          args: mutation.args,
          tx,
          versionNext,
        });
      if (mutation.name === "createExerciseType")
        await utilsApiMutationsExerciseTypeCreate({
          args: mutation.args,
          tx,
          versionNext,
        });
      if (mutation.name === "updateExerciseType")
        await utilsApiMutationsExerciseTypeUpdate({
          args: mutation.args,
          tx,
          versionNext,
        });
      if (mutation.name === "deleteExerciseType")
        await utilsApiMutationsExerciseTypeUpdate({
          args: mutation.args,
          tx,
          versionNext,
        });
      if (mutation.name === "createUserWorkoutSessionTemplate")
        await utilsApiMutationsUserWorkoutSessionTemplateCreate({
          args: mutation.args,
          tx,
          versionNext,
        });
      if (mutation.name === "updateUserWorkoutSessionTemplate")
        await utilsApiMutationsUserWorkoutSessionTemplateUpdate({
          args: mutation.args,
          tx,
          versionNext,
        });

      // Only increase mutation id upon successful mutation
      await utilsApiLastMutationIdSave({
        replicacheClientId,
        replicacheClientGroupId,
        userId,
        nextMutationId,
        lastModifiedVersion: versionNext,
        tx,
      });
    } catch (err) {
      console.error(err);
    }
  }

  return;
};

export default utilsApiMutations;
