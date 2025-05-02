import { Router } from 'express'

import {
  signUp,
  login,
  logout,
  recoverPassword
} from '../controllers/authController.js'

const router = Router()

// auth routes
router.post('/login', login)
router.post('/logout', logout)
router.post('/signup', signUp)
router.post('/forgotPassword', recoverPassword)

export default router
