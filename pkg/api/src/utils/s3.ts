import type { DeskId, ProjectId, RevisionId, S3SaveWorksPath } from '@violet/api/types'
import { worksOriginalKeyPrefix } from '@violet/def/constants/s3'

export const createS3SaveWorksPath = (props: {
  projectId: ProjectId
  deskId: DeskId
  revisionId: RevisionId
  filename: string
}) =>
  `${worksOriginalKeyPrefix}/${props.projectId}/${props.deskId}/revisions/${props.revisionId}/${props.filename}` as S3SaveWorksPath
