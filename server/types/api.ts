import type { DeskId, ProjectId, WorkId } from './branded'

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
