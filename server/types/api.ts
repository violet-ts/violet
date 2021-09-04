import type { DeskId, EditionId, MessageId, ProjectId, RevisionId, WorkId } from './branded'

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

export type ApiProject = {
  id: ProjectId
  name: string
}

export type ApiDesk = {
  id: DeskId
  name: string
  works: {
    id: WorkId
    name: string
    ext?: string
    path: string
  }[]
}

export type ApiRevision = {
  id: RevisionId
  editions: {
    id: EditionId
  }[]
}

export type ApiMessage = {
  id: MessageId
  content: string
}

export type BrowserApiWholeData = {
  projects: ApiProject[]
  desksList: { projectId: ProjectId; desks: ApiDesk[] }[]
  revisionsList: { projectId: ProjectId; workId: WorkId; revisions: ApiRevision[] }[]
  messagesList: { projectId: ProjectId; revisionId: RevisionId; messages: ApiMessage[] }[]
}

export type ProjectApiData = {
  projectId: ProjectId
  name: string
  desks: ApiDesk[]
  revisionsList: { workId: WorkId; revisions: ApiRevision[] }[]
  messagesList: { revisionId: RevisionId; messages: ApiMessage[] }[]
}
