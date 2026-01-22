import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import fs from 'fs'

// Firebase data path
import { serviceAccountPath } from '../config.js'

if (!serviceAccountPath) {
  throw new Error('GOOGLE_APPLICATION_CREDENTIALS undefined!')
}

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, 'utf8')
)

initializeApp({
  credential: cert(serviceAccount)
})

export const db = getFirestore()
