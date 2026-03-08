import { db } from './firebase.js'
import { FieldValue } from 'firebase-admin/firestore'
import { createId } from '../utils/idGenerator.js'
import logger from '../utils/logger.js'

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
    logger.error(error, 'Unable to create item in collection "%s"', collectionName)
    throw error
  }
}

// Update item
export const updateItem = async (collectionName, id, item) => {
  try {
    await db.collection(collectionName).doc(id).update(item)
  } catch (error) {
    logger.error(error, 'Unable to update item "%s" in collection "%s"', id, collectionName)
    throw error
  }
}

// Delete Item
export const deleteItem = async (collectionName, id) => {
  try {
    await db.collection(collectionName).doc(id).delete()
  } catch (error) {
    logger.error(error, 'Unable to delete item "%s" in collection "%s"', id, collectionName)
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
    logger.error(error, 'Unable to delete field "%s" from item "%s"', fieldName, id)
    throw error
  }
}

// Get all items
export const getItems = async (collectionName) => {
  try {
    const snapshot = await db.collection(collectionName).get()
    return docsToArray(snapshot)
  } catch (error) {
    logger.error(error, 'Unable to get items from collection "%s"', collectionName)
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
    logger.error(error, 'Unable to get item "%s" from collection "%s"', id, collectionName)
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
    logger.error(error, 'Unable to get items by field "%s" in collection "%s"', fieldName, collectionName)
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
    logger.error(error, 'Unable to get items below field "%s" in collection "%s"', fieldName, collectionName)
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
    logger.error(error, 'Unable to get items above field "%s" in collection "%s"', fieldName, collectionName)
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
    logger.error(error, 'Unable to get items between fields in collection "%s"', collectionName)
    throw error
  }
}
