import type { DecodedIdToken } from 'firebase-admin/auth'
import type { GitHubUserClaims } from './github'

export type UserClaims = DecodedIdToken & (Record<string, unknown> | GitHubUserClaims)
