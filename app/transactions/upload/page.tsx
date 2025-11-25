'use client'

import { useRouter } from 'next/navigation'
import ReceiptUpload from '@/components/ReceiptUpload'

export default function ReceiptUploadPage() {
  const router = useRouter()

  const handleSuccess = (result: any) => {
    console.log('영수증 분석 완료:', result)
  }

  const handleError = (error: string) => {
    console.error('영수증 분석 오류:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">영수증 업로드</h1>
            <p className="text-gray-600 mt-2">영수증 사진을 업로드하면 AI가 자동으로 분석합니다</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            메인으로
          </button>
        </div>

        <ReceiptUpload 
          onSuccess={handleSuccess}
          onError={handleError}
          showCreateButton={true}
        />
      </div>
    </div>
  )
}
