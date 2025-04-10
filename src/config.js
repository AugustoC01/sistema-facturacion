import 'dotenv/config'

// APP DATA
const URL_FRONT = process.env.URL_FRONT || 'http://localhost:5173/'
const PORT = process.env.PORT || 8080

// FIREBASE DATA
const firebaseData = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
}

const whiteList = [URL_FRONT]
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whiteList.includes(origin)) {
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

export { PORT, firebaseData, corsOptions }
