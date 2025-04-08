import { Router } from 'express'

import {
  updateEmployee,
  deleteEmployee,
  getEmployees,
  getEmployeeById
} from '../controllers/employeeController.js'

const router = Router()

// employees routes
router.get('/', getEmployees)
router.get('/:id', getEmployeeById)
router.put('/:id', updateEmployee)
router.delete('/:id', deleteEmployee)

export default router
