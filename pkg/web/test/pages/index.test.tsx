import aspida from '@aspida/fetch'
import api from '@violet/api/api/$api'
import { ApiProvider } from '@violet/web/src/contexts/Api'
import Home from '@violet/web/src/pages/index.page'
import type { FastifyInstance } from 'fastify'
import Fastify from 'fastify'
import cors from 'fastify-cors'
import React from 'react'
import { fireEvent, render } from '../testUtils'

const apiClient = api(aspida(undefined, { baseURL: process.env.API_BASE_PATH }))
const res = function <T>(data: T extends () => Promise<infer S> ? S : never) {
  return data
}

let fastify: FastifyInstance

beforeAll(() => {
  fastify = Fastify()
  fastify.register(cors)
  fastify.get(apiClient.tasks.$path(), (_, reply) => {
    reply.send(
      res<typeof apiClient.tasks.$get>([
        { id: 1, label: 'foo task', done: false },
        { id: 2, label: 'bar task', done: true },
      ])
    )
  })
  return fastify.listen(process.env.API_PORT ?? 8080)
})

afterAll(() => fastify.close())

describe('Home page', () => {
  // TODO(test): Firebase Auth のモックが必要
  it.skip('matches snapshot', async () => {
    const { asFragment, findByText } = render(
      <>
        <ApiProvider>
          <Home />
        </ApiProvider>
      </>,
      {}
    )

    await findByText('foo task')
    expect(asFragment()).toMatchSnapshot()
  })

  // TODO(test): Firebase Auth UI のモックが必要
  it.skip('clicking button triggers prompt', async () => {
    const { findByText } = render(<Home />, {})

    window.prompt = jest.fn()
    window.alert = jest.fn()

    fireEvent.click(await findByText('LOGIN'))
    expect(window.prompt).toHaveBeenCalledWith('Enter the user id (See @violet/api/.env)')
    expect(window.alert).toHaveBeenCalledWith('Login failed')
  })
})
