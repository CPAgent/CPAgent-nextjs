# API 명세서 (API Specification)

## 목차
1. [인증 API](#인증-api)
2. [사용자 API](#사용자-api)
3. [거래 내역 API](#거래-내역-api)
4. [영수증 API](#영수증-api)
5. [통계 및 리포트 API](#통계-및-리포트-api)
6. [예산 관리 API](#예산-관리-api)

---

## 기본 정보

### Base URL
```
http://localhost:3000/api
```

### 인증 방식
- JWT (JSON Web Token) 기반 인증
- Authorization 헤더에 Bearer 토큰 포함
```
Authorization: Bearer {access_token}
```

### 공통 응답 형식

#### 성공 응답
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

#### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

### HTTP 상태 코드
- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `403`: 권한 없음
- `404`: 리소스 없음
- `500`: 서버 에러

---

## 인증 API

### 1. 회원가입

**Endpoint:** `POST /auth/signup`

**설명:** 새로운 사용자 계정을 생성합니다.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "홍길동",
      "createdAt": "2025-11-20T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "회원가입이 완료되었습니다."
}
```

### 2. 로그인

**Endpoint:** `POST /auth/login`

**설명:** 사용자 로그인 및 JWT 토큰 발급

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "홍길동"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "로그인 성공"
}
```

### 3. 토큰 갱신

**Endpoint:** `POST /auth/refresh`

**설명:** Refresh Token을 사용하여 새로운 Access Token 발급

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. 로그아웃

**Endpoint:** `POST /auth/logout`

**설명:** 사용자 로그아웃 및 토큰 무효화

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "message": "로그아웃되었습니다."
}
```

---

## 사용자 API

### 1. 사용자 정보 조회

**Endpoint:** `GET /user/profile`

**설명:** 현재 로그인한 사용자의 정보를 조회합니다.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "profileImage": "https://example.com/profile.jpg",
    "createdAt": "2025-11-20T10:00:00Z",
    "budget": {
      "monthly": 2000000,
      "current": 1500000
    }
  }
}
```

### 2. 사용자 정보 수정

**Endpoint:** `PUT /user/profile`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "profileImage": "https://example.com/new-profile.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "profileImage": "https://example.com/new-profile.jpg"
  },
  "message": "프로필이 업데이트되었습니다."
}
```

---

## 거래 내역 API

### 1. 거래 내역 목록 조회

**Endpoint:** `GET /transactions`

**설명:** 사용자의 거래 내역을 조회합니다.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)
- `category` (optional): 카테고리 필터 (식비, 교통, 쇼핑, 엔터테인먼트, 기타)
- `startDate` (optional): 시작 날짜 (YYYY-MM-DD)
- `endDate` (optional): 종료 날짜 (YYYY-MM-DD)
- `sortBy` (optional): 정렬 기준 (date, amount) (기본값: date)
- `sortOrder` (optional): 정렬 순서 (asc, desc) (기본값: desc)
- `search` (optional): 검색어 (거래처명, 메모)

**Example Request:**
```
GET /transactions?page=1&limit=20&category=식비&startDate=2025-11-01&endDate=2025-11-30&sortBy=date&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_001",
        "date": "2025-11-20",
        "merchant": "스타벅스 강남점",
        "category": "식비",
        "amount": 4500,
        "type": "expense",
        "paymentMethod": "신용카드",
        "memo": "아이스 아메리카노",
        "receiptUrl": "https://example.com/receipt_001.jpg",
        "createdAt": "2025-11-20T14:30:00Z"
      },
      {
        "id": "txn_002",
        "date": "2025-11-19",
        "merchant": "CU편의점",
        "category": "식비",
        "amount": 8000,
        "type": "expense",
        "paymentMethod": "체크카드",
        "memo": "점심 도시락",
        "receiptUrl": null,
        "createdAt": "2025-11-19T12:15:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    },
    "summary": {
      "totalExpense": 350000,
      "totalIncome": 0,
      "transactionCount": 100
    }
  }
}
```

### 2. 거래 내역 상세 조회

**Endpoint:** `GET /transactions/{id}`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "txn_001",
    "date": "2025-11-20",
    "merchant": "스타벅스 강남점",
    "category": "식비",
    "amount": 4500,
    "type": "expense",
    "paymentMethod": "신용카드",
    "cardLastFour": "1234",
    "memo": "아이스 아메리카노",
    "receiptUrl": "https://example.com/receipt_001.jpg",
    "location": {
      "address": "서울시 강남구 테헤란로",
      "latitude": 37.5665,
      "longitude": 126.9780
    },
    "tags": ["커피", "카페"],
    "createdAt": "2025-11-20T14:30:00Z",
    "updatedAt": "2025-11-20T14:30:00Z"
  }
}
```

### 3. 거래 내역 생성

**Endpoint:** `POST /transactions`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "date": "2025-11-20",
  "merchant": "스타벅스 강남점",
  "category": "식비",
  "amount": 4500,
  "type": "expense",
  "paymentMethod": "신용카드",
  "memo": "아이스 아메리카노",
  "tags": ["커피", "카페"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "txn_001",
    "date": "2025-11-20",
    "merchant": "스타벅스 강남점",
    "category": "식비",
    "amount": 4500,
    "type": "expense",
    "paymentMethod": "신용카드",
    "memo": "아이스 아메리카노",
    "tags": ["커피", "카페"],
    "createdAt": "2025-11-20T14:30:00Z"
  },
  "message": "거래 내역이 추가되었습니다."
}
```

### 4. 거래 내역 수정

**Endpoint:** `PUT /transactions/{id}`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "date": "2025-11-20",
  "merchant": "스타벅스 강남점",
  "category": "식비",
  "amount": 5000,
  "memo": "아이스 아메리카노 벤티",
  "tags": ["커피", "카페", "업무"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "txn_001",
    "date": "2025-11-20",
    "merchant": "스타벅스 강남점",
    "category": "식비",
    "amount": 5000,
    "memo": "아이스 아메리카노 벤티",
    "tags": ["커피", "카페", "업무"],
    "updatedAt": "2025-11-20T15:00:00Z"
  },
  "message": "거래 내역이 수정되었습니다."
}
```

### 5. 거래 내역 삭제

**Endpoint:** `DELETE /transactions/{id}`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "message": "거래 내역이 삭제되었습니다."
}
```

### 6. 거래 내역 일괄 삭제

**Endpoint:** `DELETE /transactions/bulk`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "transactionIds": ["txn_001", "txn_002", "txn_003"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deletedCount": 3
  },
  "message": "3개의 거래 내역이 삭제되었습니다."
}
```

### 7. 거래 내역 내보내기

**Endpoint:** `GET /transactions/export`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `format`: 파일 형식 (csv, json, excel)
- `startDate` (optional): 시작 날짜
- `endDate` (optional): 종료 날짜
- `category` (optional): 카테고리 필터

**Example Request:**
```
GET /transactions/export?format=csv&startDate=2025-11-01&endDate=2025-11-30
```

**Response:**
- Content-Type: `application/csv` or `application/json` or `application/vnd.ms-excel`
- File download

---

## 영수증 API

### 1. 영수증 업로드

**Endpoint:** `POST /receipts/upload`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `file`: 영수증 이미지 파일 (jpg, png, pdf)
- `transactionId` (optional): 연결할 거래 내역 ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "receipt_001",
    "url": "https://example.com/receipts/receipt_001.jpg",
    "transactionId": "txn_001",
    "uploadedAt": "2025-11-20T14:30:00Z",
    "ocrData": {
      "merchant": "스타벅스 강남점",
      "amount": 4500,
      "date": "2025-11-20",
      "items": [
        {
          "name": "아이스 아메리카노",
          "quantity": 1,
          "price": 4500
        }
      ]
    }
  },
  "message": "영수증이 업로드되었습니다."
}
```

### 2. 영수증 OCR 처리

**Endpoint:** `POST /receipts/{id}/ocr`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "merchant": "스타벅스 강남점",
    "amount": 4500,
    "date": "2025-11-20",
    "items": [
      {
        "name": "아이스 아메리카노",
        "quantity": 1,
        "price": 4500
      }
    ],
    "taxAmount": 409,
    "totalAmount": 4500,
    "paymentMethod": "신용카드",
    "cardLastFour": "1234"
  },
  "message": "OCR 처리가 완료되었습니다."
}
```

### 3. 영수증 목록 조회

**Endpoint:** `GET /receipts`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page` (optional): 페이지 번호
- `limit` (optional): 페이지당 항목 수
- `linked` (optional): 거래 내역 연결 여부 (true, false)

**Response:**
```json
{
  "success": true,
  "data": {
    "receipts": [
      {
        "id": "receipt_001",
        "url": "https://example.com/receipts/receipt_001.jpg",
        "transactionId": "txn_001",
        "uploadedAt": "2025-11-20T14:30:00Z",
        "thumbnail": "https://example.com/receipts/thumbs/receipt_001.jpg"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 50,
      "itemsPerPage": 20
    }
  }
}
```

### 4. 영수증 삭제

**Endpoint:** `DELETE /receipts/{id}`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "message": "영수증이 삭제되었습니다."
}
```

---

## 통계 및 리포트 API

### 1. 대시보드 통계

**Endpoint:** `GET /statistics/dashboard`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `period` (optional): 기간 (today, week, month, year) (기본값: month)

**Response:**
```json
{
  "success": true,
  "data": {
    "currentMonth": {
      "totalExpense": 1500000,
      "totalIncome": 3000000,
      "transactionCount": 87,
      "averageDaily": 50000
    },
    "previousMonth": {
      "totalExpense": 1800000,
      "totalIncome": 3000000,
      "transactionCount": 95
    },
    "comparison": {
      "expenseChange": -16.67,
      "incomeChange": 0,
      "transactionChange": -8.42
    },
    "budgetStatus": {
      "monthly": 2000000,
      "current": 1500000,
      "remaining": 500000,
      "percentUsed": 75,
      "daysRemaining": 10,
      "projectedTotal": 1800000
    },
    "quickStats": {
      "dailyAverage": 50000,
      "weeklySpending": 350000,
      "monthlyGrowth": -16.67,
      "transactionCount": 87
    }
  }
}
```

### 2. 카테고리별 통계

**Endpoint:** `GET /statistics/categories`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `startDate` (optional): 시작 날짜
- `endDate` (optional): 종료 날짜
- `period` (optional): 기간 (month, quarter, year)

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "name": "식비",
        "amount": 450000,
        "percentage": 30,
        "transactionCount": 45,
        "averagePerTransaction": 10000,
        "trend": "up",
        "changeFromLastPeriod": 5.2
      },
      {
        "name": "교통",
        "amount": 300000,
        "percentage": 20,
        "transactionCount": 60,
        "averagePerTransaction": 5000,
        "trend": "down",
        "changeFromLastPeriod": -3.1
      },
      {
        "name": "쇼핑",
        "amount": 400000,
        "percentage": 26.67,
        "transactionCount": 20,
        "averagePerTransaction": 20000,
        "trend": "stable",
        "changeFromLastPeriod": 0.5
      },
      {
        "name": "엔터테인먼트",
        "amount": 250000,
        "percentage": 16.67,
        "transactionCount": 15,
        "averagePerTransaction": 16666,
        "trend": "up",
        "changeFromLastPeriod": 12.5
      },
      {
        "name": "기타",
        "amount": 100000,
        "percentage": 6.67,
        "transactionCount": 10,
        "averagePerTransaction": 10000,
        "trend": "stable",
        "changeFromLastPeriod": -1.2
      }
    ],
    "totalExpense": 1500000,
    "period": {
      "start": "2025-11-01",
      "end": "2025-11-30"
    }
  }
}
```

### 3. 월별 비교 통계

**Endpoint:** `GET /statistics/monthly-comparison`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `months` (optional): 비교할 개월 수 (기본값: 6)

**Response:**
```json
{
  "success": true,
  "data": {
    "months": [
      {
        "month": "2025-11",
        "totalExpense": 1500000,
        "totalIncome": 3000000,
        "savings": 1500000,
        "transactionCount": 87,
        "topCategory": "식비"
      },
      {
        "month": "2025-10",
        "totalExpense": 1800000,
        "totalIncome": 3000000,
        "savings": 1200000,
        "transactionCount": 95,
        "topCategory": "식비"
      },
      {
        "month": "2025-09",
        "totalExpense": 1600000,
        "totalIncome": 3000000,
        "savings": 1400000,
        "transactionCount": 82,
        "topCategory": "교통"
      }
    ],
    "averages": {
      "expense": 1633333,
      "income": 3000000,
      "savings": 1366667
    },
    "trends": {
      "expense": "decreasing",
      "income": "stable",
      "savings": "increasing"
    }
  }
}
```

### 4. 지출 인사이트

**Endpoint:** `GET /statistics/insights`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "type": "warning",
        "category": "식비",
        "title": "식비 지출 증가",
        "description": "이번 달 식비가 지난 달 대비 15% 증가했습니다.",
        "recommendation": "외식을 줄이고 집에서 요리하는 횟수를 늘려보세요.",
        "potentialSavings": 50000
      },
      {
        "type": "success",
        "category": "교통",
        "title": "교통비 절감 성공",
        "description": "이번 달 교통비가 지난 달 대비 20% 감소했습니다.",
        "recommendation": "현재 패턴을 유지하세요.",
        "savings": 60000
      },
      {
        "type": "info",
        "category": "전체",
        "title": "예산 75% 사용",
        "description": "월 예산의 75%를 사용했습니다. 남은 10일간 주의가 필요합니다.",
        "recommendation": "하루 평균 50,000원 이하로 지출하세요."
      }
    ],
    "aiTips": [
      {
        "type": "savings",
        "title": "구독 서비스 정리",
        "description": "3개월 이상 사용하지 않은 구독 서비스 2개를 발견했습니다.",
        "savings": 30000
      },
      {
        "type": "alert",
        "title": "중복 결제 감지",
        "description": "같은 날 같은 가맹점에서 2번 결제가 발생했습니다.",
        "amount": 15000
      }
    ]
  }
}
```

### 5. 차트 데이터

**Endpoint:** `GET /statistics/charts`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `type`: 차트 타입 (pie, bar, line)
- `period` (optional): 기간 (week, month, quarter, year)

**Response (Pie Chart):**
```json
{
  "success": true,
  "data": {
    "type": "pie",
    "labels": ["식비", "교통", "쇼핑", "엔터테인먼트", "기타"],
    "datasets": [
      {
        "data": [450000, 300000, 400000, 250000, 100000],
        "backgroundColor": ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
      }
    ]
  }
}
```

**Response (Bar Chart):**
```json
{
  "success": true,
  "data": {
    "type": "bar",
    "labels": ["식비", "교통", "쇼핑", "엔터테인먼트", "기타"],
    "datasets": [
      {
        "label": "이번 달",
        "data": [450000, 300000, 400000, 250000, 100000],
        "backgroundColor": "#36A2EB"
      },
      {
        "label": "지난 달",
        "data": [420000, 310000, 380000, 220000, 120000],
        "backgroundColor": "#FF6384"
      }
    ]
  }
}
```

**Response (Line Chart):**
```json
{
  "success": true,
  "data": {
    "type": "line",
    "labels": ["11/1", "11/8", "11/15", "11/22", "11/29"],
    "datasets": [
      {
        "label": "지출",
        "data": [50000, 75000, 60000, 80000, 70000],
        "borderColor": "#FF6384",
        "fill": false
      },
      {
        "label": "수입",
        "data": [100000, 100000, 100000, 100000, 100000],
        "borderColor": "#36A2EB",
        "fill": false
      }
    ]
  }
}
```

---

## 예산 관리 API

### 1. 예산 조회

**Endpoint:** `GET /budget`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "monthly": 2000000,
    "current": 1500000,
    "remaining": 500000,
    "percentUsed": 75,
    "categories": {
      "식비": {
        "budget": 600000,
        "spent": 450000,
        "remaining": 150000
      },
      "교통": {
        "budget": 400000,
        "spent": 300000,
        "remaining": 100000
      },
      "쇼핑": {
        "budget": 500000,
        "spent": 400000,
        "remaining": 100000
      },
      "엔터테인먼트": {
        "budget": 300000,
        "spent": 250000,
        "remaining": 50000
      },
      "기타": {
        "budget": 200000,
        "spent": 100000,
        "remaining": 100000
      }
    },
    "alerts": [
      {
        "category": "식비",
        "type": "warning",
        "message": "식비 예산의 75%를 사용했습니다."
      }
    ]
  }
}
```

### 2. 예산 설정

**Endpoint:** `POST /budget`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "monthly": 2000000,
  "categories": {
    "식비": 600000,
    "교통": 400000,
    "쇼핑": 500000,
    "엔터테인먼트": 300000,
    "기타": 200000
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "monthly": 2000000,
    "categories": {
      "식비": 600000,
      "교통": 400000,
      "쇼핑": 500000,
      "엔터테인먼트": 300000,
      "기타": 200000
    }
  },
  "message": "예산이 설정되었습니다."
}
```

### 3. 예산 수정

**Endpoint:** `PUT /budget`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "monthly": 2500000,
  "categories": {
    "식비": 700000,
    "교통": 400000,
    "쇼핑": 600000,
    "엔터테인먼트": 400000,
    "기타": 400000
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "monthly": 2500000,
    "categories": {
      "식비": 700000,
      "교통": 400000,
      "쇼핑": 600000,
      "엔터테인먼트": 400000,
      "기타": 400000
    }
  },
  "message": "예산이 업데이트되었습니다."
}
```

### 4. 예산 알림 설정

**Endpoint:** `POST /budget/alerts`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "enabled": true,
  "thresholds": {
    "warning": 75,
    "danger": 90
  },
  "notifications": {
    "email": true,
    "push": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "thresholds": {
      "warning": 75,
      "danger": 90
    },
    "notifications": {
      "email": true,
      "push": true
    }
  },
  "message": "알림 설정이 저장되었습니다."
}
```

---

## 에러 코드

| 코드 | 설명 |
|------|------|
| `AUTH_001` | 인증 토큰이 없습니다 |
| `AUTH_002` | 유효하지 않은 토큰입니다 |
| `AUTH_003` | 토큰이 만료되었습니다 |
| `AUTH_004` | 이메일 또는 비밀번호가 올바르지 않습니다 |
| `USER_001` | 사용자를 찾을 수 없습니다 |
| `USER_002` | 이미 존재하는 이메일입니다 |
| `TXN_001` | 거래 내역을 찾을 수 없습니다 |
| `TXN_002` | 잘못된 거래 데이터입니다 |
| `RECEIPT_001` | 영수증을 찾을 수 없습니다 |
| `RECEIPT_002` | 지원하지 않는 파일 형식입니다 |
| `RECEIPT_003` | 파일 크기가 너무 큽니다 (최대 10MB) |
| `BUDGET_001` | 예산 정보를 찾을 수 없습니다 |
| `BUDGET_002` | 잘못된 예산 데이터입니다 |
| `SERVER_001` | 서버 내부 오류가 발생했습니다 |

---

## 데이터 타입

### Transaction
```typescript
interface Transaction {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  merchant: string;
  category: '식비' | '교통' | '쇼핑' | '엔터테인먼트' | '기타';
  amount: number;
  type: 'expense' | 'income';
  paymentMethod: '신용카드' | '체크카드' | '현금' | '계좌이체';
  cardLastFour?: string;
  memo?: string;
  receiptUrl?: string;
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  tags?: string[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  profileImage?: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Budget
```typescript
interface Budget {
  monthly: number;
  current: number;
  remaining: number;
  percentUsed: number;
  categories: {
    [category: string]: {
      budget: number;
      spent: number;
      remaining: number;
    };
  };
}
```

---

## 참고 사항

1. **날짜 형식**: 모든 날짜는 ISO 8601 형식 또는 YYYY-MM-DD 형식을 사용합니다.
2. **금액**: 모든 금액은 원(KRW) 단위이며, 정수로 표현됩니다.
3. **페이지네이션**: 기본값은 page=1, limit=20입니다.
4. **인증**: 모든 보호된 엔드포인트는 Bearer 토큰이 필요합니다.
5. **파일 업로드**: 영수증 파일은 최대 10MB까지 지원합니다.
6. **카테고리**: 기본 5개 카테고리(식비, 교통, 쇼핑, 엔터테인먼트, 기타)를 사용합니다.

---

## 버전 히스토리

- **v1.0.0** (2025-11-20): 초기 API 명세서 작성
