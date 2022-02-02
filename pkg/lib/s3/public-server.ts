import { isKeyDataNode } from '@violet/lib/s3'
import * as fs from 'fs'
import { DomUtils, parseDocument } from 'htmlparser2'
import fetch from 'node-fetch'

export const downloadObjectTo = async (
  bucket: string,
  key: string,
  dest: string
): Promise<void> => {
  const url = `https://${bucket}.s3.amazonaws.com/`
  const body = await fetch(`${url}${key}`).then((res) => res.body)
  if (!body) throw new Error('body not found')
  await new Promise<void>((resolve) =>
    body.pipe(fs.createWriteStream(dest)).once('finish', resolve)
  )
}

export const downloadJson = async (bucket: string, key: string): Promise<unknown> => {
  const url = `https://${bucket}.s3.amazonaws.com/`
  return await fetch(`${url}${key}`).then((res) => res.json())
}

export const listAllKeysForPublicBucket = async (bucket: string): Promise<string[]> => {
  const url = `https://${bucket}.s3.amazonaws.com/`
  const text = await fetch(url).then((res) => res.text())
  const xml = parseDocument(text)
  const keyNodes = DomUtils.find(isKeyDataNode, xml.children, true, 1000) as unknown as Array<
    Node & { data: string }
  >
  const keys = keyNodes.map((elem) => elem.data)
  if (keys.length >= 1000) {
    throw new Error('Not implemented for keys not less than 1000.')
  }
  return keys
}
