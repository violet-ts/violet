import { defineHooks } from './$relay'

export default defineHooks(() => ({
  onRequest: async (req, _reply) => {
    await req.ensureUserClaims()
    // たとえば、このあとに sub を使用して DB でグループに属しているか調べて、
    // 403 (forbidden) を返したりする
    // 上記は 401 (unauthorized) を返す
  },
}))
