// firebase functions
import { getAllEmployees, getEmployeeDataById, removeEmployee } from '../service/employeeService.js'
// password functions

const collectionName = 'employees'

// get all employees
export const getEmployees = async (_req, res) => {
  try {
    const employees = await getAllEmployees()
    return res.status(200).json(employees)
  } catch (e) {
    return res.status(500).json({ msg: 'Error al obtener empleados' })
  }
}

// get employees by id
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params
    const employee = await getEmployeeDataById(id)
    if (!employee) return res.status(404).json({ msg: 'Empleado no encontrado' })
    return res.status(200).json(employee)
  } catch (e) {
    return res.status(500).json({ msg: 'Error al obtener empleados' })
  }
}

// update employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const { data } = req.body

    await updateEmployee(id, data)
    return res.status(200).json({ msg: 'Empleado actualizado correctamente!' })
  } catch (e) {
    return res.status(500).json({ msg: 'Error al actualizar el empleado' })
  }
}

// delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await removeEmployee(collectionName, id)
    if (!deleted) return res.status(404).json({ msg: 'Empleado no encontrado' })
    return res.status(200).json({ msg: 'Empleado actualizado correctamente!' })
  } catch (e) {
    return res.status(500).json({ msg: 'Error al eliminar el empleado' })
  }
}
