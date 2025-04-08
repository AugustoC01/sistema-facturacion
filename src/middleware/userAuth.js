import { createId } from '../utils/idGenerator.js'

// Local sessions to store active users
const activeSession = new Map()

// Middleware to check userSession
export const userAuth = (req, res, next) => {
  const { sessionId } = req.cookies

  // checks if it's a valid session
  const user = activeSession.get(sessionId)
  if (!user) {
    // REDIRIGIR A LOGIN
    return res.status(401).json({ msg: 'Acceso no autorizado!' })
  }
  // Sets the user into the request
  req.user = user
  next()
}

// Adds the user id into the active session map
export const createSession = async (res, user) => {
  const sessionId = await createId()
  activeSession.set(sessionId, user) // saves user session in memory
  // sets user session in client cookie
  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  })
}

// Removes the user from the active session map
export const destroySession = (req, res) => {
  const { sessionId } = req.cookies
  activeSession.delete(sessionId)
  // removes user session from the client's cookie
  res.clearCookie('sessionId')
}
