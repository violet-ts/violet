import type { DeskId, ProjectId, RevisionId, S3SaveWorksPath } from '@violet/api/types'

export const createS3SaveWorksPath = (props: {
  projectId: ProjectId
  deskId: DeskId
  revisionId: RevisionId
  filename: string
}) =>
  `${props.projectId}/${props.deskId}/revisions/${props.revisionId}/original/${props.filename}` as S3SaveWorksPath
