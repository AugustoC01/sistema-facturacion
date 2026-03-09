import { describe, it, expect } from 'vitest'
import { createId } from '../../src/utils/idGenerator.js'

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'

describe('idGenerator', () => {
  describe('createId', () => {
    it('should return a string', async () => {
      const id = await createId()
      expect(typeof id).toBe('string')
    })

    it('should return the default length of 5', async () => {
      const id = await createId()
      expect(id).toHaveLength(5)
    })

    it('should return the correct length when specified', async () => {
      const id = await createId(8)
      expect(id).toHaveLength(8)
    })

    it('should only contain characters from the allowed alphabet', async () => {
      const id = await createId(20)
      for (const char of id) {
        expect(ALPHABET).toContain(char)
      }
    })

    it('should generate unique ids', async () => {
      const id1 = await createId()
      const id2 = await createId()
      expect(id1).not.toBe(id2)
    })
  })
})
