import { ApiDesk } from './api'
import type { DeskId, EditionId, ProjectId, RevisionId } from './branded'

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
} & ApiDesk['works'][number]

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
  id: ProjectId
  tabs: BrowserWork[]
  openedTab: BrowserWork | undefined
  selectedFullPath: string | undefined
  openedFullPathDict: OpenedFullPathDict
}
