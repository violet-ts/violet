import type { DeskId, ProjectId, RevisionId, S3SaveWorksPath } from '$/types'

export const createS3SaveWorksPath = (props: {
  projectId: ProjectId
  deskId: DeskId
  revisionId: RevisionId
}) => {
  return `${props.projectId}/${props.deskId}/revisions/${props.revisionId}` as S3SaveWorksPath
}
