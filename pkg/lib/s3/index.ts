/* eslint-disable @typescript-eslint/no-explicit-any -- predicate function */

import type { Node } from 'domhandler'
export const replaceKeyPrefix = (key: string, before: string, after: string): string => {
  if (!key.startsWith(`${before}/`))
    throw new Error(`Key "${key}" is not started with "${before}/"`)
  return `${after}${key.slice(before.length)}`
}

export const listFolders = (keys: string[], folder: string): string[] => {
  return keys.filter(
    (key) =>
      key.startsWith(folder) &&
      key.endsWith('/') &&
      key.slice(folder.length).split('/').length === 2
  )
}

export const listKeys = (keys: string[], folder: string, recursive: boolean): string[] => {
  return keys.filter(
    (key) =>
      key.startsWith(folder) &&
      !key.endsWith('/') &&
      (recursive || key.slice(folder.length).split('/').length === 1)
  )
}

export const isKeyDataNode = (elem: Node): elem is Node & { data: string } => {
  return (
    elem.parent?.type === 'tag' &&
    (elem.parent as any)?.name === 'key' &&
    typeof (elem as any).data === 'string'
  )
}
