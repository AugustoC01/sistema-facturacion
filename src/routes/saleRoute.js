import { Router } from 'express'

import {
  getSales,
  getSaleById,
  addSale,
  updateSale,
  deleteSale
} from '../controllers/saleController.js'

const router = Router()

// sales crud
router.get('/', getSales)
router.get('/:id', getSaleById)
router.post('/', addSale)
router.put('/:id', updateSale)
router.delete('/:id', deleteSale)

export default router
