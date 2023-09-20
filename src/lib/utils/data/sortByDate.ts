export function sortByCreatedAt<T extends { createdAt: Date }>(item1: T, item2: T) {
    return new Date(item2.createdAt).getTime() - new Date(item1.createdAt).getTime()
}