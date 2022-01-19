import { isKeyDataNode } from '@violet/lib/s3'
import type { Node } from 'domhandler'
import { DomUtils, parseDocument } from 'htmlparser2'

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
