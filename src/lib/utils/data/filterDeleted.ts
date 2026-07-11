// Historically stripped soft-deleted (`isDeleted`) rows. With the Zero migration,
// deletes are real row deletes, so there is nothing to filter — this is now a
// null-safe passthrough kept so existing call sites don't need to change.
export function filterDeleted<T>(items: T[]): T[] {
  return items ?? [];
}
