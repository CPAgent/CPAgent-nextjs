import { NextRequest } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (!user) {
      return errorResponse(
        ErrorCodes.AUTH_001.code,
        ErrorCodes.AUTH_001.message,
        ErrorCodes.AUTH_001.status
      )
    }

    return successResponse({
      userId: user.userId,
      email: user.email,
    }, '토큰이 유효합니다.')
  } catch (error) {
    console.error('Token verification error:', error)
    return errorResponse(
      ErrorCodes.AUTH_001.code,
      '토큰 검증에 실패했습니다.',
      401
    )
  }
}
