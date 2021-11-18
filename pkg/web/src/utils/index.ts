import type { DeskId, ProjectId, RevisionId, S3SaveWorksPath } from '@violet/lib/types/branded'
import envValues from '@violet/web/src/utils/envValues'
const { S3_ENDPOINT } = envValues

export const getWorkFullName = (work: { name: string; ext?: string | null }) =>
  `${work.name}${work.ext ? `.${work.ext}` : ''}`

export const getProjectInfo = (path: string[]) => {
  const [projectId, deskName] = path as [ProjectId, string]
  return { projectId, deskName }
}

export const createWorkPath = (props: {
  projectId: ProjectId
  deskId: DeskId
  revisionId: RevisionId
  filename: string
}) =>
  `${S3_ENDPOINT}/${props.projectId}/${props.deskId}/revisions/${props.revisionId}/${props.filename}` as S3SaveWorksPath
