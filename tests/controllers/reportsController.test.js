import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies BEFORE importing the module under test
vi.mock('../../src/service/db.js', () => ({
  getItemById: vi.fn(),
  updateItem: vi.fn(),
  createItem: vi.fn(),
  getItems: vi.fn(),
  getItemsBetweenField: vi.fn()
}))

vi.mock('../../src/utils/logger.js', () => ({
  default: { info: vi.fn(), error: vi.fn(), warn: vi.fn() }
}))

import { getItemById, updateItem, createItem } from '../../src/service/db.js'
import { increaseDailyReport, decreaseDailyReport } from '../../src/controllers/reportsController.js'

beforeEach(() => {
  vi.clearAllMocks()
})

// Helper to build a mock sale
const makeSale = (total = 1000, paymentMethod = 'cash') => ({
  total,
  paymentMethod
})

// Helper to build an existing daily report
const makeReport = (overrides = {}) => ({
  date: '08/03/2026',
  totalIncome: 5000,
  totalSales: 3,
  salesCount: { cash: 3 },
  incomeByPaymentMethod: { cash: 5000 },
  ...overrides
})

describe('reportsController — daily report functions', () => {
  describe('increaseDailyReport', () => {
    it('should create a new report if one does not exist for today', async () => {
      getItemById.mockResolvedValue(null)
      createItem.mockResolvedValue(undefined)
      updateItem.mockResolvedValue(undefined)

      await increaseDailyReport(makeSale(1000, 'cash'))

      expect(createItem).toHaveBeenCalledOnce()
      expect(updateItem).toHaveBeenCalledOnce()
    })

    it('should increment totalIncome and totalSales on an existing report', async () => {
      const report = makeReport()
      getItemById.mockResolvedValue(report)
      updateItem.mockResolvedValue(undefined)

      await increaseDailyReport(makeSale(500, 'cash'))

      expect(updateItem).toHaveBeenCalledWith(
        'dailyReports',
        expect.any(String),
        expect.objectContaining({
          totalIncome: 5500,
          totalSales: 4
        })
      )
    })

    it('should initialise a new payment method breakdown if none exists', async () => {
      const report = makeReport()
      getItemById.mockResolvedValue(report)
      updateItem.mockResolvedValue(undefined)

      await increaseDailyReport(makeSale(300, 'card'))

      expect(updateItem).toHaveBeenCalledWith(
        'dailyReports',
        expect.any(String),
        expect.objectContaining({
          incomeByPaymentMethod: expect.objectContaining({ cash: 5000, card: 300 }),
          salesCount: expect.objectContaining({ cash: 3, card: 1 })
        })
      )
    })
  })

  describe('decreaseDailyReport', () => {
    it('should decrement totalIncome and totalSales on an existing report', async () => {
      const report = makeReport()
      getItemById.mockResolvedValue(report)
      updateItem.mockResolvedValue(undefined)

      await decreaseDailyReport(makeSale(500, 'cash'))

      expect(updateItem).toHaveBeenCalledWith(
        'dailyReports',
        expect.any(String),
        expect.objectContaining({
          totalIncome: 4500,
          totalSales: 2
        })
      )
    })

    it('should do nothing if no report exists for today', async () => {
      getItemById.mockResolvedValue(null)

      await decreaseDailyReport(makeSale(500, 'cash'))

      expect(updateItem).not.toHaveBeenCalled()
    })

    it('should not decrement if the payment method income is 0 or missing', async () => {
      const report = makeReport({
        incomeByPaymentMethod: { cash: 0 },
        salesCount: { cash: 0 }
      })
      getItemById.mockResolvedValue(report)
      updateItem.mockResolvedValue(undefined)

      await decreaseDailyReport(makeSale(500, 'cash'))

      // incomeByPaymentMethod[cash] is 0 so the guard prevents decrement
      expect(updateItem).toHaveBeenCalledWith(
        'dailyReports',
        expect.any(String),
        expect.objectContaining({ totalIncome: 5000, totalSales: 3 })
      )
    })
  })
})
