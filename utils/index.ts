import type { DeskId, ProjectId } from '~/server/types'

export const getWorkFullName = (work: { name: string; ext?: string | null }) =>
  `${work.name}${work.ext ? `.${work.ext}` : ''}`

export const getProjectInfo = (path: string[]) => {
  const [projectId, deskId] = path as [ProjectId, DeskId]
  return { projectId, deskId }
}
