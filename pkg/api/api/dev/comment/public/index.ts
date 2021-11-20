export type Methods = {
  get: {
    resBody: Array<{
      picture?: string | null | undefined
      comment: string
    }>
  }
  post: {
    reqBody: string
  }
}
