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
  deleteItemField: vi.fn(),
  getItemsAboveField: vi.fn(),
  getItemsBelowField: vi.fn()
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

// Bypass the session auth middleware for all protected routes
vi.mock('../../src/middleware/userAuth.js', () => ({
  userAuth: (_req, _res, next) => next(),
  createSession: vi.fn(),
  destroySession: vi.fn()
}))

// ── Import after mocks ────────────────────────────────────────────────────────
import { getItems, getItemById, createItem, deleteItem } from '../../src/service/db.js'
import app from '../../src/app.js'

// ─────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
})

const mockProduct = {
  id: 'prod1',
  name: 'Remera',
  stock: 10,
  price: 500,
  cost: 250,
  status: true
}

describe('Product routes', () => {
  describe('GET /products', () => {
    it('should return 200 with an array of products', async () => {
      getItems.mockResolvedValue([mockProduct])

      const res = await request(app).get('/products')

      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body[0].name).toBe('Remera')
    })

    it('should return 404 when Firestore throws', async () => {
      getItems.mockRejectedValue(new Error('Firestore error'))

      const res = await request(app).get('/products')

      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty('msg')
    })
  })

  describe('POST /products', () => {
    it('should return 200 when a product is created', async () => {
      createItem.mockResolvedValue(undefined)

      const res = await request(app)
        .post('/products')
        .send({ name: 'Pantalón', stock: 5, price: 1000, cost: 500, category: 'ropa' })

      expect(res.status).toBe(200)
      expect(res.body.msg).toBe('Producto ingresado correctamente')
    })

    it('should return 404 when Firestore throws on creation', async () => {
      createItem.mockRejectedValue(new Error('Firestore error'))

      const res = await request(app)
        .post('/products')
        .send({ name: 'Pantalón', stock: 5, price: 1000 })

      expect(res.status).toBe(404)
    })
  })

  describe('DELETE /products/:id', () => {
    it('should return 200 when a product is deleted', async () => {
      deleteItem.mockResolvedValue(undefined)

      const res = await request(app).delete('/products/prod1')

      expect(res.status).toBe(200)
      expect(res.body.msg).toBe('Producto eliminado correctamente')
    })

    it('should return 404 when Firestore throws on deletion', async () => {
      deleteItem.mockRejectedValue(new Error('Firestore error'))

      const res = await request(app).delete('/products/nonexistent')

      expect(res.status).toBe(404)
    })
  })
})
