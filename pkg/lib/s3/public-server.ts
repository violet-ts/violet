import * as fs from 'fs'
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
