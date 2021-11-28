import type {
  DirId,
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
  iconUrl?: string | null
}

export type ApiRootDir = {
  id: DirId
  name: string
  parentDirId: null
  works: ApiWork[]
}

export type ApiChildDir = {
  id: DirId
  name: string
  parentDirId: DirId
  works: ApiWork[]
}

export type ApiDir = ApiRootDir | ApiChildDir

export type ApiWork = {
  id: WorkId
  name: string
  latestRevisionId: RevisionId | null
}

export type ApiRevision = {
  id: RevisionId
  url: RevisionPath
  latestMessageId: MessageId | null
}

export type ApiMessage = {
  id: MessageId
  content: string
  createdAt: number
  userName: string
  latestReplyId: ReplyId | null
}

export type ApiReply = {
  id: ReplyId
  content: string
  createdAt: number
  userName: string
}

export type Cursor<T extends string> = {
  cursorId: T
  skipCursor: boolean
  take: number
}
