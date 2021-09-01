import type { ApiTreeDesk, ApiTreeWork } from '~/server/types'

export const getWorkFullName = (work: { name: string; ext?: string }) =>
  `${work.name}${work.ext ? `.${work.ext}` : ''}`

export const getDeskByWork = (desks: ApiTreeDesk[], work: ApiTreeWork) =>
  desks.filter((d) => d.works.some((w) => w.id === work.id))[0]
