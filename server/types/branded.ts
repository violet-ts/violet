type Branded<T, U extends string> = T & { [key in U]: never }

export type OwnerId = Branded<string, '__ownerId'>
export type WorkId = Branded<string, '__workId'>
export type ProjectId = Branded<string, '__projectId'>
