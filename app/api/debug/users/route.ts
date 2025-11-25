import { NextRequest } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  // 개발 환경에서만 사용
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Not available in production' }, { status: 403 })
  }

  // DB의 모든 사용자 목록 반환 (비밀번호 제외)
  const users = await db.getAllUsers()
  return Response.json({
    success: true,
    data: users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      phone: u.phone,
      createdAt: u.createdAt,
      passwordHash: u.password.substring(0, 20) + '...', // 일부만 표시
    })),
  })
}
