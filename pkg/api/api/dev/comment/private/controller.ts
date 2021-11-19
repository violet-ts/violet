import { defineController } from './$relay'

// WARNING: これは開発用デモです。このような実装はしないでください
const firstComment = {
  picture: 'https://raw.githubusercontent.com/icons8/flat-color-icons/master/svg/assistant.svg',
  comment: '[private admin] first comment',
}
let comments: Array<{ comment: string; picture?: string | undefined | null }> = [firstComment]

export default defineController(() => ({
  get: () => ({
    status: 200,
    body: comments,
  }),
  post: async ({ body, ensureUserClaims }) => {
    const user = await ensureUserClaims()
    if (comments.length > 10) comments = [firstComment]
    comments.push({
      picture: user.picture,
      comment: `${user.name ?? '[no name]'}: ${body}`,
    })
    return {
      status: 201,
    }
  },
}))
