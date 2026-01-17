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
      salesCount: {},
      totalSales: 0
    }
    await createItem(collectionName, { id, ...dailyReport })
  }
  // income update
  const paymentMethod = sale.paymentMethod
  const total = sale.total

  if (!dailyReport.salesCount[paymentMethod]) {
    dailyReport.salesCount[paymentMethod] = 0
  }

  if (!dailyReport.incomeByPaymentMethod[paymentMethod]) {
    dailyReport.incomeByPaymentMethod[paymentMethod] = 0
  }

  dailyReport.incomeByPaymentMethod[paymentMethod] += total
  dailyReport.salesCount[paymentMethod] += 1
  dailyReport.totalIncome += total
  dailyReport.totalSales += 1

  await updateItem(collectionName, id, dailyReport)
}

export const decreaseDailyReport = async (sale) => {
  const date = new Date().toLocaleDateString('en-GB')
  const id = date.replace(/\//g, '-')
  const dailyReport = await getItemById(collectionName, id)

  if (!dailyReport) return

  const paymentMethod = sale.paymentMethod
  const total = sale.total

  if (dailyReport.incomeByPaymentMethod[paymentMethod] > 0) {
    dailyReport.incomeByPaymentMethod[paymentMethod] += -total
    dailyReport.salesCount[paymentMethod] += -1
    dailyReport.totalIncome += -total
    dailyReport.totalSales += -1
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

// gets a revenue report for a time range
export const getDaysReport = async (req, res) => {
  try {
    const { begin, end } = req.params
    const salesIncome = await getIncomeByDateRange(begin, end)
    return res.status(200).json(salesIncome)
  } catch (e) {
    const error = new Error('Error, no se encontraron las ventas')
    return res.status(404).json({ msg: error.message })
  }
}

export const getReports = async (req, res) => {
  try {
    const reports = await getItems(collectionName)
    return res.status(200).json(reports)
  } catch (error) {
    console.log(error)
    return res.status(404).json({ msg: error.message })
  }
}
