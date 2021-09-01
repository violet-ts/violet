import { useRouter } from 'next/dist/client/router'
import type { ProjectId } from '~/server/types'

type BrandedTypes = {
  projectId: ProjectId
}

export const usePathVal = <T extends (keyof BrandedTypes)[]>(keys: T) => {
  const { query } = useRouter()

  return keys.reduce((val, key) => {
    const v = query[key]

    return { ...val, [key]: typeof v === 'string' ? v : '' }
  }, {} as { [key in T[number]]: BrandedTypes[key] })
}
