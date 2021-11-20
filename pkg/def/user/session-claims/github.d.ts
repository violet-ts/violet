/**
 * ドキュメント化されているわけではない
 * @example
 * ```
 * if ('github.com' in userClaims.firebase.identities) {
 *   userClaims.firebase.identities['github.com']
 * }
 * ```
 */
export type GitHubUserClaims = {
  /**
   * example: `"GitHub Web Flow"`
   */
  name: string
  /**
   * example: `"https://avatars.githubusercontent.com/u/..."`
   */
  picture: string
  /**
   * @deprecated
   * Use .sub instead.
   * example: `"i...2"`
   */
  user_id: string
  /**
   * example: `"foo@example.com"`
   */
  email: string
  /**
   * example: `false`
   */
  email_verified: boolean
  firebase: {
    identities: {
      /**
       * example: `["11111111"]`
       */
      'github.com': string[]
      /**
       * example: `["foo@example.com"]`
       */
      email: string[]
    }
    sign_in_provider: 'github.com'
  }
}
