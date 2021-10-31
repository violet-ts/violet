import aspida from '@aspida/fetch'
import dotenv from 'dotenv'
import type { FastifyInstance } from 'fastify'
import Fastify from 'fastify'
import cors from 'fastify-cors'
import React from 'react'
import Home from '~/pages/index.page'
import api from '~/server/api/$api'
import { fireEvent, render } from '../testUtils'

dotenv.config({ path: 'server/.env' })

const apiClient = api(aspida(undefined, { baseURL: process.env.BASE_PATH }))
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

  return fastify.listen(process.env.SERVER_PORT ?? 8080)
})

afterAll(() => fastify.close())

describe('Home page', () => {
  it('matches snapshot', async () => {
    const { asFragment, findByText } = render(<Home />, {})

    await findByText('foo task')
    expect(asFragment()).toMatchSnapshot()
  })

  it.skip('clicking button triggers prompt', async () => {
    const { findByText } = render(<Home />, {})

    window.prompt = jest.fn()
    window.alert = jest.fn()

    fireEvent.click(await findByText('LOGIN'))
    expect(window.prompt).toHaveBeenCalledWith('Enter the user id (See server/.env)')
    expect(window.alert).toHaveBeenCalledWith('Login failed')
  })
})
