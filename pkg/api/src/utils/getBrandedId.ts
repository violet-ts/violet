import type { Dir, Message, Project, Reply, Revision, Work } from '@prisma/client'
import type {
  DirId,
  MessageId,
  ProjectId,
  ReplyId,
  RevisionId,
  WorkId,
} from '@violet/lib/types/branded'

export const getProjectId = (project: Project) => project.projectId as ProjectId
export const getDirId = (dir: Dir) => dir.dirId as DirId
export const getParentDirId = (dir: Dir) => dir.parentDirId as DirId | null
export const getWorkId = (work: Work) => work.workId as WorkId
export const getRevisionId = (revision: Revision) => revision.revisionId as RevisionId
export const getMessageId = (message: Message) => message.messageId as MessageId
export const getReplyId = (reply: Reply) => reply.replyId as ReplyId
