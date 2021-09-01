import type { ApiTreeWork, DeskId } from '~/server/types'

export type WorkData = {
  type: 'work'
  fullPath: string
  selected: boolean
} & ApiTreeWork

export type DirData = {
  type: 'dir'
  fullPath: string
  selected: boolean
  opened?: boolean
  name: string
  children: (DirData | WorkData)[]
}

export type DeskData = {
  type: 'desk'
  id: DeskId
  name: string
  fullPath: string
  data: (DirData | WorkData)[]
}
