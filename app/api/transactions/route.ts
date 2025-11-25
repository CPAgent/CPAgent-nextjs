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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Get all transactions for user
    let transactions = await db.findTransactionsByUserId(user.userId)

    // Apply filters
    if (category) {
      transactions = transactions.filter(t => t.category === category)
    }
    if (startDate) {
      transactions = transactions.filter(t => new Date(t.date) >= startDate)
    }
    if (endDate) {
      transactions = transactions.filter(t => new Date(t.date) <= endDate)
    }
    if (search) {
      transactions = transactions.filter(t =>
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        (t.memo && t.memo.toLowerCase().includes(search.toLowerCase()))
      )
    }

    // Sort (최신순)
    transactions.sort((a, b) => {
      const comparison = new Date(b.date).getTime() - new Date(a.date).getTime()
      return sortOrder === 'asc' ? -comparison : comparison
    })

    const totalCount = transactions.length
    const paginatedTransactions = transactions.slice(skip, skip + limit)

    // Calculate summaries
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0)
    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0)

    return successResponse({
      transactions: paginatedTransactions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
      },
      summary: {
        totalExpense,
        totalIncome,
        transactionCount: totalCount,
      },
    })
  } catch (error) {
    console.error('Get transactions error:', error)
    return errorResponse(ErrorCodes.SERVER_001.code, ErrorCodes.SERVER_001.message, ErrorCodes.SERVER_001.status)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return errorResponse(ErrorCodes.AUTH_001.code, ErrorCodes.AUTH_001.message, ErrorCodes.AUTH_001.status)
    }

    const body = await request.json()
    const { date, merchant, category, amount, type, paymentMethod, memo, receiptId } = body

    const transaction = await db.createTransaction({
      userId: user.userId,
      date: date,
      description: merchant || category,
      category,
      amount,
      type: type?.toUpperCase() || 'EXPENSE',
      paymentMethod,
      memo,
      receiptId,
    })

    // 영수증이 있으면 거래 ID로 업데이트
    if (receiptId) {
      await db.updateReceipt(receiptId, {
        transactionId: transaction.id,
      })
    }

    return successResponse(transaction, '거래 내역이 추가되었습니다.', 201)
  } catch (error) {
    console.error('Create transaction error:', error)
    return errorResponse(ErrorCodes.SERVER_001.code, ErrorCodes.SERVER_001.message, ErrorCodes.SERVER_001.status)
  }
}
