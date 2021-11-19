import { defineController } from './$relay'

export default defineController(() => ({
  get: ({ cookies, setCookie }) => {
    const counter = (+cookies['dev-get-counter'] | 0) + 1
    setCookie('dev-get-counter', counter.toString(), { path: '/' })
    return { status: 200, body: {} }
  },
  post: ({ cookies, setCookie }) => {
    const counter = (+cookies['dev-post-counter'] | 0) + 1
    setCookie('dev-post-counter', counter.toString(), { path: '/' })
    return { status: 200, body: {} }
  },
}))
