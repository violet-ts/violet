import { v4 as uuidv4 } from 'uuid'

export const generateId = <T extends string>() => uuidv4() as T
