import type { Prisma } from '@prisma/client'

const projectIds = {
  id1: '82116895-a386-8a33-f6e0-347408413e33',
  id2: 'f1ba8e31-1f45-bc16-fb72-c10355cae08b',
}
const dirs = [
  [{ id: '3d978a72-8c15-47b9-3fc1-320f700a3ea4', name: 'Dir1' }],
  [
    { id: 'e8e8afc5-1544-5c86-3ed4-64a3c75514f9', name: 'Dir2' },
    { id: '94ff9d20-d7d1-43ab-aa7b-06a0fdcaffed', name: 'path1' },
    { id: '4e7980d8-0a40-4705-8123-4bd36e14fe57', name: 'path2' },
  ],
  [
    { id: 'e41d88de-5987-3598-e2c3-6bf9da9a7ccf', name: 'Dir3' },
    { id: '6b2f2fad-8045-4184-9937-c4c1592444e5', name: 'path2' },
    { id: 'e84a021a-3361-46f1-8f11-2c08fe1940db', name: 'path4' },
    { id: '7446dc07-cd27-4c2b-8632-e6db420fcc4e', name: 'ううう' },
  ],
  [
    { id: '51485964-226d-c8f7-3e25-a064222aa02e', name: 'Dir4' },
    { id: '7932f55b-875b-4151-ba3f-3f9937f35442', name: 'path1' },
    { id: '072c7d17-4212-41bc-a533-e774fcfe555f', name: 'path2' },
  ],
]

const workIds = {
  id1: '7064c174-4ec2-6b83-6ce2-3c44d8e8c0b1',
  id2: 'e5793f6d-1a4a-a354-bf6b-0fbd7513c32e',
  id3: 'a4d5862b-90eb-16ef-a7cd-86ea8bdcab14',
  id4: '95818d3a-4893-c7b9-b5fd-6aa837600a3d',
}

export const revisionIds = {
  id1: 'b68bf04f-70d0-52be-c3df-4a4ec0bcaad1',
  id2: '417a8b21-3d58-3d12-adfb-3904211e19c7',
  id3: '1ae8e8ec-ea6b-d356-db80-a4a271158c2f',
  id4: '0b5633f7-4405-27e0-b263-2c97d600f94d',
}

const projectName = {
  project1: 'Violet',
  project2: 'frourio',
}

const workName = {
  work1: 'Work1',
  work2: 'Work2',
  work3: 'Work3',
  work4: 'Work4',
}

export const projectData: Prisma.ProjectCreateInput[] = [
  {
    projectId: projectIds.id1,
    projectName: projectName.project1,
  },
  {
    projectId: projectIds.id2,
    projectName: projectName.project2,
  },
]

export const dirData = dirs.flatMap((dir, n) =>
  dir.map(
    ({ id, name }, i, arr): Prisma.DirCreateInput => ({
      dirId: id,
      dirName: name,
      parentDir: i > 0 ? { connect: { dirId: arr[i - 1].id } } : undefined,
      project: {
        connect: {
          projectId: n < 2 ? projectIds.id1 : projectIds.id2,
        },
      },
    })
  )
)

export const workData: Prisma.WorkCreateInput[] = [
  {
    workId: workIds.id1,
    workName: workName.work1,
    dir: {
      connect: {
        dirId: dirs[0].slice(-1)[0].id,
      },
    },
  },
  {
    workId: workIds.id2,
    workName: workName.work2,
    dir: {
      connect: {
        dirId: dirs[1].slice(-1)[0].id,
      },
    },
  },
  {
    workId: workIds.id3,
    workName: workName.work3,
    dir: {
      connect: {
        dirId: dirs[2].slice(-1)[0].id,
      },
    },
  },
  {
    workId: workIds.id4,
    workName: workName.work4,
    dir: {
      connect: {
        dirId: dirs[3].slice(-1)[0].id,
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
