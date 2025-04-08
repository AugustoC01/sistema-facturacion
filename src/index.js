import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import helmet from 'helmet'
import { corsOptions } from './config.js'

// Router import
import { Router } from './routes/router.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(compression())
app.use(helmet())

// Cors
app.use(cors(corsOptions))

Router(app)
