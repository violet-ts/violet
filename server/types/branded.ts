type Branded<T, U extends string> = T & { [key in U]: never }

export type ProjectId = Branded<string, '__projectId'>
export type DeskId = Branded<string, '__deskId'>
export type WorkId = Branded<string, '__workId'>

export type ResisteredUserId = Branded<string, '__resisteredUserId'>
