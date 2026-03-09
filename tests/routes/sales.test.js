import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

// ── Mocks must be declared before importing app ──────────────────────────────

vi.mock('../../src/service/db.js', () => ({
  getItemsByField: vi.fn(),
  getItems: vi.fn(),
  getItemById: vi.fn(),
  createItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn(),
  getItemsBetweenField: vi.fn()
}))

vi.mock('pino-http', () => ({
  default: () => (_req, _res, next) => next()
}))

vi.mock('../../src/utils/logger.js', () => ({
  default: { info: vi.fn(), error: vi.fn(), warn: vi.fn() }
}))

vi.mock('../../src/service/firebase.js', () => ({
  db: {}
}))

vi.mock('../../src/middleware/userAuth.js', () => ({
  userAuth: (_req, _res, next) => next(),
  createSession: vi.fn(),
  destroySession: vi.fn()
}))

// ── Import after mocks ────────────────────────────────────────────────────────
import { getItems, getItemById, createItem, updateItem, deleteItem } from '../../src/service/db.js'
import app from '../../src/app.js'

// ─────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
})

const mockProduct = { id: 'prod1', name: 'Remera', stock: 10, status: true }

const mockSale = {
  id: 'sale1',
  date: '08/03/2026',
  productsList: [{ id: 'prod1', quantity: 2 }],
  subtotal: 1000,
  discount: 0,
  total: 1000,
  paymentMethod: 'cash',
  seller: 'emp1'
}

const mockReport = {
  id: '08-03-2026',
  date: '08/03/2026',
  totalIncome: 5000,
  totalSales: 3,
  salesCount: { cash: 3 },
  incomeByPaymentMethod: { cash: 5000 }
}

describe('Sale routes', () => {
  describe('GET /sales', () => {
    it('should return 200 with an array of sales', async () => {
      getItems.mockResolvedValue([mockSale])

      const res = await request(app).get('/sales')

      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
    })

    it('should return 404 when Firestore throws', async () => {
      getItems.mockRejectedValue(new Error('Firestore error'))

      const res = await request(app).get('/sales')

      expect(res.status).toBe(404)
    })
  })

  describe('POST /sales', () => {
    it('should return 200, update stock and increment daily report', async () => {
      // createItem for the sale
      createItem.mockResolvedValue(undefined)
      // getItemById — called by updateStock (product) then dailyReport
      getItemById
        .mockResolvedValueOnce(mockProduct)   // product fetch in updateStock
        .mockResolvedValueOnce(mockReport)    // report fetch in increaseDailyReport
      // updateItem — called by updateStock then updateReport
      updateItem.mockResolvedValue(undefined)

      const res = await request(app)
        .post('/sales')
        .send(mockSale)

      expect(res.status).toBe(200)
      expect(res.body.msg).toBe('Venta creada correctamente')
      expect(createItem).toHaveBeenCalledOnce()
      expect(updateItem).toHaveBeenCalled()
    })

    it('should return 404 when Firestore throws during sale creation', async () => {
      createItem.mockRejectedValue(new Error('Firestore error'))

      const res = await request(app)
        .post('/sales')
        .send(mockSale)

      expect(res.status).toBe(404)
    })
  })

  describe('DELETE /sales/:id', () => {
    it('should return 200, restore stock and decrement daily report', async () => {
      getItemById
        .mockResolvedValueOnce(mockSale)    // fetch sale in deleteSale
        .mockResolvedValueOnce(mockProduct) // product fetch in restoreStock
        .mockResolvedValueOnce(mockReport)  // report fetch in decreaseDailyReport
      deleteItem.mockResolvedValue(undefined)
      updateItem.mockResolvedValue(undefined)

      const res = await request(app).delete('/sales/sale1')

      expect(res.status).toBe(200)
      expect(res.body.msg).toBe('Factura eliminada correctamente')
      expect(deleteItem).toHaveBeenCalledWith('sales', 'sale1')
      expect(updateItem).toHaveBeenCalled()
    })

    it('should return 404 when the sale is not found', async () => {
      getItemById.mockRejectedValue(new Error('not found'))

      const res = await request(app).delete('/sales/nonexistent')

      expect(res.status).toBe(404)
    })
  })
})
