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

    const userData = await db.findUserById(user.userId)

    if (!userData) {
      return errorResponse(ErrorCodes.USER_001.code, ErrorCodes.USER_001.message, ErrorCodes.USER_001.status)
    }

    // 예산 정보 가져오기
    const budget = await db.findBudgetByUserId(user.userId)

    // 현재 월 지출 계산
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const transactions = await db.findTransactionsByUserId(user.userId)
    const currentSpending = transactions
      .filter(t => new Date(t.date) >= startOfMonth && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)

    return successResponse({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      createdAt: userData.createdAt,
      budget: budget
        ? {
            monthly: budget.totalBudget,
            current: currentSpending,
          }
        : null,
    })
  } catch (error) {
    console.error('Get profile error:', error)
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
    const { name, phone } = body

    const updatedUser = await db.updateUser(user.userId, {
      ...(name && { name }),
      ...(phone && { phone }),
    })

    if (!updatedUser) {
      return errorResponse(ErrorCodes.USER_001.code, ErrorCodes.USER_001.message, ErrorCodes.USER_001.status)
    }

    return successResponse({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone,
    }, '프로필이 업데이트되었습니다.')
  } catch (error) {
    console.error('Update profile error:', error)
    return errorResponse(ErrorCodes.SERVER_001.code, ErrorCodes.SERVER_001.message, ErrorCodes.SERVER_001.status)
  }
}
