export function filterDeleted<T extends { isDeleted: boolean }>(items: T[]) {
    return items ? items.filter((item) => !item.isDeleted) : [];
}