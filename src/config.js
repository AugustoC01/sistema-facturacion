import 'dotenv/config'

// APP DATA
const isDev = process.env.NODE_ENV !== 'production'
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',')
if (isDev) allowedOrigins.push('http://localhost:5173')

const PORT = process.env.PORT || 8080

// NODEMAILER DATA
const mailer = {
  DESTINY: process.env.DESTINY,
  PASS: process.env.PASS,
  SENDER: process.env.SENDER
}

// FIREBASE DATA
const firebaseData = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
}

console.log(isDev)
console.log('Allowed Origins:', allowedOrigins)

const corsOptions = {
  origin: (origin, callback) => {
    console.log(origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-type', 'Authorization'],
  preflightContine: false,
  optionsSuccessStatus: 204
}

export { PORT, firebaseData, corsOptions, mailer }
