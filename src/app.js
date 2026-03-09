import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import helmet from 'helmet'
import pinoHttp from 'pino-http'
import { corsOptions, isDemo, isDev } from './config.js'
import { applyDemoLimiter } from './middleware/demoRateLimiter.js'
import logger from './utils/logger.js'
import { Router } from './routes/router.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(compression())
app.use(helmet())

// Request logger (dev only)
if (isDev) app.use(pinoHttp({ logger }))

// Cors & preflight options
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// DEMO MODE
app.set('trust proxy', 1)
if (isDemo) {
  applyDemoLimiter(app)
}

Router(app)

export default app
