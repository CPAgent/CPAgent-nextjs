// 이미지 압축 및 리사이즈 유틸리티

export interface CompressImageOptions {
  maxSize?: number // 최대 너비/높이 (기본: 1024px)
  quality?: number // JPEG 품질 (0-1, 기본: 0.8)
}

/**
 * 이미지를 압축하고 리사이즈합니다
 */
export async function compressImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<string> {
  const { maxSize = 1024, quality = 0.8 } = options

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // 최대 크기로 리사이즈
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width
          width = maxSize
        } else if (height > maxSize) {
          width = (width * maxSize) / height
          height = maxSize
        }
        
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Canvas context를 생성할 수 없습니다'))
          return
        }
        
        ctx.drawImage(img, 0, 0, width, height)
        
        // JPEG로 변환 및 압축
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(dataUrl)
      }
      
      img.onerror = () => reject(new Error('이미지 로드 실패'))
      img.src = event.target?.result as string
    }
    
    reader.onerror = () => reject(new Error('파일 읽기 실패'))
    reader.readAsDataURL(file)
  })
}

/**
 * 파일 크기 검증
 */
export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  return file.size <= maxSizeMB * 1024 * 1024
}

/**
 * 이미지 파일 타입 검증
 */
export function validateImageType(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Base64에서 data URL 프리픽스 제거
 */
export function stripBase64Prefix(base64: string): string {
  return base64.includes(',') ? base64.split(',')[1] : base64
}
