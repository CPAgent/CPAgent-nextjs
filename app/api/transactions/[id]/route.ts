import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return errorResponse(ErrorCodes.AUTH_001.code, ErrorCodes.AUTH_001.message, ErrorCodes.AUTH_001.status)
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: params.id,
        userId: user.userId,
      },
    })

    if (!transaction) {
      return errorResponse(ErrorCodes.TXN_001.code, ErrorCodes.TXN_001.message, ErrorCodes.TXN_001.status)
    }

    return successResponse(transaction)
  } catch (error) {
    console.error('Get transaction error:', error)
    return errorResponse(ErrorCodes.SERVER_001.code, ErrorCodes.SERVER_001.message, ErrorCodes.SERVER_001.status)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return errorResponse(ErrorCodes.AUTH_001.code, ErrorCodes.AUTH_001.message, ErrorCodes.AUTH_001.status)
    }

    const body = await request.json()

    const transaction = await prisma.transaction.updateMany({
      where: {
        id: params.id,
        userId: user.userId,
      },
      data: {
        ...body,
        date: body.date ? new Date(body.date) : undefined,
        tags: body.tags ? JSON.stringify(body.tags) : undefined,
      },
    })

    if (transaction.count === 0) {
      return errorResponse(ErrorCodes.TXN_001.code, ErrorCodes.TXN_001.message, ErrorCodes.TXN_001.status)
    }

    const updatedTransaction = await prisma.transaction.findUnique({
      where: { id: params.id },
    })

    return successResponse(updatedTransaction, '거래 내역이 수정되었습니다.')
  } catch (error) {
    console.error('Update transaction error:', error)
    return errorResponse(ErrorCodes.SERVER_001.code, ErrorCodes.SERVER_001.message, ErrorCodes.SERVER_001.status)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return errorResponse(ErrorCodes.AUTH_001.code, ErrorCodes.AUTH_001.message, ErrorCodes.AUTH_001.status)
    }

    const deleted = await prisma.transaction.deleteMany({
      where: {
        id: params.id,
        userId: user.userId,
      },
    })

    if (deleted.count === 0) {
      return errorResponse(ErrorCodes.TXN_001.code, ErrorCodes.TXN_001.message, ErrorCodes.TXN_001.status)
    }

    return successResponse(null, '거래 내역이 삭제되었습니다.')
  } catch (error) {
    console.error('Delete transaction error:', error)
    return errorResponse(ErrorCodes.SERVER_001.code, ErrorCodes.SERVER_001.message, ErrorCodes.SERVER_001.status)
  }
}
