// firebase functions
import { getItemsByField } from '../service/db.js'
import { addEmployee } from './employeeController.js'
// password functions
import { comparePassword } from '../utils/bcrypt.js'
// cookie session functions
import { createSession, destroySession } from '../middleware/userAuth.js'
import { createId } from '../utils/idGenerator.js'

const collectionName = 'employees'

const validEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/
  return (regex.test(email))
}

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const employee = { name, email, password }
    console.log(employee)
    employee.code = await createId(3)
    if (!validEmail(employee.email)) {
      return res.status(400).json({ msg: 'Correo invalido' })
    }
    addEmployee(employee)
    res.status(200).json({ msg: 'Empleado registrado correctamente' })
  } catch (e) {
    return res.status(500).json({ msg: 'Error al registrarse' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!validEmail(email)) {
      return res.status(400).json({ msg: 'Correo invalido' })
    }

    const data = await getItemsByField(collectionName, 'email', email)
    const employee = data[0]

    if (!employee) {
      return res.status(401).json({ msg: 'Cuenta no encontrada' })
    }

    const isMatch = await comparePassword(password, employee.password)

    if (!isMatch) {
      return res.status(401).json({ msg: 'Datos incorrectos' })
    }

    await createSession(res, employee)
    return res.status(200).json({ msg: 'Inicio de sesion exitoso' })
  } catch (e) {
    return res.status(500).json({ msg: 'Error al iniciar sesion' })
  }
}

export const logout = async (req, res) => {
  try {
    destroySession(req, res)
    return res.status(200).json({ msg: 'Cierre de sesion exitoso' })
  } catch (e) {
    return res.status(500).json({ msg: 'Error al cerrar sesion' })
  }
}
