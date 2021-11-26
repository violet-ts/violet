// Next.jsのskipLibCheckの影響で@violet/web配下で拡張子がd.tsだと以下のような自身の型エラーに気付けない
// export type BrokenType = { a: NotExistsType }
import type {
  ApiChildDir,
  ApiMessage,
  ApiProject,
  ApiReply,
  ApiRevision,
  ApiRootDir,
  ApiWork,
} from '@violet/lib/types/api'
import type { DirId, MessageId, ProjectId, RevisionId, WorkId } from '@violet/lib/types/branded'

export type BrowserProject = ApiProject

export type BrowserRootDir = { projectId: ProjectId; works: BrowserWork[] } & Omit<
  ApiRootDir,
  'works'
>

export type BrowserChildDir = { projectId: ProjectId; works: BrowserWork[] } & Omit<
  ApiChildDir,
  'works'
>

export type BrowserDir = BrowserRootDir | BrowserChildDir

export type BrowserWork = { dirId: DirId } & ApiWork

export type BrowserRevision = { workId: WorkId } & ApiRevision

export type BrowserMessage = { revisionId: RevisionId; replies: BrowserReply[] } & ApiMessage

export type BrowserReply = { messageId: MessageId } & ApiReply

export type BrowserWholeDict = {
  dirsForProjectId: Record<ProjectId, BrowserDir[]>
  revisionsForWorkId: Record<WorkId, BrowserRevision[] | undefined>
  messagesForRevisionId: Record<RevisionId, BrowserMessage[] | undefined>
}

export type Tab = { type: 'work'; id: WorkId } | { type: 'dir'; id: DirId }

export type OperationData = {
  tabs: Tab[]
  activeTab: Tab | undefined
  openedDirDict: Record<DirId, boolean | undefined>
}

export type CurrentDirsAndWork = {
  dirs: [BrowserRootDir, ...BrowserChildDir[]]
  work: BrowserWork | undefined
}

export type DirsDict = Record<DirId, BrowserDir>

export type DirsDictForProjectId = Record<ProjectId, DirsDict>

export type WorksDict = Record<WorkId, BrowserWork>

export type WorksDictForProjectId = Record<ProjectId, WorksDict>

export type BrowserPageParams = {
  currentProject?: BrowserProject
  currentDirsAndWork?: CurrentDirsAndWork
  operationData?: OperationData
  projects: BrowserProject[]
  wholeDict: BrowserWholeDict
}
