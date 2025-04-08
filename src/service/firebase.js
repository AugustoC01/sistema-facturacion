// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// Import the Firestore library
import { collection, getFirestore, persistentLocalCache } from 'firebase/firestore'
import { firebaseData } from '../config.js'
export { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, FieldValue, query, where } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBdIT6H2vh-tGqqQwJ-DdK5vxAjUtVcAqU',
  authDomain: 'commerce-test-669bb.firebaseapp.com',
  projectId: 'commerce-test-669bb',
  storageBucket: 'commerce-test-669bb.firebasestorage.app',
  messagingSenderId: '1058077122607',
  appId: '1:1058077122607:web:c1d6812af3c6b3e96be6da'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig, { localCache: persistentLocalCache() })
export const db = getFirestore(app)
