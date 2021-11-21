import { worksOriginalKeyPrefix } from '@violet/def/constants/s3'
import type { DeskId, ProjectId, RevisionId, RevisionPath } from '@violet/lib/types/branded'

export const createS3SaveRevisionPath = (props: {
  projectId: ProjectId
  deskId: DeskId
  revisionId: RevisionId
  filename: string
}) =>
  `${worksOriginalKeyPrefix}/${props.projectId}/${props.deskId}/revisions/${props.revisionId}/${props.filename}` as RevisionPath
