// Firestore methods
import { createItem, updateItem, deleteItem, getItems, getItemById } from '../service/db.js'
// Product stock functions
import { updateStock, restoreStock } from './productController.js'
// Income Reports functions
import { increaseDailyReport, decreaseDailyReport } from './reportsController.js'
// Collection name
const collectionName = 'sales'

// Gets all sales
export const getSales = async (req, res) => {
  try {
    const sales = await getItems(collectionName)
    return res.status(200).json(sales)
  } catch (e) {
    const error = new Error('Error, no se encontraron las ventas')
    return res.status(404).json({ msg: error.message })
  }
}

// Gets a product by id
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params
    const sale = await getItemById(collectionName, id)
    return res.status(200).json(sale)
  } catch (e) {
    const error = new Error('Error, no se encontró la venta')
    return res.status(404).json({ msg: error.message })
  }
}

// Adds a new sale
export const addSale = async (req, res) => {
  try {
    const { date, productsList, subtotal, discount, total, paymentMethod, client, comment, seller } = req.body
    const sale = { date, productsList, subtotal, discount, total, paymentMethod, client, comment, seller }
    if (!date) {
      const today = new Date().toLocaleDateString('en-GB')
      sale.date = today
    }
    await createItem(collectionName, sale)
    await updateStockForSale(sale) // updates stock for sold products
    await increaseDailyReport(sale) // updates daily income report
    // LLAMAR A FUNCION QUE CREA FACTURA
    return res.status(200).json({ msg: 'Venta creada correctamente' })
  } catch (e) {
    const error = new Error('Error, no se pudo ingresar la venta')
    return res.status(404).json({ msg: error.message })
  }
}

// Updates a sell
export const updateSale = async (req, res) => {
  try {
    const { id } = req.params
    const { date, productsList, subtotal, discount, total, paymentMethod, client, comment, seller } = req.body
    const sale = { date, productsList, subtotal, discount, total, paymentMethod, client, comment, seller }
    const oldSale = await getItemById(collectionName, id)
    await updateItem(collectionName, id, sale)
    await updateStockForSaleUpdate(oldSale, sale) // updates stock from old and new products
    await decreaseDailyReport(oldSale) // updates daily income report
    await increaseDailyReport(sale) // updates daily income report
    return res.status(200).json({ msg: 'Venta actualizada correctamente' })
  } catch (e) {
    const error = new Error('Error, no se pudo actualizar la venta')
    return res.status(404).json({ msg: error.message })
  }
}

// Deletes a sell
export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params
    const sale = await getItemById(collectionName, id)
    await deleteItem(collectionName, id)
    await restoreStockForSale(sale) // updates stock from products
    await decreaseDailyReport(sale) // updates daily income report
    return res.status(200).json({ msg: 'Factura eliminada correctamente' })
  } catch (e) {
    const error = new Error('Error, no se encontró la venta')
    return res.status(404).json({ msg: error.message })
  }
}

const updateStockForSale = async (sale) => {
  for (const product of sale.productsList) {
    await updateStock(product.id, product.quantity)
  }
}

const updateStockForSaleUpdate = async (oldSale, newSale) => {
  // Restores stock from old products
  for (const product of oldSale.productsList) {
    await restoreStock(product.id, product.quantity)
  }
  // Updates stock for sold products
  for (const product of newSale.productsList) {
    await updateStock(product.id, product.quantity)
  }
}

const restoreStockForSale = async (sale) => {
  for (const product of sale.productsList) {
    await restoreStock(product.id, product.quantity)
  }
}
