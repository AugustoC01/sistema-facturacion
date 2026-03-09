import { describe, it, expect } from 'vitest'
import { hashPassword, comparePassword } from '../../src/utils/bcrypt.js'

describe('bcrypt utils', () => {
  describe('hashPassword', () => {
    it('should return a string', async () => {
      const hash = await hashPassword('mypassword')
      expect(typeof hash).toBe('string')
    })

    it('should not return the original password', async () => {
      const password = 'mypassword'
      const hash = await hashPassword(password)
      expect(hash).not.toBe(password)
    })

    it('should produce different hashes for the same password each time', async () => {
      const hash1 = await hashPassword('mypassword')
      const hash2 = await hashPassword('mypassword')
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('comparePassword', () => {
    it('should return true for a correct password', async () => {
      const password = 'mypassword'
      const hash = await hashPassword(password)
      const result = await comparePassword(password, hash)
      expect(result).toBe(true)
    })

    it('should return false for an incorrect password', async () => {
      const hash = await hashPassword('mypassword')
      const result = await comparePassword('wrongpassword', hash)
      expect(result).toBe(false)
    })

    it('should return false for an empty string', async () => {
      const hash = await hashPassword('mypassword')
      const result = await comparePassword('', hash)
      expect(result).toBe(false)
    })
  })
})
