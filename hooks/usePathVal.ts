import { useRouter } from 'next/dist/client/router'
import type { OwnerId, ProjectId } from '~/server/types'

type BrandedTypes = {
  projectId: ProjectId
  ownerId: OwnerId
}

export const usePathVal = <T extends (keyof BrandedTypes)[]>(keys: T) => {
  const { query } = useRouter()

  return keys.reduce((val, key) => {
    const v = query[key]

    return { ...val, [key]: typeof v === 'string' ? v : '' }
  }, {} as { [key in T[number]]: BrandedTypes[key] })
}
