import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, generateToken, generateRefreshToken } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone } = body

    // 이메일 중복 체크
    const existingUser = await db.findUserByEmail(email)

    if (existingUser) {
      return errorResponse(ErrorCodes.USER_002.code, ErrorCodes.USER_002.message, ErrorCodes.USER_002.status)
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password)
    console.log('Signup - Original password:', password)
    console.log('Signup - Hashed password:', hashedPassword)

    // 사용자 생성
    const user = await db.createUser({
      email,
      password: hashedPassword,
      name,
      phone,
    })
    console.log('Signup - User created:', user.email, user.id)

    // 토큰 생성
    const token = generateToken({ userId: user.id, email: user.email })
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email })

    return successResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
        token,
        refreshToken,
      },
      '회원가입이 완료되었습니다.',
      201
    )
  } catch (error) {
    console.error('Signup error:', error)
    return errorResponse(ErrorCodes.SERVER_001.code, ErrorCodes.SERVER_001.message, ErrorCodes.SERVER_001.status)
  }
}