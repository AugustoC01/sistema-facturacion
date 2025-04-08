// Firestore methods
import { createItem, updateItem, deleteItem, getItems, getItemById } from '../service/db.js'
// Collection name
const collectionName = 'clients'

// Gets all the clients
export const getClients = async (req, res) => {
  try {
    const clients = await getItems(collectionName)
    return res.status(200).json(clients)
  } catch (e) {
    const error = new Error('Error, no se econtraron los clientes')
    return res.status(404).json({ msg: error.message })
  }
}

// Gets a client by id
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params
    const client = await getItemById(collectionName, id)
    return res.status(200).json(client)
  } catch (e) {
    const error = new Error('Error, no se econtró el cliente')
    return res.status(404).json({ msg: error.message })
  }
}

// Adds a new client
export const addClient = async (req, res) => {
  try {
    const { name, phone, comment } = req.body
    const client = { name, phone, comment }
    await createItem(collectionName, client)
    return res.status(200).json({ msg: 'Cliente ingresado correctamente' })
  } catch (e) {
    const error = new Error('Error, no se pudo ingresar el cliente')
    return res.status(404).json({ msg: error.message })
  }
}

// Updates a client
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params
    const { name, phone, comment } = req.body
    const client = { name, phone, comment }
    await updateItem(collectionName, id, client)
    return res.status(200).json({ msg: 'Cliente actualizado correctamente' })
  } catch (e) {
    const error = new Error('Error, no se pudo actualizar el cliente')
    return res.status(404).json({ msg: error.message })
  }
}

// Deletes a client
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params
    await deleteItem(collectionName, id)
    return res.status(200).json({ msg: 'Cliente eliminado correctamente' })
  } catch (e) {
    const error = new Error('Error, no se encontró el cliente')
    return res.status(404).json({ msg: error.message })
  }
}
