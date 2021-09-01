export const getWorkFullName = (work: { name: string; ext?: string }) =>
  `${work.name}${work.ext ? `.${work.ext}` : ''}`
