import { PORT } from '../config.js'
import categoryRouter from './categoryRoute.js'
import productRouter from './productRoute.js'
import supplierRouter from './supplierRoute.js'
import clientRouter from './clientRoute.js'
import saleRouter from './saleRoute.js'
import reportRouter from './reportRoute.js'
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
  app.use('/categories', userAuth, categoryRouter)
  app.use('/products', userAuth, productRouter)
  app.use('/suppliers', userAuth, supplierRouter)
  app.use('/clients', userAuth, clientRouter)
  app.use('/sales', userAuth, saleRouter)
  app.use('/reports', userAuth, reportRouter)

  app.use((_req, res) => {
    res.status(404).json({ message: 'Ruta inexistente' })
  })

  // Server start
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
