import type { PrismaClient } from "@prisma/client"
import utilsApiEntriesSessionGet from "./sessionGet";
import type { PatchOperation } from "replicache";
import utilsApiEntriesUserGet from "./userGet";
import utilsApiEntriesExerciseTypeGet from "./exerciseTypeGet";

const utilsApiEntriesGet = async ({ tx, userId, versionAt }: { tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, userId: string, versionAt: number }) => {
    let patch: PatchOperation[] = [];

    if (versionAt === null) patch.push({ op: 'clear' })

    const { data: apiEntriesSessionGet } = await utilsApiEntriesSessionGet({
        tx,
        userId,
        versionAt
    });

    if (apiEntriesSessionGet?.length)
        patch.push(
            ...apiEntriesSessionGet.map(session => (session.isDeleted ? {
                op: 'del',
                key: `user/${session.userId}/session/${session.id}`,
                value: JSON.stringify({ ...session })
            } as PatchOperation : {
                op: 'put',
                key: `user/${session.userId}/session/${session.id}`,
                value: JSON.stringify({ ...session })
            } as PatchOperation))
        );

    const { data: apiEntriesUserGet } = await utilsApiEntriesUserGet({
        tx,
        userId,
        versionAt
    });

    if (apiEntriesUserGet)
        patch.push(
            {
                op: 'put',
                key: `user/${apiEntriesUserGet.id}/user`,
                value: JSON.stringify({ ...apiEntriesUserGet })
            } as PatchOperation
        );
    const { data: apiEntriesExerciseTypeGet } = await utilsApiEntriesExerciseTypeGet({
        tx,
        userId,
        versionAt
    });

    if (apiEntriesExerciseTypeGet?.length)
        patch.push(
            ...apiEntriesExerciseTypeGet.map(exerciseType => (exerciseType.isDeleted ? {
                op: 'del',
                key: `user/${userId}/exerciseType/${exerciseType.id}`,
                value: JSON.stringify({ ...exerciseType })
            } as PatchOperation : {
                op: 'put',
                key: `user/${userId}/exerciseType/${exerciseType.id}`,
                value: JSON.stringify({ ...exerciseType })
            } as PatchOperation))
        );

    console.log("Version: ", versionAt);
    console.log("Patches: ", patch);

    return { data: patch };
}

export default utilsApiEntriesGet