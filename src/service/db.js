import { db, collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, FieldValue, query, where } from './firebase.js'
import { createId } from '../utils/idGenerator.js'

// Gets a reference to a specified collection
const getCollectionRef = (collectionName) => collection(db, collectionName)

const docsToArray = (itemList) => {
  if (itemList.length !== 0) {
    const items = itemList.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return items
  }
  return []
}

// Creates a new item in the specified collection
export const createItem = async (collectionName, item) => {
  try {
    const collectionRef = getCollectionRef(collectionName)
    if (!item.id) {
      item.id = await createId()
    }
    const docRef = doc(collectionRef, item.id)
    await setDoc(docRef, item)
    // console.log('Item creado con éxito!')
    // console.log({ id: docRef.id, ...item })
  } catch (error) {
    console.error('Error al crear el item:', error)
  }
}

// Updates an existing item by its ID in the specified collection
export const updateItem = async (collectionName, id, item) => {
  try {
    // const collectionRef = getCollectionRef(collectionName)
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, item)
    // console.log('Item actualizado con éxito!')
  } catch (error) {
    console.error('Error al actualizar el item:', error)
  }
}

// Deletes an item by its ID in the specified collection
export const deleteItem = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
    // console.log('Item eliminado con éxito!')
  } catch (error) {
    console.error('Error al eliminar el item:', error)
  }
}

// Deletes a specific field in an item by its ID in the specified collection
export const deleteItemField = async (collectionName, id, fieldName) => {
  try {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, {
      [fieldName]: FieldValue.delete()
    })
    // console.log('Campo actualizado con éxito!')
  } catch (error) {
    console.error('Error al eliminar el item:', error)
  }
}

// Fetches all items from the specified collection
export const getItems = async (collectionName) => {
  try {
    const collectionRef = getCollectionRef(collectionName)
    const itemList = await getDocs(collectionRef)
    const items = docsToArray(itemList.docs)
    // console.log('Items:', items)
    return items
  } catch (error) {
    console.error('Error al leer los items:', error)
  }
}

// Fetches a single item by its ID from the specified collection
export const getItemById = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id)
    const itemDoc = await getDoc(docRef)
    if (itemDoc.exists()) {
      const item = { id: itemDoc.id, ...itemDoc.data() }
      // console.log('Item:', item)
      return item
    }
    return null
  } catch (error) {
    console.error('Error al leer el item:', error)
  }
}

// Query functions
// Fetches all the items that match with the query
export const getItemsByField = async (collectionName, fieldName, fieldValue) => {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, where(fieldName, '==', fieldValue))
    const itemList = await getDocs(q)
    const items = docsToArray(itemList.docs)
    return items
  } catch (error) {
    console.error('Error al leer los items:', error)
  }
}

export const getItemsBelowField = async (collectionName, fieldName, fieldValue) => {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, where(fieldName, '<=', fieldValue))
    const itemList = await getDocs(q)
    const items = docsToArray(itemList.docs)
    // console.log(`Items filtrados por ${fieldName}: ${fieldValue}`, items)
    return items
  } catch (error) {
    console.error('Error al leer los items:', error)
  }
}

// Fetches all the items that match with the query
export const getItemsAboveField = async (collectionName, fieldName, fieldValue) => {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, where(fieldName, '>=', fieldValue))
    const itemList = await getDocs(q)
    const items = docsToArray(itemList.docs)
    // console.log(`Items filtrados por ${fieldName}: ${fieldValue}`, items)
    return items
  } catch (error) {
    console.error('Error al leer los items:', error)
  }
}

// Fetches all the items that match with the query
export const getItemsBetweenField = async (collectionName, fieldName, minValue, maxValue) => {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, where(fieldName, '>=', minValue), where(fieldName, '<=', maxValue))
    const itemList = await getDocs(q)
    const items = docsToArray(itemList.docs)
    // console.log(`Items filtrados por ${fieldName}: [${minValue},${maxValue}]`, items)
    return items
  } catch (error) {
    console.error('Error al leer los items:', error)
  }
}
