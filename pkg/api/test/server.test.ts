import controller from '@violet/api/api/tasks/controller'
import fastify from 'fastify'

test('dependency injection into controller', async () => {
  let printedMessage = ''

  const injectedController = controller.inject((deps) => ({
    getTasks: deps.getTasks.inject({
      prisma: {
        task: {
          findMany: () =>
            Promise.resolve([
              { id: 0, label: 'task1', done: false },
              { id: 1, label: 'task2', done: false },
              { id: 2, label: 'task3', done: true },
              { id: 3, label: 'task4', done: true },
              { id: 4, label: 'task5', done: false },
            ]),
        },
      },
    }),
    print: (text: string) => {
      printedMessage = text
    },
  }))(fastify())

  const limit = 3
  const message = 'test message'
  const res = await injectedController.get({
    query: { limit, message },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logger: null as any,
    cookies: {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    env: {} as any,
    unsignCookie: () => {
      throw new Error('not implemented')
    },
    generateCsrf: () => {
      throw new Error('not implemented')
    },
    setCookie: () => {
      throw new Error('not implemented')
    },
    getUserClaims: () => {
      throw new Error('not implemented')
    },
    ensureUserClaims: () => {
      throw new Error('not implemented')
    },
    refreshUserClaims: () => {
      throw new Error('not implemented')
    },
  })

  if (res.status !== 200) fail('Response must be successful')

  expect(res.body).toHaveLength(limit)
  expect(printedMessage).toBe(message)
})
