import rateLimit from 'express-rate-limit'
import { maxLimit } from '../config.js'

export const demoWriteLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24hs
  max: maxLimit, // operaciones por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Modo demo: límite diario de operaciones alcanzado'
  }
})
