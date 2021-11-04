import type { ApiProject, ApiWork } from './api'
import type { DeskId, EditionId, MessageId, RevisionId, WorkId } from './branded'

export type BrowserReply = {
  id: MessageId
  contents: string
  cratedAt: number
  userName: string
}

export type BrowserMessage = {
  id: MessageId
  contents: string
  createdAt: number
  userName: string
  replys: BrowserReply[]
}

export type BrowserEdition = {
  id: EditionId
}

export type BrowserRevision = {
  id: RevisionId
  editions: BrowserEdition[]
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
