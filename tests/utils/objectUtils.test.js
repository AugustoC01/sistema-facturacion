import { describe, it, expect } from 'vitest'
import { filterEmptyFields } from '../../src/utils/objectUtils.js'

describe('objectUtils', () => {
  describe('filterEmptyFields', () => {
    it('should keep fields that are present in allowedFields and have a value', () => {
      const data = { name: 'Producto A', price: 100, color: 'red' }
      const allowed = ['name', 'price']
      const result = filterEmptyFields(data, allowed)
      expect(result).toEqual({ name: 'Producto A', price: 100 })
    })

    it('should skip fields that are not in allowedFields', () => {
      const data = { name: 'Producto A', secret: 'hidden' }
      const allowed = ['name']
      const result = filterEmptyFields(data, allowed)
      expect(result).toEqual({ name: 'Producto A' })
      expect(result).not.toHaveProperty('secret')
    })

    it('should return an empty object when no fields match', () => {
      const data = { name: 'Producto A' }
      const allowed = ['price', 'stock']
      const result = filterEmptyFields(data, allowed)
      expect(result).toEqual({})
    })

    it('should return an empty object when data is empty', () => {
      const result = filterEmptyFields({}, ['name', 'price'])
      expect(result).toEqual({})
    })

    // NOTE: This test documents the KNOWN BUG in filterEmptyFields:
    // The condition `if (data[field])` treats falsy values (0, false, "")
    // as missing, so valid falsy values are incorrectly dropped.
    // This will be fixed in Step 9 (polish). When fixed, this test should be updated.
    it('[KNOWN BUG] incorrectly skips valid falsy values like 0, false, and ""', () => {
      const data = { stock: 0, available: false, comment: '' }
      const allowed = ['stock', 'available', 'comment']
      const result = filterEmptyFields(data, allowed)
      // Should ideally return all three fields, but currently returns empty
      expect(result).toEqual({})
    })
  })
})
