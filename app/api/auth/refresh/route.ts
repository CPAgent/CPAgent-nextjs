import { NextRequest } from 'next/server'
import { verifyRefreshToken, generateToken, generateRefreshToken } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    const payload = verifyRefreshToken(refreshToken)

    if (!payload) {
      return errorResponse(ErrorCodes.AUTH_002.code, ErrorCodes.AUTH_002.message, ErrorCodes.AUTH_002.status)
    }

    const newToken = generateToken({ userId: payload.userId, email: payload.email })
    const newRefreshToken = generateRefreshToken({ userId: payload.userId, email: payload.email })

    return successResponse({
      token: newToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    return errorResponse(ErrorCodes.SERVER_001.code, ErrorCodes.SERVER_001.message, ErrorCodes.SERVER_001.status)
  }
}
