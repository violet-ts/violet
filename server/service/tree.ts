import type { ApiTreeProject, DeskId, ProjectId, ResisteredUserId, WorkId } from '$/types'

const projects: ApiTreeProject[] = [
  {
    id: 'frourio' as ProjectId,
    name: 'frourio PJ',
    desks: [
      {
        id: 'desk_1' as DeskId,
        name: 'Desk 1',
        works: [
          { id: 'work_1' as WorkId, name: 'work1', ext: 'word', path: '' },
          { id: 'work_2' as WorkId, name: 'work2', ext: 'jpg', path: '/あああ' },
          { id: 'work_3' as WorkId, name: '.htaccess', path: '/path1/path2' },
        ],
      },
      {
        id: 'desk_2' as DeskId,
        name: 'Desk 2',
        works: [
          { id: 'work_4' as WorkId, name: 'work4', ext: 'word', path: '/path1/path3' },
          { id: 'work_5' as WorkId, name: '.gitignore', path: '/path2/path4/ううう' },
          { id: 'work_6' as WorkId, name: 'いいい', ext: 'xlsx', path: '/path2/path4' },
        ],
      },
    ],
  },
  {
    id: 'violet' as ProjectId,
    name: 'Violet PJ',
    desks: [
      {
        id: 'desk_1' as DeskId,
        name: 'Violet Desk 1',
        works: [
          { id: 'work_1' as WorkId, name: 'work1', ext: 'word', path: '' },
          { id: 'work_2' as WorkId, name: 'work2', ext: 'jpg', path: '/あああ' },
          { id: 'work_3' as WorkId, name: '.htaccess', path: '/path1/path2' },
        ],
      },
      {
        id: 'desk_2' as DeskId,
        name: 'Violet Desk 2',
        works: [
          { id: 'work_4' as WorkId, name: 'work4', ext: 'word', path: '/path1/path3' },
          { id: 'work_5' as WorkId, name: '.gitignore', path: '/path2/path4/ううう' },
          { id: 'work_6' as WorkId, name: 'いいい', ext: 'xlsx', path: '/path2/path4' },
        ],
      },
    ],
  },
]

const resisteredUsers = [
  { id: 'foo', projectIds: ['frourio', 'violet'] } as {
    id: ResisteredUserId
    projectIds: ProjectId[]
  },
]

export const getTree = (projectId: ProjectId): ApiTreeProject | undefined => {
  return projects.find((p) => p.id === projectId) ?? projects[0]
}

export const getProjects = (resisteredUserId?: ResisteredUserId) => {
  return (
    resisteredUsers.find((u) => u.id === resisteredUserId)?.projectIds ?? ['frourio', 'violet']
  )
    .map((id) => projects.filter((p) => p.id === id)[0])
    .map(({ id, name }) => ({ id, name }))
}
