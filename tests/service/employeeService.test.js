import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock db.js and bcrypt BEFORE importing the module under test
vi.mock('../../src/service/db.js', () => ({
  getItemsByField: vi.fn(),
  createItem: vi.fn(),
  updateItem: vi.fn(),
  getItems: vi.fn(),
  getItemById: vi.fn(),
  deleteItem: vi.fn()
}))

vi.mock('../../src/utils/bcrypt.js', () => ({
  hashPassword: vi.fn()
}))

import { getItemsByField, createItem, updateItem, getItemById, deleteItem } from '../../src/service/db.js'
import { hashPassword } from '../../src/utils/bcrypt.js'
import {
  getEmployeeByEmail,
  addEmployee,
  updateEmployeePassword,
  removeEmployee
} from '../../src/service/employeeService.js'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('employeeService', () => {
  describe('addEmployee', () => {
    it('should hash the password and create a new employee', async () => {
      getItemsByField.mockResolvedValue([]) // no existing employee
      hashPassword.mockResolvedValue('hashed_password')
      createItem.mockResolvedValue(undefined)

      const employee = { name: 'Juan', email: 'juan@test.com', password: 'plain123' }
      await addEmployee(employee)

      expect(hashPassword).toHaveBeenCalledWith('plain123')
      expect(createItem).toHaveBeenCalledWith(
        'employees',
        expect.objectContaining({ password: 'hashed_password', email: 'juan@test.com' })
      )
    })

    it('should throw if an employee with that email already exists', async () => {
      getItemsByField.mockResolvedValue([{ id: '1', email: 'juan@test.com' }])

      await expect(
        addEmployee({ name: 'Juan', email: 'juan@test.com', password: 'plain123' })
      ).rejects.toThrow('Ese correo ya esta registrado')

      expect(createItem).not.toHaveBeenCalled()
    })
  })

  describe('updateEmployeePassword', () => {
    it('should hash the new password and update the employee', async () => {
      const mockEmployee = { id: 'emp1', email: 'juan@test.com', password: 'old_hash' }
      getItemsByField.mockResolvedValue([mockEmployee])
      hashPassword.mockResolvedValue('new_hash')
      updateItem.mockResolvedValue(undefined)

      const result = await updateEmployeePassword('juan@test.com', 'newpassword')

      expect(hashPassword).toHaveBeenCalledWith('newpassword')
      expect(updateItem).toHaveBeenCalledWith(
        'employees',
        'emp1',
        expect.objectContaining({ password: 'new_hash' })
      )
      expect(result).toBe(true)
    })

    it('should return null if the employee does not exist', async () => {
      getItemsByField.mockResolvedValue([])

      const result = await updateEmployeePassword('ghost@test.com', 'newpassword')

      expect(result).toBeNull()
      expect(updateItem).not.toHaveBeenCalled()
    })
  })

  describe('removeEmployee', () => {
    it('should delete the employee and return true', async () => {
      getItemById.mockResolvedValue({ id: 'emp1', name: 'Juan' })
      deleteItem.mockResolvedValue(undefined)

      const result = await removeEmployee('emp1')

      expect(deleteItem).toHaveBeenCalledWith('employees', 'emp1')
      expect(result).toBe(true)
    })

    it('should return null if the employee does not exist', async () => {
      getItemById.mockResolvedValue(null)

      const result = await removeEmployee('nonexistent')

      expect(result).toBeNull()
      expect(deleteItem).not.toHaveBeenCalled()
    })
  })
})
