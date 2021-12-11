/* eslint-disable @typescript-eslint/no-explicit-any -- testing */

import { handler } from '../index/main'

const event = JSON.parse(process.argv[2])
const context = {} as any
const callback = () => {}

void handler(event, context, callback)
