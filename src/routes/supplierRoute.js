import { Router } from 'express'

import {
  getSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplierController.js'

const router = Router()

router.get('/', getSuppliers)
router.get('/:id', getSupplierById)
router.post('/', addSupplier)
router.put('/:id', updateSupplier)
router.delete('/:id', deleteSupplier)

export default router
