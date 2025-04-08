// Firestore methods
import { createItem, updateItem, deleteItem, getItems, getItemById } from '../service/db.js'
// Collection name
const collectionName = 'suppliers'

// Gets all the suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await getItems(collectionName)
    return res.json(suppliers)
  } catch (e) {
    const error = new Error('Error, no se encontraron los proveedores')
    return res.status(404).json({ msg: error.message })
  }
}

// Gets a supplier by id
export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params
    const supplier = await getItemById(collectionName, id)
    return res.status(200).json(supplier)
  } catch (e) {
    const error = new Error('Error, no se econtró el proveedor')
    return res.status(404).json({ msg: error.message })
  }
}

// Adds a new supplier
export const addSupplier = async (req, res) => {
  try {
    const { name, phone, email, address, comment } = req.body
    const supplier = { name, phone, email, address, comment, status: true }
    await createItem(collectionName, supplier)
    return res.status(200).json({ msg: 'Proveedor ingresado correctamente' })
  } catch (e) {
    const error = new Error('Error, no se pudo ingresar el proveedor')
    return res.status(404).json({ msg: error.message })
  }
}

// Updates a supplier
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params
    const { name, phone, email, address, comment } = req.body
    const supplier = { name, phone, email, address, comment }
    await updateItem(collectionName, id, supplier)
    return res.status(200).json({ msg: 'Proveedor actualizado correctamente' })
  } catch (e) {
    const error = new Error('Error, no se encontró este proveedor')
    return res.status(404).json({ msg: error.message })
  }
}

// Deletes a supplier
export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params
    await deleteItem(collectionName, id)
    return res.status(200).json({ msg: 'Proveedor eliminado correctamente' })
  } catch (e) {
    const error = new Error('Error, no se encontró este proveedor')
    return res.status(404).json({ msg: error.message })
  }
}
