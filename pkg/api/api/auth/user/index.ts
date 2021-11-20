import type { UserClaims } from '@violet/def/user/session-claims'

export type Methods = {
  get: {
    resBody: UserClaims | null
  }
}
