import { Router } from 'express'

import {
  getClients,
  getClientById,
  addClient,
  updateClient,
  deleteClient
} from '../controllers/clientController.js'

const router = Router()

router.get('/', getClients)
router.get('/:id', getClientById)
router.post('/', addClient)
router.put('/:id', updateClient)
router.delete('/:id', deleteClient)

export default router
