import type { DeskId, EditionId, ProjectId, RevisionId, WorkId } from './branded'

export type ApiProjectSummary = {
  id: ProjectId
  name: string
}

export type ApiTreeWork = {
  id: WorkId
  name: string
  ext?: string
  path: string
}

export type ApiTreeDesk = {
  id: DeskId
  name: string
  works: ApiTreeWork[]
}

export type ApiTreeProject = {
  id: ProjectId
  name: string
  desks: ApiTreeDesk[]
}

export type ApiWorkDetail = {
  id: WorkId
  name: string
  ext?: string
  revisions: {
    id: RevisionId
    editions: {
      id: EditionId
    }[]
  }[]
}
