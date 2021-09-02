import type { ApiWorkDetail, EditionId, RevisionId, WorkId } from '$/types'

const works: ApiWorkDetail[] = [
  {
    id: 'work_1' as WorkId,
    name: 'work1',
    ext: 'word',
    revisions: [
      {
        id: 'revision_1' as RevisionId,
        editions: [
          {
            id: 'edition_1' as EditionId,
          },
        ],
      },
    ],
  },
]

export const getWorkById = (id: WorkId) => works.find((w) => w.id === id) ?? { ...works[0], id }
