import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import helmet from 'helmet'
import { corsOptions, isDemo } from './config.js'
import { demoWriteLimiter } from './middleware/demoRateLimiter.js'

// Router import
import { Router } from './routes/router.js'

const app = express()

// DEMO MODE
app.set('trust proxy', 1)
if (isDemo) {
  app.post('*', demoWriteLimiter)
  app.put('*', demoWriteLimiter)
  app.delete('*', demoWriteLimiter)

  console.log('🚧 App corriendo en MODO DEMO')
  console.log('🔒 Rate limit DEMO activo')
}

app.use(express.json())
app.use(cookieParser())
app.use(compression())
app.use(helmet())

// Cors & preflight options
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

Router(app)
