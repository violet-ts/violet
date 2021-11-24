const FALLBACK_EXTS = ['jpg', 'png'] as const
export type InfoJson = {
  fallbackImageExts: typeof FALLBACK_EXTS[number][]
}
