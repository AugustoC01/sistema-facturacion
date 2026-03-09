import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies BEFORE importing the module under test
vi.mock('../../src/service/db.js', () => ({
  getItemById: vi.fn(),
  updateItem: vi.fn(),
  createItem: vi.fn(),
  getItems: vi.fn(),
  getItemsByField: vi.fn(),
  deleteItem: vi.fn(),
  deleteItemField: vi.fn(),
  getItemsAboveField: vi.fn(),
  getItemsBelowField: vi.fn()
}))

vi.mock('../../src/utils/logger.js', () => ({
  default: { info: vi.fn(), error: vi.fn(), warn: vi.fn() }
}))

import { getItemById, updateItem } from '../../src/service/db.js'
import { updateStock, restoreStock } from '../../src/controllers/productController.js'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('productController — stock functions', () => {
  describe('updateStock', () => {
    it('should deduct the quantity from the product stock', async () => {
      getItemById.mockResolvedValue({ id: 'p1', name: 'Remera', stock: 10 })
      updateItem.mockResolvedValue(undefined)

      await updateStock('p1', 3)

      expect(updateItem).toHaveBeenCalledWith(
        'products',
        'p1',
        expect.objectContaining({ stock: 7, status: true })
      )
    })

    it('should set status to false when stock reaches exactly 0', async () => {
      getItemById.mockResolvedValue({ id: 'p1', name: 'Remera', stock: 3 })
      updateItem.mockResolvedValue(undefined)

      await updateStock('p1', 3)

      expect(updateItem).toHaveBeenCalledWith(
        'products',
        'p1',
        expect.objectContaining({ stock: 0, status: false })
      )
    })

    it('should throw when quantity exceeds available stock', async () => {
      getItemById.mockResolvedValue({ id: 'p1', name: 'Remera', stock: 2 })

      await expect(updateStock('p1', 5)).rejects.toThrow()
      expect(updateItem).not.toHaveBeenCalled()
    })

    it('should throw when the product is not found in Firestore', async () => {
      getItemById.mockRejectedValue(new Error('Firestore error'))

      await expect(updateStock('nonexistent', 1)).rejects.toThrow()
    })
  })

  describe('restoreStock', () => {
    it('should add the quantity back to the product stock', async () => {
      getItemById.mockResolvedValue({ id: 'p1', name: 'Remera', stock: 5 })
      updateItem.mockResolvedValue(undefined)

      await restoreStock('p1', 3)

      expect(updateItem).toHaveBeenCalledWith('products', 'p1', { stock: 8 })
    })

    it('should throw when the product is not found in Firestore', async () => {
      getItemById.mockRejectedValue(new Error('Firestore error'))

      await expect(restoreStock('nonexistent', 1)).rejects.toThrow()
    })
  })
})
