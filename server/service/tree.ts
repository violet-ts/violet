import type { ApiTree, OwnerId, ProjectId } from '$/types'

export const getTreeWithWork = (args: {
  ownerId: OwnerId
  projectId: ProjectId
}): ApiTree | undefined => {
  return [
    {
      id: args.ownerId,
      name: args.ownerId,
      projects: [{ id: args.projectId, name: args.projectId, works: [] }],
    },
  ]
}
