export const replaceKeyPrefix = (key: string, before: string, after: string): string => {
  if (!key.startsWith(`${before}/`))
    throw new Error(`Key "${key}" is not started with "${before}/"`)
  return `${after}${key.slice(before.length)}`
}
