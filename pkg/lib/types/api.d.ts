import type {
  DeskId,
  MessageId,
  ProjectId,
  ReplyId,
  RevisionId,
  RevisionPath,
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
  url: RevisionPath
  messageIds: MessageId[] | undefined
}

export type ApiMessage = {
  id: MessageId
  content: string
  createdAt: number
  userName: string
  replies: ApiReply[]
}

export type ApiReply = {
  id: ReplyId
  content: string
  createdAt: number
  userName: string
}
