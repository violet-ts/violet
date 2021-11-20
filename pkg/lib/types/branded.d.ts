type Branded<T, U extends string> = T & { [key in U]: never }

export type ProjectId = Branded<string, '__projectId'>
export type DeskId = Branded<string, '__deskId'>
export type WorkId = Branded<string, '__workId'>
export type RevisionId = Branded<string, '__revisionId'>
export type EditionId = Branded<string, '__editionId'>
export type MessageId = Branded<string, '__messageId'>
export type ResisteredUserId = Branded<string, '__resisteredUserId'>
export type ReplyId = Branded<string, '__replyId'>
export type S3RevisionPath = Branded<string, '__S3RevisionPath'>
