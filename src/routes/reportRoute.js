import { Router } from 'express'

import {
  getDaysReport,
  getReports
} from '../controllers/reportsController.js'

const router = Router()

// sales report
router.get('/', getReports)
router.get('/days/:begin/:end', getDaysReport)

export default router
