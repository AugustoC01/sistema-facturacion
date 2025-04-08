import { customAlphabet } from 'nanoid/non-secure'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'

export const createId = async (length = 5) => {
  const nanoid = customAlphabet(alphabet, length)
  const id = nanoid()
  return id
}
