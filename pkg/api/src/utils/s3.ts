import { worksOriginalKeyPrefix } from '@violet/def/constants/s3'
import type {
  ProjectIconPath,
  ProjectId,
  RevisionId,
  RevisionPath,
} from '@violet/lib/types/branded'

export const createS3SaveRevisionPath = (
  projectId: ProjectId,
  revisionId: RevisionId,
  filename: string
) =>
  `${worksOriginalKeyPrefix}/projects/${projectId}/revisions/${revisionId}/${filename}` as RevisionPath

export const createS3SaveProjectIconPath = (props: {
  projectId: ProjectId
  iconName: string | null
}) => `icon/${props.projectId}/${props.iconName}` as ProjectIconPath
