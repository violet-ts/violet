export type Methods = {
  post: {
    reqBody: {
      idToken: string
    }
  }
  delete: {
    reqBody: Record<string, never>
  }
}
