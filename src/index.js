import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import helmet from 'helmet'
import { corsOptions, isDemo } from './config.js'
import { applyDemoLimiter } from './middleware/demoRateLimiter.js'

// Router import
import { Router } from './routes/router.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(compression())
app.use(helmet())

// Cors & preflight options
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// DEMO MODE
app.set('trust proxy', 1)
if (isDemo) {
  applyDemoLimiter(app)
}

Router(app)
