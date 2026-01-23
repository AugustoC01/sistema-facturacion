import 'dotenv/config'

// APP DATA
const isDev = process.env.NODE_ENV !== 'production'

// Demo config
const isDemo = process.env.APP_MODE === 'demo'
const maxLimit = Number(process.env.MAX_LIMIT) || 3

// Cors config
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : []
if (isDev) allowedOrigins.push('http://localhost:5173')
const PORT = process.env.PORT || 8080

// NODEMAILER DATA
const mailer = {
  SENDER: process.env.SENDER,
  PASS: process.env.PASS
}

// FIREBASE DATA
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS

// console.log('Allowed Origins:', allowedOrigins)

const corsOptions = {
  origin: (origin, callback) => {
    // console.log(origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}

export { PORT, corsOptions, mailer, isDemo, maxLimit, serviceAccountPath }
