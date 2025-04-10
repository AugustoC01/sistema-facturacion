import { PORT } from '../config.js'
import categoriaRouter from './categoryRoute.js'
import productRouter from './productRoute.js'
import proveedorRouter from './supplierRoute.js'
import clienteRouter from './clientRoute.js'
import ventaRouter from './saleRoute.js'
import employeeRouter from './employeeRoute.js'
import authRouter from './authRoute.js'

// middleware to check user session
import { userAuth } from '../middleware/userAuth.js'

export const Router = (app) => {
  app.get('/', (_req, res) => {
    res.json('Server running!')
  })

  // router to login/logout/signup
  app.use('/user', authRouter)

  app.use('/employees', userAuth, employeeRouter)
  app.use('/categories', userAuth, categoriaRouter)
  app.use('/products', userAuth, productRouter)
  app.use('/suppliers', userAuth, proveedorRouter)
  app.use('/clients', userAuth, clienteRouter)
  app.use('/sales', userAuth, ventaRouter)

  app.use((_req, res) => {
    res.status(404).json({ message: 'Ruta inexistente' })
  })

  // Server start
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
