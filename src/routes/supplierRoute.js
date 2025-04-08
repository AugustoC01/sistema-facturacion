import { Router } from 'express'
import { userAuth } from '../middleware/userAuth.js'

import {
  getSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplierController.js'

const router = Router()
router.use(userAuth)

router.get('/', getSuppliers)
router.get('/:id', getSupplierById)
router.post('/', addSupplier)
router.put('/:id', updateSupplier)
router.delete('/:id', deleteSupplier)

export default router
