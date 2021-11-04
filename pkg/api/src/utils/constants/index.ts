export const fileTypes = [
  {
    ex: '.pdf',
    type: 'application/pdf',
  },
  {
    ex: '.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  {
    ex: '.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  {
    ex: '.pptx',
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  },
] as const

export const acceptExtensions = fileTypes.map((x) => x.ex).join()
