// Naver Clova OCR을 사용한 영수증 분석
import OpenAI from 'openai'

interface ReceiptData {
  merchant?: string
  amount?: number
  date?: string
  category?: string
  items?: string[]
  rawText?: string
  correctedText?: string
}

export async function analyzeReceipt(imageBase64: string, apiSecret: string, apiUrl: string): Promise<ReceiptData> {
  if (!apiSecret || !apiUrl) {
    throw new Error('CLOVA_OCR_SECRET and CLOVA_OCR_URL must be set')
  }

  try {
    console.log('Sending request to Clova OCR...')
    
    // Base64 접두사 제거
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '')
    
    // Clova OCR API 요청
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OCR-SECRET': apiSecret,
      },
      body: JSON.stringify({
        version: 'V2',
        requestId: `receipt_${Date.now()}`,
        timestamp: Date.now(),
        images: [
          {
            format: 'jpg',
            name: 'receipt',
            data: cleanBase64,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Clova OCR API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log('Clova OCR response:', JSON.stringify(result, null, 2))

    // OCR 결과에서 텍스트 추출
    const rawText = extractTextFromClovaResponse(result)
    console.log('Extracted raw text:', rawText)

    // AI로 OCR 텍스트 교정 및 영수증 정보 추출
    const receiptData = await parseReceiptWithAI(rawText)
    
    return {
      ...receiptData,
      rawText,
    }
  } catch (error) {
    console.error('Receipt analysis error:', error)
    throw error
  }
}

function extractTextFromClovaResponse(response: any): string {
  if (!response.images || response.images.length === 0) {
    return ''
  }

  const fields = response.images[0].fields || []
  
  // 모든 텍스트를 줄바꿈으로 연결
  return fields
    .map((field: any) => field.inferText)
    .filter((text: string) => text && text.trim())
    .join('\n')
}

// AI를 사용하여 OCR 텍스트 교정 및 영수증 정보 추출
async function parseReceiptWithAI(rawText: string): Promise<ReceiptData> {
  const openaiApiKey = process.env.OPENAI_API_KEY
  
  // OpenAI API 키가 없으면 기존 방식으로 파싱
  if (!openaiApiKey) {
    console.log('OpenAI API key not found, using basic parsing')
    return parseReceiptText(rawText)
  }

  try {
    const openai = new OpenAI({ apiKey: openaiApiKey })
    
    const prompt = `다음은 OCR로 추출한 영수증 텍스트입니다. 텍스트에 오류가 있을 수 있으니 맥락을 고려하여 교정하고, 영수증 정보를 추출해주세요.

OCR 텍스트:
${rawText}

다음 정보를 JSON 형식으로 추출해주세요:
- merchant: 가맹점명 (상호명)
- amount: 총 금액 (숫자만, 쉼표 제거)
- date: 거래 날짜 (YYYY-MM-DD 형식, 없으면 오늘 날짜)
- category: 카테고리 (식비, 교통, 쇼핑, 의료, 문화, 기타 중 하나)
- items: 구매 항목 리스트 (있는 경우)
- correctedText: 교정된 전체 텍스트

JSON만 응답해주세요. 다른 설명은 불필요합니다.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 영수증 OCR 텍스트를 교정하고 정보를 추출하는 전문가입니다. 항상 유효한 JSON만 응답합니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 1000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    // JSON 파싱
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.log('AI response is not valid JSON, using basic parsing')
      return parseReceiptText(rawText)
    }

    const result = JSON.parse(jsonMatch[0])
    console.log('AI parsed receipt:', result)

    return {
      merchant: result.merchant || undefined,
      amount: typeof result.amount === 'number' ? result.amount : parseFloat(String(result.amount).replace(/,/g, '')),
      date: result.date || new Date().toISOString().split('T')[0],
      category: result.category || '기타',
      items: result.items || [],
      correctedText: result.correctedText || rawText,
    }
  } catch (error) {
    console.error('AI parsing error:', error)
    // AI 파싱 실패 시 기존 방식으로 폴백
    return parseReceiptText(rawText)
  }
}

function parseReceiptText(text: string): ReceiptData {
  // 이스케이프된 개행 문자를 실제 개행으로 변환
  const normalizedText = text.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
  console.log('Parsing receipt text with basic method:', normalizedText.substring(0, 200))
  
  const result: ReceiptData = {}
  
  // 금액 추출 (예: 12,000원, $12.50, 12000)
  const amountPatterns = [
    /(?:합계|총액|금액|승인금액|결제금액|total|amount)[:\s]*([0-9,]+)(?:원|\$|USD|KRW)?/i,
    /([0-9,]+)\s*원/,
    /\$\s*([0-9,]+\.?[0-9]*)/,
    /(?:^|\n)([0-9]{3,}(?:,[0-9]{3})*)\s*(?:\n|$)/m, // 줄 단위로 큰 숫자 찾기
  ]
  
  for (const pattern of amountPatterns) {
    const match = normalizedText.match(pattern)
    if (match) {
      const extractedAmount = parseFloat(match[1].replace(/,/g, ''))
      // 금액이 너무 작거나(100 미만) 너무 크면(10억 이상) 무시
      if (extractedAmount >= 100 && extractedAmount <= 1000000000) {
        result.amount = extractedAmount
        console.log('Found amount:', result.amount, 'from pattern:', pattern)
        break
      }
    }
  }
  
  // 금액을 찾지 못하면 0으로 설정
  if (!result.amount) {
    result.amount = 0
    console.log('Amount not found, set to 0')
  }
  
  // 날짜 추출 (예: 2024-01-15, 2024.01.15, 01/15/2024)
  const datePatterns = [
    /(\d{4}[-/.]\d{2}[-/.]\d{2})/,
    /(\d{2}[-/.]\d{2}[-/.]\d{4})/,
    /(\d{4}년\s*\d{1,2}월\s*\d{1,2}일)/,
  ]
  
  for (const pattern of datePatterns) {
    const match = normalizedText.match(pattern)
    if (match) {
      result.date = match[1]
      console.log('Found date:', result.date)
      break
    }
  }
  
  // 날짜를 찾지 못하면 오늘 날짜로 설정
  if (!result.date) {
    result.date = new Date().toISOString().split('T')[0]
  }
  
  // 가맹점명 추출 (보통 영수증 상단에 있음)
  const lines = normalizedText.split('\n').filter(line => line.trim())
  if (lines.length > 0) {
    // 첫 몇 줄 중에서 가장 긴 것을 가맹점명으로 추정
    const topLines = lines.slice(0, 3)
    result.merchant = topLines.reduce((a, b) => a.length > b.length ? a : b).trim()
    console.log('Found merchant:', result.merchant)
  }
  
  // 가맹점명을 찾지 못하면 기본값 설정
  if (!result.merchant) {
    result.merchant = '알 수 없는 가맹점'
  }
  
  // 품목 추출 (금액 앞에 있는 항목들)
  result.items = extractItems(normalizedText)
  console.log('Extracted items:', result.items)
  
  // 카테고리 자동 추론 (품목 기반 + 키워드 기반)
  result.category = categorizeByContent(normalizedText, result.items, result.merchant)
  console.log('Determined category:', result.category)
  
  // 원본 텍스트도 저장
  result.rawText = normalizedText
  
  console.log('Final parsed result:', result)
  return result
}

// 품목 추출 함수
function extractItems(text: string): string[] {
  const items: string[] = []
  const lines = text.split('\n')
  
  // 품목은 보통 "품명", "메뉴", "상품명" 등의 헤더 다음에 나옴
  let inItemSection = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // 품목 섹션 시작 감지
    if (/품명|메뉴|상품명|품목|item|menu/i.test(line)) {
      inItemSection = true
      continue
    }
    
    // 품목 섹션 종료 감지
    if (/합계|총액|결제|승인|카드|현금|total|payment/i.test(line)) {
      inItemSection = false
      continue
    }
    
    // 품목 라인 추출 (숫자와 함께 있는 항목)
    if (inItemSection && line.length > 0) {
      // 금액 패턴이 있는 라인에서 품목명만 추출
      const itemMatch = line.match(/^([가-힣a-zA-Z\s()]+)/)
      if (itemMatch) {
        const itemName = itemMatch[1].trim()
        if (itemName.length > 1 && !items.includes(itemName)) {
          items.push(itemName)
        }
      }
    }
  }
  
  return items.slice(0, 20) // 최대 20개까지만
}

// 품목과 가맹점명을 기반으로 카테고리 분류
function categorizeByContent(text: string, items: string[], merchant: string): string {
  const lowerText = text.toLowerCase()
  const allContent = `${merchant} ${items.join(' ')} ${text}`.toLowerCase()
  
  // 품목 기반 카테고리 키워드 (더 상세하게)
  const itemCategories: Record<string, string[]> = {
    '식비': [
      // 음식 메뉴
      '파스타', '피자', '스테이크', '치킨', '햄버거', '샌드위치', '샐러드',
      '짜장면', '짬뽕', '탕수육', '볶음밥', '비빔밥', '김밥', '라면', '우동',
      '돈까스', '카레', '덮밥', '초밥', '회', '구이', '찌개', '국', '탕',
      '떡볶이', '순대', '튀김', '만두', '족발', '보쌈', '삼겹살', '갈비',
      // 음료 및 디저트
      '커피', '아메리카노', '라떼', '카푸치노', '에스프레소', '음료',
      '주스', '스무디', '차', '티', '케이크', '빵', '디저트', '아이스크림',
      // 주류
      '소주', '맥주', '와인', '양주', '막걸리', '참이슬', '처음처럼', '카스', '하이트',
      // 식재료
      '야채', '과일', '고기', '생선', '쌀', '공기밥', '밥',
      // 식당 관련
      '식당', '카페', '레스토랑', '음식점', 'restaurant', 'cafe', 'coffee', 'food'
    ],
    '교통': [
      '택시', '버스', '지하철', '기차', '고속버스', '주차', '통행료', '주유',
      '휘발유', '경유', '충전', '카카오택시', 'taxi', 'bus', 'subway', 'train'
    ],
    '쇼핑': [
      // 생활용품
      '샴푸', '린스', '비누', '치약', '칫솔', '세제', '휴지', '화장지',
      '물티슈', '기저귀', '생리대', '수건', '마스크',
      // 의류
      '옷', '티셔츠', '바지', '신발', '가방', '모자', '양말', '속옷',
      // 전자제품
      '핸드폰', '이어폰', '충전기', '케이블', '마우스', '키보드',
      // 매장
      '마트', '편의점', '백화점', '아울렛', '쿠팡', 'GS25', 'CU', '세븐일레븐',
      'mart', 'store', 'shop', 'market'
    ],
    '의료': [
      '병원', '의원', '한의원', '치과', '약국', '약', '진료', '검사',
      '처방', '치료', 'hospital', 'clinic', 'pharmacy', 'medicine'
    ],
    '문화/여가': [
      '영화', '관람', '티켓', '입장', '공연', '콘서트', '전시', '박물관',
      '도서', '책', '서점', '노래방', 'CGV', '롯데시네마', '메가박스',
      'movie', 'cinema', 'book', 'concert'
    ],
    '미용': [
      '미용실', '헤어샵', '네일', '피부과', '에스테틱', '마사지',
      '헤어', '컷', '펌', '염색', 'salon', 'beauty'
    ],
    '통신': [
      '통신비', '요금', '인터넷', '휴대폰', 'SK', 'KT', 'LG', 'U+',
      'SKT', 'LGU+', 'telecom', 'mobile'
    ],
    '교육': [
      '학원', '교육', '수강', '교재', '학습', '과외', '강의',
      'academy', 'education', 'class', 'course'
    ]
  }
  
  // 품목 기반으로 먼저 체크
  let maxScore = 0
  let bestCategory = '기타'
  
  for (const [category, keywords] of Object.entries(itemCategories)) {
    let score = 0
    
    // 품목에서 키워드 매칭 (가중치 높음)
    for (const item of items) {
      const lowerItem = item.toLowerCase()
      for (const keyword of keywords) {
        if (lowerItem.includes(keyword.toLowerCase())) {
          score += 3
        }
      }
    }
    
    // 전체 텍스트에서 키워드 매칭 (가중치 낮음)
    for (const keyword of keywords) {
      if (allContent.includes(keyword.toLowerCase())) {
        score += 1
      }
    }
    
    if (score > maxScore) {
      maxScore = score
      bestCategory = category
    }
  }
  
  console.log('Category scores:', { bestCategory, maxScore })
  
  return bestCategory
}

// 이미지 파일을 Base64로 변환하는 헬퍼 함수
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
