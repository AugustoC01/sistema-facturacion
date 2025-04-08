// Firestore methods
import { createItem, updateItem, deleteItem, getItems, getItemById } from '../service/db.js'
// Collection name
const collectionName = 'categories'

// Gets all the categories
export const getCategories = async (req, res) => {
  try {
    const categories = await getItems(collectionName)
    return res.json(categories)
  } catch (e) {
    const error = new Error('Error, no se econtraron las categorías')
    return res.status(404).json({ msg: error.message })
  }
}

// Gets a category by id
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params
    const category = await getItemById(collectionName, id)
    return res.status(200).json(category)
  } catch (e) {
    const error = new Error('Error, no se econtró la categoría')
    return res.status(404).json({ msg: error.message })
  }
}

// Adds a new category
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body
    const category = { name, description, status: true }
    await createItem(collectionName, category)
    return res.status(200).json({ msg: 'Categoría ingresada correctamente' })
  } catch (e) {
    const error = new Error('Error, no se pudo ingresar la categoría')
    return res.status(404).json({ msg: error.message })
  }
}

// Updates a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body
    const category = { name, description }
    await updateItem(collectionName, id, category)
    return res.status(200).json({ msg: 'Categoría actualizada correctamente' })
  } catch (e) {
    const error = new Error('Error, no se encontró esta categoría')
    return res.status(404).json({ msg: error.message })
  }
}

// Deletes a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    await deleteItem(collectionName, id)
    return res.status(200).json({ msg: 'Categoría eliminada correctamente' })
  } catch (e) {
    const error = new Error('Error, no se encontró esta categoría')
    return res.status(404).json({ msg: error.message })
  }
}
