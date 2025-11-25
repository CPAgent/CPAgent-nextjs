import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { authenticateRequest } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return errorResponse(ErrorCodes.AUTH_001.code, ErrorCodes.AUTH_001.message, ErrorCodes.AUTH_001.status)
    }

    // 현재 월 계산
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // 이전 월 계산
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const transactions = await db.findTransactionsByUserId(user.userId)
    
    // 현재 월 통계
    const currentMonthTxns = transactions.filter(t => {
      const txnDate = new Date(t.date)
      return txnDate >= startOfMonth && txnDate <= endOfMonth
    })
    const currentTotalExpense = currentMonthTxns.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0)
    const currentTotalIncome = currentMonthTxns.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0)
    const currentCount = currentMonthTxns.length

    // 이전 월 통계
    const prevMonthTxns = transactions.filter(t => {
      const txnDate = new Date(t.date)
      return txnDate >= startOfPrevMonth && txnDate <= endOfPrevMonth
    })
    const prevTotalExpense = prevMonthTxns.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0)
    const prevTotalIncome = prevMonthTxns.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0)
    const prevCount = prevMonthTxns.length

    // 예산 정보
    const budget = await db.findBudgetByUserId(user.userId)

    const daysInMonth = endOfMonth.getDate()
    const daysElapsed = now.getDate()
    const averageDaily = daysElapsed > 0 ? Math.round(currentTotalExpense / daysElapsed) : 0

    return successResponse({
      currentMonth: {
        totalExpense: currentTotalExpense,
        totalIncome: currentTotalIncome,
        transactionCount: currentCount,
        averageDaily,
      },
      previousMonth: {
        totalExpense: prevTotalExpense,
        totalIncome: prevTotalIncome,
        transactionCount: prevCount,
      },
      comparison: {
        expenseChange: prevTotalExpense > 0 
          ? Math.round(((currentTotalExpense - prevTotalExpense) / prevTotalExpense) * 100 * 100) / 100
          : 0,
        incomeChange: prevTotalIncome > 0
          ? Math.round(((currentTotalIncome - prevTotalIncome) / prevTotalIncome) * 100 * 100) / 100
          : 0,
        transactionChange: prevCount > 0
          ? Math.round(((currentCount - prevCount) / prevCount) * 100 * 100) / 100
          : 0,
      },
      budgetStatus: budget ? {
        monthly: budget.totalBudget,
        current: currentTotalExpense,
        remaining: budget.totalBudget - currentTotalExpense,
        percentUsed: Math.round((currentTotalExpense / budget.totalBudget) * 100),
        daysRemaining: daysInMonth - daysElapsed,
        projectedTotal: Math.round((currentTotalExpense / daysElapsed) * daysInMonth),
      } : null,
      quickStats: {
        dailyAverage: averageDaily,
        weeklySpending: 0, // TODO: 주간 지출 계산
        monthlyGrowth: prevTotalExpense > 0 
          ? Math.round(((currentTotalExpense - prevTotalExpense) / prevTotalExpense) * 100 * 100) / 100
          : 0,
        transactionCount: currentCount,
      }
    })
  } catch (error) {
    console.error('Get dashboard error:', error)
    return errorResponse(ErrorCodes.SERVER_001.code, ErrorCodes.SERVER_001.message, ErrorCodes.SERVER_001.status)
  }
}
