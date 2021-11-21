// Next.jsのskipLibCheckの影響で@violet/web配下で拡張子がd.tsだと以下のような自身の型エラーに気付けない
// export type BrokenType = { a: NotExistsType }
import type { ApiDesk, ApiMessage, ApiProject, ApiRevision, ApiWork } from '@violet/lib/types/api'
import type {
  DeskId,
  MessageId,
  ProjectId,
  ReplyId,
  RevisionId,
  WorkId,
} from '@violet/lib/types/branded'

export type BrowserReply = {
  id: ReplyId
  content: string
  createdAt: number
  userName: string
}

export type BrowserMessage = {
  id: MessageId
  content: string
  createdAt: number
  userName: string
  replies: BrowserReply[]
}

export type BrowserRevision = {
  id: RevisionId
  messages: BrowserMessage[]
}

export type BrowserWork = {
  type: 'work'
  fullPath: string
  selected: boolean
} & ApiWork

export type BrowserDir = {
  type: 'dir'
  name: string
  fullPath: string
  selected: boolean
  opened: boolean | undefined
  children: (BrowserDir | BrowserWork)[]
}

export type BrowserDesk = {
  type: 'desk'
  id: DeskId
  name: string
  fullPath: string
  selected: boolean
  opened: boolean | undefined
  children: (BrowserDir | BrowserWork)[]
}

export type OpenedFullPathDict = Record<string, boolean | undefined>

export type BrowserProject = {
  tabs: ApiWork[]
  openedTabId: WorkId | undefined
  selectedFullPath: string
  openedFullPathDict: OpenedFullPathDict
} & ApiProject

export type BrowserApiWholeDict = {
  desksDict: Record<ProjectId, ApiDesk[]>
  revisionsDict: Record<WorkId, ApiRevision[]>
  messagesDict: Record<RevisionId, ApiMessage[]>
}

export type ProjectApiData = {
  projectId: ProjectId
  name: string
  desks: ApiDesk[]
  revisions: BrowserRevision[] | undefined
}
