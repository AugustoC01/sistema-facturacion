// Firestore methods
import { createItem, updateItem, deleteItem, deleteItemField, getItems, getItemById, getItemsByField, getItemsAboveField, getItemsBelowField } from '../service/db.js'
// Collection name
const collectionName = 'products'

// NOTE: ALL ITEMS TO CREATE / UPDATE / REMOVE ARE RECEIVED AS PRODUCT

// Gets all the products
export const getProducts = async (req, res) => {
  try {
    const products = await getItems(collectionName)
    // console.log(products)
    return res.status(200).json(products)
  } catch (e) {
    const error = new Error('Error, no se encontraron los productos')
    return res.status(404).json({ msg: error.message })
  }
}

// Filter products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params
    const products = await getItemsByField(collectionName, 'category', categoryId)
    return res.json(products)
  } catch (e) {
    const error = new Error('Error, no se encontraron los productos')
    return res.status(404).json({ msg: error.message })
  }
}

export const getProductsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params
    const products = await getItemsByField(collectionName, 'supplier', supplierId)
    return res.json(products)
  } catch (e) {
    const error = new Error('Error, no se encontraron los productos')
    return res.status(404).json({ msg: error.message })
  }
}

// Filter only enabled products
export const getEnabledProducts = async (req, res) => {
  try {
    const products = getItemsByField(collectionName, 'status', true)
    return res.status(200).json(products)
  } catch (e) {
    const error = new Error('Error, no se encontraron los productos')
    return res.status(404).json({ msg: error.message })
  }
}

// Filter only enabled products
export const getDisabledProducts = async (req, res) => {
  try {
    const products = getItemsByField(collectionName, 'status', false)
    return res.status(200).json(products)
  } catch (e) {
    const error = new Error('Error, no se encontraron los productos')
    return res.status(404).json({ msg: error.message })
  }
}

// Gets a product by id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await getItemById(collectionName, id)
    return res.status(200).json(product)
  } catch (e) {
    const error = new Error('Error, no se encontró este producto')
    return res.status(404).json({ msg: error.message })
  }
}

// Adds a new product
export const addProduct = async (req, res) => {
  try {
    const { name, stock, price, cost, category, size, color, comment, supplier } = (req.body)
    const product = { name, stock, price, cost, category, size, color, comment, supplier, status: true }
    await createItem(collectionName, product)
    return res.status(200).json({ msg: 'Producto ingresado correctamente' })
  } catch (e) {
    const error = new Error('Error, no se pudo ingresar el producto')
    return res.status(404).json({ msg: error.message })
  }
}

// Updates a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, stock, price, cost, category, size, color, comment, supplier } = req.body
    const product = { name, stock, price, cost, category, size, color, comment, supplier }
    stock > 0 ? product.status = true : product.status = false
    await updateItem(collectionName, id, product)
    return res.status(200).json({ msg: 'Producto actualizado correctamente' })
  } catch (e) {
    const error = new Error('Error, no se encontró este producto')
    return res.status(404).json({ msg: error.message })
  }
}

// Deletes a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    await deleteItem(collectionName, id)
    return res.status(200).json({ msg: 'Producto eliminado correctamente' })
  } catch (e) {
    const error = new Error('Error, no se encontró este producto')
    return res.status(404).json({ msg: error.message })
  }
}

// Deletes a field from a product
export const deleteProductField = async (req, res) => {
  try {
    const { id } = req.params
    const { fieldName } = req.body
    await deleteItemField(collectionName, id, fieldName)
    return res.status(200).json({ msg: 'Producto actualizado correctamente' })
  } catch (e) {
    const error = new Error('Error, no se encontró este producto')
    return res.status(404).json({ msg: error.message })
  }
}

// Gets all the products below a stock
export const getProductsBelowStock = async (req, res) => {
  try {
    const { stock } = req.params
    const products = await getItemsBelowField(collectionName, 'stock', stock)
    return res.status(200).json(products)
  } catch (e) {
    const error = new Error('Error, no se encontraron los productos')
    return res.status(404).json({ msg: error.message })
  }
}

// Gets all the products below a stock
export const getProductsBelowPrice = async (req, res) => {
  try {
    const { price } = req.params
    const products = await getItemsBelowField(collectionName, 'price', price)
    return res.status(200).json(products)
  } catch (e) {
    const error = new Error('Error, no se encontraron los productos')
    return res.status(404).json({ msg: error.message })
  }
}

// Gets all the products below a stock
export const getProductsAbovePrice = async (req, res) => {
  try {
    const { price } = req.params
    const products = await getItemsAboveField(collectionName, 'price', price)
    return res.status(200).json(products)
  } catch (e) {
    const error = new Error('Error, no se encontraron los productos')
    return res.status(404).json({ msg: error.message })
  }
}

// Product stock functions
// Update product stock
export const updateStock = async (productId, quantity) => {
  try {
    const product = await getItemById(collectionName, productId)
    // console.log(product)
    if (product.stock < quantity) {
      throw new Error(`Stock insuficiente para el producto ${product.name}`)
    }
    const remaining = product.stock - quantity
    // console.log('stock: ', product.stock, 'quantity: ', quantity)
    // console.log('remaining: ', remaining)
    const updatedProduct = { ...product, stock: remaining, status: remaining !== 0 }
    await updateItem(collectionName, productId, updatedProduct)
  } catch (e) {
    throw new Error('Error, no se encontró este producto')
  }
}

// Restores product stock
export const restoreStock = async (productId, quantity) => {
  try {
    const product = await getItemById(collectionName, productId)
    await updateItem(collectionName, productId, { stock: product.stock + quantity })
  } catch (e) {
    throw new Error('Error, no se encontró este producto')
  }
}
