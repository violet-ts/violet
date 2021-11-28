type Branded<T, U extends string> = T & { [key in U]: never }

export type ProjectId = Branded<string, '__projectId'>
export type DirId = Branded<string, '__dirId'>
export type WorkId = Branded<string, '__workId'>
export type RevisionId = Branded<string, '__revisionId'>
export type MessageId = Branded<string, '__messageId'>
export type ResisteredUserId = Branded<string, '__resisteredUserId'>
export type ReplyId = Branded<string, '__replyId'>
export type RevisionPath = Branded<string, '__RevisionPath'>
export type ProjectIconPath = Branded<string, '__s3ProjectIconPath'>
