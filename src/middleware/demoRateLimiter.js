import rateLimit from 'express-rate-limit'
import { maxLimit } from '../config.js'
import logger from '../utils/logger.js'

const demoWriteLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24hs
  max: maxLimit, // operaciones por IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(403).json({
      code: 'DEMO_LIMIT_REACHED',
      message: 'Modo demo: límite diario de operaciones alcanzado'
    })
  }
})

export const applyDemoLimiter = (app) => {
  app.post('*', demoWriteLimiter)
  app.put('*', demoWriteLimiter)
  app.delete('*', demoWriteLimiter)

  logger.info('App running in DEMO MODE')
  logger.info({ maxLimit }, 'Demo rate limit active')
}
