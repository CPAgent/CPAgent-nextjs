import { NextRequest } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { db } from '@/lib/db'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

// 영수증 목록 조회
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return errorResponse(ErrorCodes.AUTH_001.code, ErrorCodes.AUTH_001.message, ErrorCodes.AUTH_001.status)
    }

    const receipts = await db.findReceiptsByUserId(user.userId)

    return successResponse({
      receipts,
      count: receipts.length,
    })
  } catch (error) {
    console.error('Get receipts error:', error)
    return errorResponse(ErrorCodes.SERVER_001.code, ErrorCodes.SERVER_001.message, ErrorCodes.SERVER_001.status)
  }
}
