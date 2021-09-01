import type { ApiTreeProject, DeskId, ProjectId, WorkId } from '$/types'

const desks = [
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
]

export const getTree = (args: { projectId: ProjectId }): ApiTreeProject | undefined => {
  return { id: args.projectId, name: 'frourio PJ', desks }
}
