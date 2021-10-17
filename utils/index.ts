export const getWorkFullName = (work: { name: string; ext?: string | null }) =>
  `${work.name}${work.ext ? `.${work.ext}` : ''}`
