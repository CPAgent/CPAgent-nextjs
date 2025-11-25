'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import { compressImage, validateFileSize, stripBase64Prefix } from '@/lib/image-utils'

interface ReceiptAnalysisResult {
  merchant?: string
  amount?: number
  date?: string
  category?: string
  rawText?: string
  correctedText?: string
  items?: string[]
  receiptId?: string
  suggestedTransaction?: {
    description: string
    amount: number
    date: string
    category: string
  }
}

interface ReceiptUploadProps {
  onSuccess?: (result: ReceiptAnalysisResult) => void
  onError?: (error: string) => void
  showCreateButton?: boolean
  compact?: boolean
}

export default function ReceiptUpload({ 
  onSuccess, 
  onError,
  showCreateButton = true,
  compact = false 
}: ReceiptUploadProps) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReceiptAnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // 파일 크기 검증
    if (!validateFileSize(selectedFile, 5)) {
      const errorMsg = '이미지 크기는 5MB 이하여야 합니다.'
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    setFile(selectedFile)
    setError('')
    setResult(null)

    try {
      // 이미지 압축 (더 강하게 - 속도 개선)
      const compressed = await compressImage(selectedFile, {
        maxSize: 800,
        quality: 0.7,
      })
      setPreview(compressed)
    } catch (err) {
      const errorMsg = '이미지 처리 중 오류가 발생했습니다.'
      setError(errorMsg)
      onError?.(errorMsg)
    }
  }

  const handleAnalyze = async () => {
    if (!preview) {
      setError('이미지를 선택해주세요.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const base64Image = stripBase64Prefix(preview)

      const response = await fetch('/api/receipts/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ image: base64Image }),
      })

      const data = await response.json()

      console.log('Receipt analysis response:', data)

      if (!data.success) {
        throw new Error(data.error?.message || '분석 실패')
      }

      console.log('Receipt data:', data.data)
      setResult(data.data)
      onSuccess?.(data.data)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '영수증 분석 중 오류가 발생했습니다.'
      setError(errorMsg)
      onError?.(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTransaction = async () => {
    if (!result?.suggestedTransaction) return

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          merchant: result.suggestedTransaction.description,
          amount: result.suggestedTransaction.amount,
          date: result.suggestedTransaction.date,
          category: result.suggestedTransaction.category,
          type: 'EXPENSE',
          paymentMethod: '카드',
          memo: '영수증 업로드로 생성됨',
          receiptId: result.receiptId, // 영수증 ID 연결
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('거래 내역이 생성되었습니다!')
        // 초기화 및 성공 콜백 호출
        setFile(null)
        setPreview('')
        setResult(null)
        // onSuccess에 거래 생성 성공 신호 전달
        onSuccess?.({ ...result, transactionCreated: true } as any)
        // 대시보드로 이동
        router.push('/dashboard')
      } else {
        throw new Error(data.error?.message || '거래 생성 실패')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '거래 생성 중 오류가 발생했습니다.'
      setError(errorMsg)
      onError?.(errorMsg)
    }
  }

  if (compact) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="receipt-compact">영수증 이미지</Label>
          <Input
            id="receipt-compact"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2"
          />
        </div>

        {preview && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <img
              src={preview}
              alt="영수증 미리보기"
              className="w-full h-48 object-contain rounded cursor-pointer hover:opacity-80"
              onClick={() => setShowImageModal(true)}
            />
          </div>
        )}

        <Button
          type="button"
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="w-full"
        >
          {loading ? '분석 중...' : '영수증 분석하기'}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded space-y-3">
            <p className="font-semibold text-green-700 text-lg">✅ 분석 완료!</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">가맹점:</span>
                <span className="font-semibold">{result.merchant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">금액:</span>
                <span className="font-semibold text-blue-600">{result.amount?.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">날짜:</span>
                <span className="font-semibold">{result.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">카테고리:</span>
                <span className="font-semibold">{result.category}</span>
              </div>
            </div>
            
            {result.items && result.items.length > 0 && (
              <details className="text-sm">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                  구매 항목 ({result.items.length}개)
                </summary>
                <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                  {result.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </details>
            )}
            
            {result.rawText && (
              <details className="text-sm">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                  원본 텍스트 보기
                </summary>
                <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-32">
                  {result.rawText}
                </pre>
              </details>
            )}
            
            {showCreateButton && (
              <Button type="button" onClick={handleCreateTransaction} className="w-full mt-2" size="sm">
                거래 생성하기
              </Button>
            )}
          </div>
        )}

        {/* 이미지 확대 모달 */}
        {showImageModal && preview && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <div className="relative max-w-4xl max-h-screen">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl font-bold"
              >
                ✕ 닫기
              </button>
              <img
                src={preview}
                alt="영수증 확대"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  // 전체 UI (기존 upload 페이지용)
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* 업로드 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>1. 영수증 선택</CardTitle>
          <CardDescription>이미지 파일을 선택해주세요 (JPG, PNG)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="receipt">영수증 이미지</Label>
            <Input
              id="receipt"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2"
            />
          </div>

          {preview && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-medium mb-2">미리보기</p>
              <img
                src={preview}
                alt="영수증 미리보기"
                className="w-full h-64 object-contain rounded cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setShowImageModal(true)}
                title="클릭하여 확대"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">클릭하면 확대됩니다</p>
            </div>
          )}

          <Button
            type="button"
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? '분석 중...' : '영수증 분석하기'}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 결과 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>2. 분석 결과</CardTitle>
          <CardDescription>추출된 정보를 확인하고 거래를 생성하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result ? (
            <>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">가맹점</p>
                  <p className="text-lg font-semibold">{result.merchant || '알 수 없음'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">금액</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {result.amount?.toLocaleString()}원
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">날짜</p>
                  <p className="text-lg font-semibold">{result.date || '오늘'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">카테고리</p>
                  <p className="text-lg font-semibold">{result.category}</p>
                </div>
              </div>

              {result.items && result.items.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">구매 항목</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {result.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.correctedText && (
                <details className="mt-4">
                  <summary className="text-sm text-gray-600 cursor-pointer">
                    AI 교정된 텍스트 보기
                  </summary>
                  <pre className="mt-2 p-3 bg-blue-50 rounded text-xs overflow-auto max-h-40">
                    {result.correctedText}
                  </pre>
                </details>
              )}

              {result.rawText && (
                <details className="mt-4">
                  <summary className="text-sm text-gray-600 cursor-pointer">
                    원본 OCR 텍스트 보기
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto max-h-40">
                    {result.rawText}
                  </pre>
                </details>
              )}

              {showCreateButton && (
                <Button type="button" onClick={handleCreateTransaction} className="w-full mt-4">
                  거래 내역 생성하기
                </Button>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Upload className="w-16 h-16 mx-auto mb-4" />
              <p>영수증을 업로드하고 분석해보세요</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 이미지 확대 모달 */}
      {showImageModal && preview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-screen">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl font-bold"
            >
              ✕ 닫기
            </button>
            <img
              src={preview}
              alt="영수증 확대"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
