import type { OwnerId, ProjectId, WorkId } from './branded'

export type ApiTreeWork = {
  id: WorkId
  name: string
  ext?: string
  key: string
}

export type ApiTreeProject = {
  id: ProjectId
  name: string
  works: ApiTreeWork[]
}

export type ApiTreeOwner = {
  id: OwnerId
  name: string
  projects: ApiTreeProject[]
}

export type ApiTree = ApiTreeOwner[]
