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

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const now = new Date()
    const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1)
    const end = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const transactions = await db.findTransactionsByUserId(user.userId)
    const filtered = transactions.filter(t => {
      const txnDate = new Date(t.date)
      return t.type === 'EXPENSE' && 
        txnDate >= start && 
        txnDate <= end
    })

    const categoryMap = new Map<string, { amount: number; count: number }>()
    let totalExpense = 0

    filtered.forEach((txn) => {
      const existing = categoryMap.get(txn.category) || { amount: 0, count: 0 }
      categoryMap.set(txn.category, {
        amount: existing.amount + txn.amount,
        count: existing.count + 1,
      })
      totalExpense += txn.amount
    })

    const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      amount: data.amount,
      percentage: totalExpense > 0 ? Math.round((data.amount / totalExpense) * 100 * 100) / 100 : 0,
      transactionCount: data.count,
      averagePerTransaction: Math.round(data.amount / data.count),
    }))

    categories.sort((a, b) => b.amount - a.amount)

    return successResponse({
      categories,
      totalExpense,
      period: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      },
    })
  } catch (error) {
    console.error('Get categories error:', error)
    return errorResponse(ErrorCodes.SERVER_001.code, ErrorCodes.SERVER_001.message, ErrorCodes.SERVER_001.status)
  }
}
