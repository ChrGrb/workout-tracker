import type { PrismaClient } from "@prisma/client"
import { error } from "@sveltejs/kit"

const utilsApiVersionGet = async ({ tx, userId }: { tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, userId: string }) => {
	// Important: we need to make sure that the `spaceId` provided in the query is also owned by user
	const prismaSpaceFindFirst = await tx.replicacheSpace.findFirst({
		where: { userId },
		select: { versionAt: true }
	})

	if (!prismaSpaceFindFirst) throw error(404, "Space not found");

	return { data: prismaSpaceFindFirst.versionAt }
}

export default utilsApiVersionGet