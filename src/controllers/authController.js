// service functions
import { getEmployeeByEmail, addEmployee, updateEmployeePassword } from '../service/employeeService.js'
// password functions
import { comparePassword } from '../utils/bcrypt.js'
// cookie session functions
import { createSession, destroySession } from '../middleware/userAuth.js'
import { createId } from '../utils/idGenerator.js'
import { sendEmail } from '../utils/nodemailer.js'

const validEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/
  return (regex.test(email))
}

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const employee = { name, email, password }
    employee.code = await createId(3)
    console.log(employee)
    if (!validEmail(employee.email)) {
      return res.status(400).json({ msg: 'Correo invalido' })
    }
    const existentEmployee = await getEmployeeByEmail(email)
    if (existentEmployee) {
      return res.status(400).json({ msg: 'Ese correo no se encuentra disponible' })
    }
    await addEmployee(employee)
    return res.status(200).json({ msg: 'Empleado registrado correctamente' })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ msg: 'Error al registrarse' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!validEmail(email)) {
      return res.status(400).json({ msg: 'Correo invalido' })
    }

    const employee = await getEmployeeByEmail(email)

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

export const recoverPassword = async (req, res) => {
  try {
    const { email } = req.body
    const employee = await getEmployeeByEmail(email)

    if (employee) {
      const newPassword = await createId(8)
      console.log(newPassword)
      await updateEmployeePassword(email, newPassword)
      await sendEmail({ subject: 'Recuperacion de contraseña', text: `Su nueva contraseña es: ${newPassword}` }, email)
      return res.status(200).json({ msg: 'Se ha enviado un correo con la nueva contraseña' })
    }
    return res.status(404).json({ msg: 'No existe una cuenta asociada a ese correo' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Error al recuperar contraseña' })
  }
}
