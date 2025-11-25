import { NextRequest } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { analyzeReceipt } from '@/lib/ocr'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return errorResponse(ErrorCodes.AUTH_001.code, ErrorCodes.AUTH_001.message, ErrorCodes.AUTH_001.status)
    }

    console.log('Clova OCR keys:', {
      hasSecret: !!process.env.CLOVA_OCR_SECRET,
      hasUrl: !!process.env.CLOVA_OCR_URL
    })
    
    const apiSecret = process.env.CLOVA_OCR_SECRET
    const apiUrl = process.env.CLOVA_OCR_URL
    
    if (!apiSecret || !apiUrl) {
      console.error('CLOVA_OCR_SECRET or CLOVA_OCR_URL not found in environment variables')
      return errorResponse('CONFIG_001', 'Clova OCR API 설정이 없습니다.', 500)
    }

    const body = await request.json()
    const { image } = body

    if (!image) {
      return errorResponse('RECEIPT_001', '이미지가 제공되지 않았습니다.', 400)
    }

    // Base64 이미지에서 접두사 제거
    const base64Image = image.includes(',') ? image.split(',')[1] : image

    console.log('Analyzing receipt for user:', user.userId)
    console.log('Image size (base64):', base64Image.length, 'characters')
    
    // Clova OCR로 영수증 분석
    const receiptData = await analyzeReceipt(base64Image, apiSecret, apiUrl)

    console.log('Receipt analysis result:', JSON.stringify(receiptData, null, 2))

    // 영수증 이미지를 DB에 저장
    const receipt = await db.createReceipt({
      userId: user.userId,
      url: `data:image/jpeg;base64,${base64Image}`,
      ocrData: JSON.stringify(receiptData),
    })

    return successResponse({
      ...receiptData,
      receiptId: receipt.id,
      // 추천 거래 정보
      suggestedTransaction: {
        description: receiptData.merchant || '알 수 없는 가맹점',
        amount: receiptData.amount || 0,
        date: receiptData.date || new Date().toISOString(),
        category: receiptData.category || '기타',
      },
    }, '영수증 분석이 완료되었습니다.')
  } catch (error) {
    console.error('Receipt analysis error:', error)
    return errorResponse(
      'RECEIPT_002',
      error instanceof Error ? error.message : '영수증 분석 중 오류가 발생했습니다.',
      500
    )
  }
}
