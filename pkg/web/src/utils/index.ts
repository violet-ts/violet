import type { DeskId, ProjectId, RevisionId, S3SaveWorksPath } from '@violet/lib/types/branded'

// const env = dotenv.parse('S3_ENDPOINT')
const env = 'http://localhost:9000'
const bucket = 'violet-app-converted'

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
  `${env}/${bucket}/works/converted/${props.projectId}/${props.deskId}/revisions/${props.revisionId}/${props.filename}` as S3SaveWorksPath
