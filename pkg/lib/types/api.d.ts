import type {
  DeskId,
  EditionId,
  MessageId,
  ProjectId,
  ReplyId,
  RevisionId,
  S3RevisionPath,
  WorkId,
} from './branded'

export type ApiProject = {
  id: ProjectId
  name: string
}

export type ApiWork = {
  id: WorkId
  name: string
  ext?: string | null
  path: string
}

export type ApiDesk = {
  id: DeskId
  name: string
  works: ApiWork[]
}

export type ApiRevision = {
  id: RevisionId
  url: S3RevisionPath
  editionIds: EditionId[] | undefined
  messageIds: MessageId[] | undefined
}

export type ApiMessage = {
  id: MessageId
  content: string
  createdAt: number
  userName: string
  replys: ApiReply[]
}

export type ApiReply = {
  id: ReplyId
  content: string
  createdAt: number
  userName: string
}
