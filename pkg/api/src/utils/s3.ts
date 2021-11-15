import { worksOriginalKeyPrefix } from '@violet/def/constants/s3'
import type { DeskId, ProjectId, RevisionId, S3SaveWorksPath } from '@violet/lib/types/branded'

export const createS3SaveWorksPath = (props: {
  projectId: ProjectId
  deskId: DeskId
  revisionId: RevisionId
  filename: string
}) =>
  `${worksOriginalKeyPrefix}/${props.projectId}/${props.deskId}/revisions/${props.revisionId}/${props.filename}` as S3SaveWorksPath
