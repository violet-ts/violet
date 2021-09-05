import type { ApiProject, ApiWork } from './api'
import type { DeskId, EditionId, RevisionId, WorkId } from './branded'

export type ErowserEdition = {
  id: EditionId
}

export type BrowserRevision = {
  id: RevisionId
  editions: ErowserEdition[]
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
