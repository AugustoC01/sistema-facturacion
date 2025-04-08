import { Router } from 'express'

import {
  getProducts,
  getProductsByCategory,
  getProductsBySupplier,
  getEnabledProducts,
  getDisabledProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  deleteProductField,
  getProductsBelowStock,
  getProductsBelowPrice,
  getProductsAbovePrice
} from '../controllers/productController.js'

const router = Router()

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', addProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)
router.get('/category/:categoryId', getProductsByCategory)
router.get('/supplier/:supplierId', getProductsBySupplier)
router.get('/stock/enabled', getEnabledProducts)
router.get('/stock/disabled', getDisabledProducts)
// Specific field operations
router.delete('/remove/:id/field', deleteProductField)
router.get('/higherPrice/:price', getProductsAbovePrice)
router.get('/lowerPrice/:price', getProductsBelowPrice)
router.get('/stock/:quantity', getProductsBelowStock)

export default router
