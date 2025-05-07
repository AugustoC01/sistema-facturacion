import {
  getItemsByField,
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from './db.js'
import { hashPassword } from '../utils/bcrypt.js'

const collectionName = 'employees'

export const getEmployeeByEmail = async (email) => {
  const results = await getItemsByField(collectionName, 'email', email)
  return results[0] || null
}

export const addEmployee = async (employee) => {
  const existentEmployee = await getEmployeeByEmail(employee.email)
  if (existentEmployee) throw new Error('Ese correo ya esta registrado')
  const hashedPassword = await hashPassword(employee.password)
  const newEmployee = { ...employee, password: hashedPassword }
  await createItem(collectionName, newEmployee)
}

export const updateEmployeePassword = async (email, newPassword) => {
  const employee = await getEmployeeByEmail(email)
  if (!employee) return null
  const hashedPassword = await hashPassword(newPassword)
  employee.password = hashedPassword
  await updateItem(collectionName, employee.id, employee)
  return true
}

export const updateEmployee = async (id, employee) => {
  const existentEmployee = await getItemById(collectionName, id)
  if (!existentEmployee) return null
  if (employee.password) {
    const hashedPassword = await hashPassword(employee.password)
    employee.password = hashedPassword
  }
  await updateItem(collectionName, employee.id, employee)
  return true
}

export const getAllEmployees = async () => {
  const employees = await getItems(collectionName)
  return employees.map(({ password, ...emp }) => emp)
}

export const getEmployeeDataById = async (id) => {
  const employee = await getItemById(collectionName, id)
  const { password, ...employeeData } = employee
  return employeeData
}

export const removeEmployee = async (id) => {
  const employee = await getItemById(collectionName, id)
  if (!employee) return null
  await deleteItem(collectionName, id)
  return true
}
