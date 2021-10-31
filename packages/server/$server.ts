/* eslint-disable */
// prettier-ignore
import multipart, { FastifyMultipartAttactFieldsToBodyOptions, Multipart } from 'fastify-multipart'
// prettier-ignore
import controllerFn0 from './api/controller'
// prettier-ignore
import controllerFn1 from './api/browser/controller'
// prettier-ignore
import controllerFn2 from './api/browser/projects/controller'
// prettier-ignore
import controllerFn3 from './api/browser/projects/_projectId/controller'
// prettier-ignore
import controllerFn4 from './api/browser/projects/_projectId/desks/controller'
// prettier-ignore
import controllerFn5 from './api/browser/works/controller'
// prettier-ignore
import controllerFn6 from './api/browser/works/_workId@string/controller'
// prettier-ignore
import controllerFn7 from './api/browser/works/_workId@string/revisions/controller'
// prettier-ignore
import controllerFn8 from './api/browser/works/_workId@string/revisions/signedUrl/controller'
// prettier-ignore
import controllerFn9 from './api/browser/works/_workId@string/revisions/_revisionId@string/controller'
// prettier-ignore
import controllerFn10 from './api/browser/works/_workId@string/revisions/_revisionId@string/messages/controller'
// prettier-ignore
import controllerFn11 from './api/browser/works/_workId@string/revisions/_revisionId@string/messages/_messageId@string/controller'
// prettier-ignore
import controllerFn12 from './api/browser/works/_workId@string/revisions/_revisionId@string/messages/_messageId@string/replies/controller'
// prettier-ignore
import controllerFn13 from './api/browser/works/_workId@string/revisions/_revisionId@string/_messageId@string/controller'
// prettier-ignore
import controllerFn14 from './api/browser/works/_workId@string/revisions/_revisionId@string/_messageId@string/replies/controller'
// prettier-ignore
import controllerFn15 from './api/healthz/controller'
// prettier-ignore
import controllerFn16 from './api/tasks/controller'
// prettier-ignore
import controllerFn17 from './api/tasks/_taskId@number/controller'
// prettier-ignore
import type { ReadStream } from 'fs'
// prettier-ignore
import type { LowerHttpMethod, AspidaMethods, HttpStatusOk, AspidaMethodParams } from 'aspida'
// prettier-ignore
import type { FastifyInstance, RouteHandlerMethod, preValidationHookHandler } from 'fastify'

// prettier-ignore
export type FrourioOptions = {
  basePath?: string
  multipart?: FastifyMultipartAttactFieldsToBodyOptions
}

// prettier-ignore
type HttpStatusNoOk = 301 | 302 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 409 | 500 | 501 | 502 | 503 | 504 | 505

// prettier-ignore
type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// prettier-ignore
type BaseResponse<T, U, V> = {
  status: V extends number ? V : HttpStatusOk
  body: T
  headers: U
}

// prettier-ignore
type ServerResponse<K extends AspidaMethodParams> =
  | (K extends { resBody: K['resBody']; resHeaders: K['resHeaders'] }
  ? BaseResponse<K['resBody'], K['resHeaders'], K['status']>
  : K extends { resBody: K['resBody'] }
  ? PartiallyPartial<BaseResponse<K['resBody'], K['resHeaders'], K['status']>, 'headers'>
  : K extends { resHeaders: K['resHeaders'] }
  ? PartiallyPartial<BaseResponse<K['resBody'], K['resHeaders'], K['status']>, 'body'>
  : PartiallyPartial<
      BaseResponse<K['resBody'], K['resHeaders'], K['status']>,
      'body' | 'headers'
    >)
  | PartiallyPartial<BaseResponse<any, any, HttpStatusNoOk>, 'body' | 'headers'>

// prettier-ignore
type BlobToFile<T extends AspidaMethodParams> = T['reqFormat'] extends FormData
  ? {
      [P in keyof T['reqBody']]: Required<T['reqBody']>[P] extends Blob | ReadStream
        ? Multipart
        : Required<T['reqBody']>[P] extends (Blob | ReadStream)[]
        ? Multipart[]
        : T['reqBody'][P]
    }
  : T['reqBody']

// prettier-ignore
type RequestParams<T extends AspidaMethodParams> = Pick<{
  query: T['query']
  body: BlobToFile<T>
  headers: T['reqHeaders']
}, {
  query: Required<T>['query'] extends {} | null ? 'query' : never
  body: Required<T>['reqBody'] extends {} | null ? 'body' : never
  headers: Required<T>['reqHeaders'] extends {} | null ? 'headers' : never
}['query' | 'body' | 'headers']>

// prettier-ignore
export type ServerMethods<T extends AspidaMethods, U extends Record<string, any> = {}> = {
  [K in keyof T]: (
    req: RequestParams<T[K]> & U
  ) => ServerResponse<T[K]> | Promise<ServerResponse<T[K]>>
}

// prettier-ignore
const parseNumberTypeQueryParams = (numberTypeParams: [string, boolean, boolean][]): preValidationHookHandler => (req, reply, done) => {
  const query: any = req.query

  for (const [key, isOptional, isArray] of numberTypeParams) {
    const param = isArray ? (query[`${key}[]`] ?? query[key]) : query[key]

    if (isArray) {
      if (!isOptional && param === undefined) {
        query[key] = []
      } else if (!isOptional || param !== undefined) {
        const vals = (Array.isArray(param) ? param : [param]).map(Number)

        if (vals.some(isNaN)) {
          reply.code(400).send()
          return
        }

        query[key] = vals as any
      }

      delete query[`${key}[]`]
    } else if (!isOptional || param !== undefined) {
      const val = Number(param)

      if (isNaN(val)) {
        reply.code(400).send()
        return
      }

      query[key] = val as any
    }
  }

  done()
}

// prettier-ignore
const callParserIfExistsQuery = (parser: OmitThisParameter<preValidationHookHandler>): preValidationHookHandler => (req, reply, done) =>
  Object.keys(req.query as any).length ? parser(req, reply, done) : done()

// prettier-ignore
const createTypedParamsHandler = (numberTypeParams: string[]): preValidationHookHandler => (req, reply, done) => {
  const params = req.params as Record<string, string | number>

  for (const key of numberTypeParams) {
    const val = Number(params[key])

    if (isNaN(val)) {
      reply.code(400).send()
      return
    }

    params[key] = val
  }

  done()
}

// prettier-ignore
const formatMultipartData = (arrayTypeKeys: [string, boolean][]): preValidationHookHandler => (req, _, done) => {
  const body: any = req.body

  for (const [key] of arrayTypeKeys) {
    if (body[key] === undefined) body[key] = []
    else if (!Array.isArray(body[key])) {
      body[key] = [body[key]]
    }
  }

  Object.entries(body).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      body[key] = (val as Multipart[]).map(v => v.file ? v : (v as any).value)
    } else {
      body[key] = (val as Multipart).file ? val : (val as any).value
    }
  })

  for (const [key, isOptional] of arrayTypeKeys) {
    if (!body[key].length && isOptional) delete body[key]
  }

  done()
}

// prettier-ignore
const methodToHandler = (
  methodCallback: ServerMethods<any, any>[LowerHttpMethod]
): RouteHandlerMethod => (req, reply) => {
  const data = methodCallback(req as any) as any

  if (data.headers) reply.headers(data.headers)

  reply.code(data.status).send(data.body)
}

// prettier-ignore
const asyncMethodToHandler = (
  methodCallback: ServerMethods<any, any>[LowerHttpMethod]
): RouteHandlerMethod => async (req, reply) => {
  const data = await methodCallback(req as any) as any

  if (data.headers) reply.headers(data.headers)

  reply.code(data.status).send(data.body)
}

// prettier-ignore
export default (fastify: FastifyInstance, options: FrourioOptions = {}) => {
  const basePath = options.basePath ?? ''
  const controller0 = controllerFn0(fastify)
  const controller1 = controllerFn1(fastify)
  const controller2 = controllerFn2(fastify)
  const controller3 = controllerFn3(fastify)
  const controller4 = controllerFn4(fastify)
  const controller5 = controllerFn5(fastify)
  const controller6 = controllerFn6(fastify)
  const controller7 = controllerFn7(fastify)
  const controller8 = controllerFn8(fastify)
  const controller9 = controllerFn9(fastify)
  const controller10 = controllerFn10(fastify)
  const controller11 = controllerFn11(fastify)
  const controller12 = controllerFn12(fastify)
  const controller13 = controllerFn13(fastify)
  const controller14 = controllerFn14(fastify)
  const controller15 = controllerFn15(fastify)
  const controller16 = controllerFn16(fastify)
  const controller17 = controllerFn17(fastify)

  fastify.register(multipart, { attachFieldsToBody: true, limits: { fileSize: 1024 ** 3 }, ...options.multipart })

  fastify.get(basePath || '/', methodToHandler(controller0.get))

  fastify.get(`${basePath}/browser`, methodToHandler(controller1.get))

  fastify.get(`${basePath}/browser/projects`, asyncMethodToHandler(controller2.get))

  fastify.get(`${basePath}/browser/projects/:projectId`, asyncMethodToHandler(controller3.get))

  fastify.get(`${basePath}/browser/projects/:projectId/desks`, asyncMethodToHandler(controller4.get))

  fastify.get(`${basePath}/browser/works`, methodToHandler(controller5.get))

  fastify.get(`${basePath}/browser/works/:workId`, methodToHandler(controller6.get))

  fastify.get(`${basePath}/browser/works/:workId/revisions`, asyncMethodToHandler(controller7.get))

  fastify.post(
    `${basePath}/browser/works/:workId/revisions`,
    {
      preValidation: formatMultipartData([])
    },
    asyncMethodToHandler(controller7.post)
  )

  fastify.post(`${basePath}/browser/works/:workId/revisions/signedUrl`, asyncMethodToHandler(controller8.post))

  fastify.get(`${basePath}/browser/works/:workId/revisions/:revisionId`, asyncMethodToHandler(controller9.get))

  fastify.post(`${basePath}/browser/works/:workId/revisions/:revisionId`, asyncMethodToHandler(controller9.post))

  fastify.get(`${basePath}/browser/works/:workId/revisions/:revisionId/messages`, asyncMethodToHandler(controller10.get))

  fastify.get(`${basePath}/browser/works/:workId/revisions/:revisionId/messages/:messageId`, methodToHandler(controller11.get))

  fastify.post(`${basePath}/browser/works/:workId/revisions/:revisionId/messages/:messageId/replies`, asyncMethodToHandler(controller12.post))

  fastify.get(`${basePath}/browser/works/:workId/revisions/:revisionId/:messageId`, methodToHandler(controller13.get))

  fastify.get(`${basePath}/browser/works/:workId/revisions/:revisionId/:messageId/replies`, methodToHandler(controller14.get))

  fastify.get(`${basePath}/healthz`, methodToHandler(controller15.get))

  fastify.get(
    `${basePath}/tasks`,
    {
      preValidation: callParserIfExistsQuery(parseNumberTypeQueryParams([['limit', true, false]]))
    },
    asyncMethodToHandler(controller16.get)
  )

  fastify.post(`${basePath}/tasks`, asyncMethodToHandler(controller16.post))

  fastify.patch(
    `${basePath}/tasks/:taskId`,
    {
      preValidation: createTypedParamsHandler(['taskId'])
    },
    asyncMethodToHandler(controller17.patch)
  )

  fastify.delete(
    `${basePath}/tasks/:taskId`,
    {
      preValidation: createTypedParamsHandler(['taskId'])
    },
    asyncMethodToHandler(controller17.delete)
  )

  return fastify
}
