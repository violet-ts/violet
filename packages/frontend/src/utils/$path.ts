/* eslint-disable */
// prettier-ignore
export const pagesPath = {
  browser: {
    _pathes: (pathes: string[]) => ({
      $url: (url?: { hash?: string }) => ({ pathname: '/browser/[...pathes]' as const, query: { pathes }, hash: url?.hash })
    })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash })
}

// prettier-ignore
export type PagesPath = typeof pagesPath

// prettier-ignore
export const staticPath = {
  favicon_png: '/favicon.png',
  vercel_svg: '/vercel.svg'
} as const

// prettier-ignore
export type StaticPath = typeof staticPath
