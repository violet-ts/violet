/* eslint-disable @typescript-eslint/no-explicit-any -- predicate function */

import type { Node } from 'domhandler'
import { DomUtils, parseDocument } from 'htmlparser2'

const isKeyDataNode = (elem: Node): elem is Node & { data: string } => {
  return (
    elem.parent?.type === 'tag' &&
    (elem.parent as any)?.name === 'key' &&
    typeof (elem as any).data === 'string'
  )
}

export const listAllKeysForPublicBucket = async (bucket: string): Promise<string[]> => {
  const url = `https://${bucket}.s3.amazonaws.com/`
  const text = await fetch(url).then((res) => res.text())
  const xml = parseDocument(text)
  const keyNodes = DomUtils.find(isKeyDataNode, xml.children, true, 1000) as Array<
    Node & { data: string }
  >
  const keys = keyNodes.map((elem) => elem.data)
  if (keys.length >= 1000) {
    throw new Error('Not implemented for keys not less than 1000.')
  }
  return keys
}
