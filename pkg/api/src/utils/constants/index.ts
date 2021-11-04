export const fileTypes = [
  {
    ex: '.pdf',
    type: 'application/pdf',
  },
] as const

export const acceptExtensions = fileTypes.map((x) => x.ex).join()
