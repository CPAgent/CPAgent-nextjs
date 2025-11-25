import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { comparePassword, generateToken, generateRefreshToken } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // 사용자 찾기
    const user = await db.findUserByEmail(email)
    console.log('Login - Looking for user:', email)
    console.log('Login - User found:', user ? 'Yes' : 'No')

    if (!user) {
      console.log('Login - User not found')
      return errorResponse(ErrorCodes.AUTH_004.code, ErrorCodes.AUTH_004.message, ErrorCodes.AUTH_004.status)
    }

    console.log('Login - Input password:', password)
    console.log('Login - Stored hashed password:', user.password)
    
    // 비밀번호 확인
    const isValidPassword = await comparePassword(password, user.password)
    console.log('Login - Password valid:', isValidPassword)

    if (!isValidPassword) {
      return errorResponse(ErrorCodes.AUTH_004.code, ErrorCodes.AUTH_004.message, ErrorCodes.AUTH_004.status)
    }

    // 토큰 생성
    const token = generateToken({ userId: user.id, email: user.email })
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email })

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
      refreshToken,
    }, '로그인 성공')
  } catch (error) {
    console.error('Login error:', error)
    return errorResponse(ErrorCodes.SERVER_001.code, ErrorCodes.SERVER_001.message, ErrorCodes.SERVER_001.status)
  }
}