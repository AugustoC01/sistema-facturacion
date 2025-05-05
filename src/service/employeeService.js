import { getItemsByField, updateItem, createItem } from './db.js'
import { hashPassword } from '../utils/bcrypt.js'

const collectionName = 'employees'

export const getEmployeeByEmail = async (email) => {
  const resulst = await getItemsByField(collectionName, 'email', email)
  return resulst[0] || null
}

export const createEmployee = async (employee) => {
  await createItem(collectionName, employee)
}

export const updateEmployeePassword = async (email, newPassword) => {
  const results = await getItemsByField(collectionName, 'email', email)
  const employee = results[0] || null
  if (!employee) return null
  const hashedPassword = await hashPassword(newPassword)
  employee.password = hashedPassword
  await updateItem(collectionName, employee.id, employee)
  return true
}
