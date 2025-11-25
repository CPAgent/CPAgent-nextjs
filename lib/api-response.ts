import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  message?: string
}

export function successResponse<T>(data: T, message?: string, status = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    } as ApiResponse<T>,
    { status }
  )
}

export function errorResponse(code: string, message: string, status = 400): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
      },
    } as ApiResponse,
    { status }
  )
}

export const ErrorCodes = {
  // Auth errors
  AUTH_001: { code: 'AUTH_001', message: '인증 토큰이 없습니다', status: 401 },
  AUTH_002: { code: 'AUTH_002', message: '유효하지 않은 토큰입니다', status: 401 },
  AUTH_003: { code: 'AUTH_003', message: '토큰이 만료되었습니다', status: 401 },
  AUTH_004: { code: 'AUTH_004', message: '이메일 또는 비밀번호가 올바르지 않습니다', status: 401 },

  // User errors
  USER_001: { code: 'USER_001', message: '사용자를 찾을 수 없습니다', status: 404 },
  USER_002: { code: 'USER_002', message: '이미 존재하는 이메일입니다', status: 400 },

  // Transaction errors
  TXN_001: { code: 'TXN_001', message: '거래 내역을 찾을 수 없습니다', status: 404 },
  TXN_002: { code: 'TXN_002', message: '잘못된 거래 데이터입니다', status: 400 },

  // Receipt errors
  RECEIPT_001: { code: 'RECEIPT_001', message: '영수증을 찾을 수 없습니다', status: 404 },
  RECEIPT_002: { code: 'RECEIPT_002', message: '지원하지 않는 파일 형식입니다', status: 400 },
  RECEIPT_003: { code: 'RECEIPT_003', message: '파일 크기가 너무 큽니다 (최대 10MB)', status: 400 },

  // Budget errors
  BUDGET_001: { code: 'BUDGET_001', message: '예산 정보를 찾을 수 없습니다', status: 404 },
  BUDGET_002: { code: 'BUDGET_002', message: '잘못된 예산 데이터입니다', status: 400 },

  // Server errors
  SERVER_001: { code: 'SERVER_001', message: '서버 내부 오류가 발생했습니다', status: 500 },
}
