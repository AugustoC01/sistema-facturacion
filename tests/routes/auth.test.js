import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

// ── Mocks must be declared before importing app ──────────────────────────────

vi.mock('../../src/service/db.js', () => ({
  getItemsByField: vi.fn(),
  getItems: vi.fn(),
  getItemById: vi.fn(),
  createItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn()
}))

vi.mock('../../src/utils/bcrypt.js', () => ({
  hashPassword: vi.fn(),
  comparePassword: vi.fn()
}))

vi.mock('../../src/utils/nodemailer.js', () => ({
  sendEmail: vi.fn()
}))

vi.mock('pino-http', () => ({
  default: () => (_req, _res, next) => next()
}))

vi.mock('../../src/utils/logger.js', () => ({
  default: { info: vi.fn(), error: vi.fn(), warn: vi.fn() }
}))

// Mock Firebase Admin so importing db.js/firebase.js doesn't fail
vi.mock('../../src/service/firebase.js', () => ({
  db: {}
}))

// ── Import after mocks ────────────────────────────────────────────────────────
import { getItemsByField, createItem } from '../../src/service/db.js'
import { comparePassword, hashPassword } from '../../src/utils/bcrypt.js'
import app from '../../src/app.js'

// ─────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
})

const validEmployee = {
  id: 'emp1',
  name: 'Juan',
  email: 'juan@test.com',
  password: 'hashed'
}

describe('Auth routes', () => {
  describe('POST /user/login', () => {
    it('should return 200 and set a session cookie on valid credentials', async () => {
      getItemsByField.mockResolvedValue([validEmployee])
      comparePassword.mockResolvedValue(true)

      const res = await request(app)
        .post('/user/login')
        .send({ email: 'juan@test.com', password: 'plain123' })

      expect(res.status).toBe(200)
      expect(res.body.msg).toBe('Inicio de sesion exitoso')
      expect(res.headers['set-cookie']).toBeDefined()
    })

    it('should return 401 when employee is not found', async () => {
      getItemsByField.mockResolvedValue([])

      const res = await request(app)
        .post('/user/login')
        .send({ email: 'noone@test.com', password: 'plain123' })

      expect(res.status).toBe(401)
    })

    it('should return 401 when password does not match', async () => {
      getItemsByField.mockResolvedValue([validEmployee])
      comparePassword.mockResolvedValue(false)

      const res = await request(app)
        .post('/user/login')
        .send({ email: 'juan@test.com', password: 'wrongpassword' })

      expect(res.status).toBe(401)
    })

    it('should return 400 for an invalid email format', async () => {
      const res = await request(app)
        .post('/user/login')
        .send({ email: 'not-an-email', password: 'plain123' })

      expect(res.status).toBe(400)
    })
  })

  describe('POST /user/signup', () => {
    it('should return 200 when a new employee is registered', async () => {
      getItemsByField.mockResolvedValue([]) // no existing employee
      hashPassword.mockResolvedValue('hashed_password')
      createItem.mockResolvedValue(undefined)

      const res = await request(app)
        .post('/user/signup')
        .send({ name: 'Maria', email: 'maria@test.com', password: 'pass123' })

      expect(res.status).toBe(200)
      expect(res.body.msg).toBe('Empleado registrado correctamente')
    })

    it('should return 400 when the email is already taken', async () => {
      getItemsByField.mockResolvedValue([validEmployee])

      const res = await request(app)
        .post('/user/signup')
        .send({ name: 'Otro', email: 'juan@test.com', password: 'pass123' })

      expect(res.status).toBe(400)
    })

    it('should return 400 for an invalid email format', async () => {
      const res = await request(app)
        .post('/user/signup')
        .send({ name: 'Test', email: 'bad-email', password: 'pass123' })

      expect(res.status).toBe(400)
    })
  })
})
