import { worksOriginalKeyPrefix } from '@violet/def/constants/s3'
import type {
  DeskId,
  ProjectId,
  RevisionId,
  RevisionPath,
  S3ProjectIconPath,
} from '@violet/lib/types/branded'

export const createS3SaveRevisionPath = (props: {
  projectId: ProjectId
  deskId: DeskId
  revisionId: RevisionId
  filename: string
}) =>
  `${worksOriginalKeyPrefix}/${props.projectId}/${props.deskId}/revisions/${props.revisionId}/${props.filename}` as RevisionPath

export const createS3ProjectIconPath = (props: { projectId: ProjectId; iconExt?: string | null }) =>
  `icon/${props.projectId}/${props.projectId}.${props.iconExt}` as S3ProjectIconPath
