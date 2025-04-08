// firebase functions
import { createItem, updateItem, deleteItem, getItems, getItemById, getItemsByField } from '../service/db.js'
// password functions
import { hashPassword } from '../utils/bcrypt.js'

const collectionName = 'employees'

// Add employee
export const addEmployee = async (newEmployee) => {
  const existentEmployee = await getItemsByField(collectionName, 'email', newEmployee.email)
  if (existentEmployee.length !== 0) {
    throw new Error('Ese correo ya esta registrado')
  }
  const hashedPassword = await hashPassword(newEmployee.password)
  newEmployee.password = hashedPassword
  await createItem(collectionName, newEmployee)
}

// get all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await getItems(collectionName)
    for (const employee of employees) {
      delete employee.password
    }
    return res.status(200).json(employees)
  } catch (e) {
    return res.status(500).json({ msg: 'Error al obtener empleados' })
  }
}

// get employees by id
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params
    const employee = await getItemById(collectionName, id)
    delete employee.password
    return res.status(200).json(employee)
  } catch (e) {
    return res.status(500).json({ msg: 'Error al obtener empleados' })
  }
}

// update employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const { password } = req.body
    const updatedEmployee = { password }

    if (updatedEmployee.password) {
      updatedEmployee.password = await hashPassword(updatedEmployee.password)
    }

    await updateItem(collectionName, id, updatedEmployee)
    return res.status(200).json({ msg: 'Empleado actualizado correctamente!' })
  } catch (e) {
    return res.status(500).json({ msg: 'Error al obtener el empleado' })
  }
}

// delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params
    await deleteItem(collectionName, id)
  } catch (e) {
    return res.status(500).json({ msg: 'Error al eliminar el empleado' })
  }
}
