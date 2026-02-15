import { getReplicache } from "$lib/stores/stores";
import { filterDeleted } from "../data/filterDeleted";

export function subscribeReplicacheData<T extends { isDeleted: boolean }>(
  userId: string,
  prefix: string,
  onData: (data: T[]) => void
) {
  getReplicache(userId).subscribe(
    async (tx) =>
      (
        await tx.scan({
          prefix,
        })
      ).toArray(),
    {
      onData: (data) => {
        try {
          let newData = data.map((element) =>
            JSON.parse(element!.toString())
          ) as any as T[];
          onData(filterDeleted(newData));
        } catch {}
      },
    }
  );
}

export function subscribeReplicacheDataSingle<T extends { isDeleted: boolean }>(
  userId: string,
  prefix: string,
  onData: (data: T) => void
) {
  getReplicache(userId).subscribe(
    async (tx) =>
      await tx.scan({
        prefix,
      }),
    {
      onData: (data) => {
        try {
          let newData = JSON.parse(data!.toString()) as any as T;

          onData(newData);
        } catch {}
      },
    }
  );
}
