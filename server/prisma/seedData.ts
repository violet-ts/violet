import type { Prisma } from '.prisma/client'

const projectIds = {
  id1: '82116895-a386-8a33-f6e0-347408413e33',
  id2: 'f1ba8e31-1f45-bc16-fb72-c10355cae08b',
}
const deskIds = {
  id1: '3d978a72-8c15-47b9-3fc1-320f700a3ea4',
  id2: 'e8e8afc5-1544-5c86-3ed4-64a3c75514f9',
  id3: 'e41d88de-5987-3598-e2c3-6bf9da9a7ccf',
  id4: '51485964-226d-c8f7-3e25-a064222aa02e',
}
const workIds = {
  id1: '7064c174-4ec2-6b83-6ce2-3c44d8e8c0b1',
  id2: 'e5793f6d-1a4a-a354-bf6b-0fbd7513c32e',
  id3: 'a4d5862b-90eb-16ef-a7cd-86ea8bdcab14',
  id4: '95818d3a-4893-c7b9-b5fd-6aa837600a3d',
}
const revisionIds = {
  id1: 'b68bf04f-70d0-52be-c3df-4a4ec0bcaad1',
  id2: '417a8b21-3d58-3d12-adfb-3904211e19c7',
  id3: '1ae8e8ec-ea6b-d356-db80-a4a271158c2f',
  id4: '0b5633f7-4405-27e0-b263-2c97d600f94d',
}
export const projectData: Prisma.ProjectCreateInput[] = [
  {
    projectId: projectIds.id1,
    projectName: 'Violet',
  },
  {
    projectId: projectIds.id2,
    projectName: 'frourio',
  },
]

export const deskData: Prisma.DeskCreateInput[] = [
  {
    deskId: deskIds.id1,
    deskName: 'Desk1',
    project: {
      connect: {
        projectId: projectIds.id1,
      },
    },
  },
  {
    deskId: deskIds.id2,
    deskName: 'Desk2',
    project: {
      connect: {
        projectId: projectIds.id1,
      },
    },
  },
  {
    deskId: deskIds.id3,
    deskName: 'Desk3',
    project: {
      connect: {
        projectId: projectIds.id2,
      },
    },
  },
  {
    deskId: deskIds.id4,
    deskName: 'Desk4',
    project: {
      connect: {
        projectId: projectIds.id2,
      },
    },
  },
]

export const workData: Prisma.WorkCreateInput[] = [
  {
    workId: workIds.id1,
    workName: 'Work1',
    path: '',
    desk: {
      connect: {
        deskId: deskIds.id1,
      },
    },
  },
  {
    workId: workIds.id2,
    workName: 'Work2',
    path: '/path1/path2',
    desk: {
      connect: {
        deskId: deskIds.id2,
      },
    },
  },
  {
    workId: workIds.id3,
    workName: 'Work3',
    path: '/path2/path4/ううう',
    desk: {
      connect: {
        deskId: deskIds.id3,
      },
    },
  },
  {
    workId: workIds.id4,
    workName: 'Work4',
    path: '/path1/path2',
    desk: {
      connect: {
        deskId: deskIds.id4,
      },
    },
  },
]

export const revisionData: Prisma.RevisionCreateInput[] = [
  {
    revisionId: revisionIds.id1,
    work: {
      connect: {
        workId: workIds.id1,
      },
    },
  },
  {
    revisionId: revisionIds.id2,
    work: {
      connect: {
        workId: workIds.id2,
      },
    },
  },
  {
    revisionId: revisionIds.id3,
    work: {
      connect: {
        workId: workIds.id3,
      },
    },
  },
  {
    revisionId: revisionIds.id4,
    work: {
      connect: {
        workId: workIds.id4,
      },
    },
  },
]
