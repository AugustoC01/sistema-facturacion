// Firestore methods
import { createItem, updateItem, getItems, getItemById, getItemsBetweenField } from '../service/db.js'
// Collection name
const collectionName = 'dailyReports'

export const increaseDailyReport = async (sale) => {
  const date = new Date().toLocaleDateString('en-GB')
  const id = date.replace(/\//g, '-')
  let dailyReport = await getItemById(collectionName, id)

  if (!dailyReport) {
    // it gets created if it doesn't exist
    dailyReport = {
      date,
      incomeByPaymentMethod: {},
      totalIncome: 0,
      salesCount: 0
    }
    await createItem(collectionName, { id, ...dailyReport })
  }
  // income update
  const paymentMethod = sale.paymentMethod
  const total = sale.total

  dailyReport.incomeByPaymentMethod[paymentMethod] =
    (dailyReport.incomeByPaymentMethod[paymentMethod] || 0) + total

  dailyReport.totalIncome += total
  dailyReport.salesCount += 1

  await updateItem(collectionName, id, dailyReport)
}

export const decreaseDailyReport = async (sale) => {
  const date = new Date().toLocaleDateString('en-GB')
  const id = date.replace(/\//g, '-')
  const dailyReport = await getItemById(collectionName, id)

  if (!dailyReport) return

  const paymentMethod = sale.paymentMethod
  const total = sale.total

  if (dailyReport.incomeByPaymentMethod[paymentMethod] > 0 && dailyReport.salesCount > 0) {
    dailyReport.incomeByPaymentMethod[paymentMethod] += -total
    dailyReport.totalIncome += -total
    dailyReport.salesCount += -1
  }
  await updateItem(collectionName, id, dailyReport)
}

// gets income between two dates format: dd/mm/yyyy
export const getIncomeByDateRange = async (start, end) => {
  const formattedStart = start.replace(/\//g, '-')
  const formattedEnd = end.replace(/\//g, '-')
  const reports = await getItemsBetweenField(collectionName, 'id', formattedStart, formattedEnd)
  const totalIncome = reports.reduce((acc, report) => acc + report.totalIncome, 0)
  return totalIncome
}

export const getDailyReports = async () => {
  const reports = await getItems(collectionName)
  return reports
}
