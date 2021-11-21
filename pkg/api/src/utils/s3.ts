import { worksOriginalKeyPrefix } from '@violet/def/constants/s3'
import type {
  DeskId,
  ProjectId,
  RevisionId,
  S3ProjectIconPath,
  S3SaveWorksPath,
} from '@violet/lib/types/branded'

export const createS3SaveWorksPath = (props: {
  projectId: ProjectId
  deskId: DeskId
  revisionId: RevisionId
  filename: string
}) =>
  `${worksOriginalKeyPrefix}/${props.projectId}/${props.deskId}/revisions/${props.revisionId}/${props.filename}` as S3SaveWorksPath

export const createS3ProjectIconPath = (props: { projectId: ProjectId; iconExt?: string | null }) =>
  `icon/${props.projectId}/${props.projectId}.${props.iconExt}` as S3ProjectIconPath
