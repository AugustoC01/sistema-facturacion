import { Router } from 'express'
import { userAuth } from '../middleware/userAuth.js'

import {
  getSales,
  getSaleById,
  addSale,
  updateSale,
  deleteSale,
  getIncomeReport,
  getAllReports
} from '../controllers/saleController.js'

const router = Router()
router.use(userAuth)

router.get('/', getSales)
router.get('/:id', getSaleById)
router.post('/', addSale)
router.put('/:id', updateSale)
router.delete('/:id', deleteSale)
// gets a sales report
router.get('/report', getAllReports)
router.get('/report/:begin/:end', getIncomeReport)

export default router
