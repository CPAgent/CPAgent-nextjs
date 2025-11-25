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

    const budget = await db.findBudgetByUserId(user.userId)

    // 현재 월 지출 계산
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const transactions = await db.findTransactionsByUserId(user.userId)
    const current = transactions
      .filter(t => t.type === 'EXPENSE' && new Date(t.date) >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0)

    // 예산이 없으면 빈 예산 반환 (404 대신)
    if (!budget) {
      return successResponse({
        totalBudget: 0,
        current,
        remaining: 0,
        percentUsed: 0,
        categories: {},
      })
    }

    return successResponse({
      totalBudget: budget.totalBudget,
      current,
      remaining: budget.totalBudget - current,
      percentUsed: budget.totalBudget > 0 ? Math.round((current / budget.totalBudget) * 100) : 0,
      categories: budget.categoryBudgets,
    })
  } catch (error) {
    console.error('Get budget error:', error)
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
    const { monthly, categories } = body

    const budget = await db.createOrUpdateBudget(user.userId, monthly, categories || {})

    return successResponse({
      monthly: budget.totalBudget,
      categories: budget.categoryBudgets,
    }, '예산이 설정되었습니다.', 201)
  } catch (error) {
    console.error('Set budget error:', error)
    return errorResponse(ErrorCodes.SERVER_001.code, ErrorCodes.SERVER_001.message, ErrorCodes.SERVER_001.status)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return errorResponse(ErrorCodes.AUTH_001.code, ErrorCodes.AUTH_001.message, ErrorCodes.AUTH_001.status)
    }

    const body = await request.json()
    const { monthly, categories } = body

    const budget = await db.createOrUpdateBudget(user.userId, monthly, categories || {})

    return successResponse({
      monthly: budget.totalBudget,
      categories: budget.categoryBudgets,
    }, '예산이 업데이트되었습니다.')
  } catch (error) {
    console.error('Update budget error:', error)
    return errorResponse(ErrorCodes.SERVER_001.code, ErrorCodes.SERVER_001.message, ErrorCodes.SERVER_001.status)
  }
}
