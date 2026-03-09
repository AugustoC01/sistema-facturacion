import app from './app.js'
import { PORT } from './config.js'
import logger from './utils/logger.js'

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Server running')
})


