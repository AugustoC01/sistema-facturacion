import { Router } from 'express'

import {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js'

const router = Router()

router.get('/', getCategories)
router.get('/:id', getCategoryById)
router.post('/', addCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export default router
