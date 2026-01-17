import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Firebase data
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const serviceAccount = require('../../serviceAccountKey.json')

initializeApp({
  credential: cert(serviceAccount)
})

export const db = getFirestore()
