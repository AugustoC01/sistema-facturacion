import { db } from './firebase.js'
import { FieldValue } from 'firebase-admin/firestore'
import { createId } from '../utils/idGenerator.js'

// Gets

// Helper to transform the snapshot into an array
const docsToArray = (snapshot) => {
  if (snapshot.empty) {
    return []
  }
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

// Create item
export const createItem = async (collectionName, item) => {
  try {
    if (!item.id) {
      item.id = await createId()
    }
    await db.collection(collectionName).doc(item.id).set(item)
    return item
  } catch (error) {
    console.error('Unable to create: ', error)
    throw error
  }
}

// Udate item
export const updateItem = async (collectionName, id, item) => {
  try {
    await db.collection(collectionName).doc(id).update(item)
  } catch (error) {
    console.error('Unable to update: ', error)
    throw error
  }
}

// Delete Item
export const deleteItem = async (collectionName, id) => {
  try {
    await db.collection(collectionName).doc(id).delete()
  } catch (error) {
    console.error('Unable to delete: ', error)
    throw error
  }
}

// Delete Specific Field
export const deleteItemField = async (collectionName, id, fieldName) => {
  try {
    await db.collection(collectionName).doc(id).update({
      [fieldName]: FieldValue.delete()
    })
  } catch (error) {
    console.error('Unable to delete the field: ', error)
    throw error
  }
}

// Get all items
export const getItems = async (collectionName) => {
  try {
    const snapshot = await db.collection(collectionName).get()
    return docsToArray(snapshot)
  } catch (error) {
    console.error('Unable to get items: ', error)
    throw error
  }
}

// Get Item by ID
export const getItemById = async (collectionName, id) => {
  try {
    const docSnap = await db.collection(collectionName).doc(id).get()

    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  } catch (error) {
    console.error('Unable to get the item: ', error)
    throw error
  }
}

// Query: Get Items By Field (Equal)
export const getItemsByField = async (collectionName, fieldName, fieldValue) => {
  try {
    const snapshot = await db.collection(collectionName)
      .where(fieldName, '==', fieldValue)
      .get()

    return docsToArray(snapshot)
  } catch (error) {
    console.error('Unable to get items by field: ', error)
    throw error
  }
}

// Query: Get Items Below Field (<=)
export const getItemsBelowField = async (collectionName, fieldName, fieldValue) => {
  try {
    const snapshot = await db.collection(collectionName)
      .where(fieldName, '<=', fieldValue)
      .get()

    return docsToArray(snapshot)
  } catch (error) {
    console.error('Unable to get filtered items: ', error)
    throw error
  }
}

// Query: Get Items Above Field (>=)
export const getItemsAboveField = async (collectionName, fieldName, fieldValue) => {
  try {
    const snapshot = await db.collection(collectionName)
      .where(fieldName, '>=', fieldValue)
      .get()

    return docsToArray(snapshot)
  } catch (error) {
    console.error('Unable to get filtered items: ', error)
    throw error
  }
}

// Query: Get Items Between Fields
export const getItemsBetweenField = async (collectionName, fieldName, minValue, maxValue) => {
  try {
    const snapshot = await db.collection(collectionName)
      .where(fieldName, '>=', minValue)
      .where(fieldName, '<=', maxValue)
      .get()

    return docsToArray(snapshot)
  } catch (error) {
    console.error('Unable to get filtered items: ', error)
    throw error
  }
}
