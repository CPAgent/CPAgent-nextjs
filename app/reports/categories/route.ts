import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // 1. Prisma 클라이언트
import * as jose from 'jose'; // 2. 'jose' JWT 라이브러리 (6단계에서 'npm install jose'로 설치)

// 3. Spring Boot의 JWT 공개 키(Public Key)
// (★★★★★ 중요 ★★★★★)
// .env.local 파일에 이 키를 'PEM' 형식으로 추가해야 합니다.
// (Spring Boot가 RS256을 사용하고 있다는 가정 하에)
// 예: JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIB... \n-----END PUBLIC KEY-----"
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;

if (!JWT_PUBLIC_KEY) {
  console.error("JWT_PUBLIC_KEY is not set in .env.local");
  // 실제 프로덕션에서는 이 경우 서버가 시작되지 않도록 해야 합니다.
}

/**
 * (GET /api/reports/categories)
 * app/reports/page.tsx (리포트 페이지)의 파이 차트가 호출할 API입니다.
 * 1. JWT 토큰을 검증하여 인증된 사용자인지 확인합니다.
 * 2. Prisma를 사용해 'Item' 테이블에서 카테고리별 지출 합계를 계산합니다.
 */
export async function GET(request: NextRequest) {
  if (!JWT_PUBLIC_KEY) {
    return NextResponse.json({ error: 'JWT_PUBLIC_KEY is not configured on the server.' }, { status: 500 });
  }

  try {
    // 1. [프론트엔드 클라이언트]가 보낸 'Authorization' 헤더(토큰)를 읽습니다.
    const authorization = request.headers.get('Authorization');
    const token = authorization?.split(' ')[1]; // "Bearer <token>"

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // 2. JWT 토큰 검증 (RS256 - Spring Boot와 동일한 알고리즘/키 사용)
    let email: string;
    try {
      const algorithm = 'RS256'; // (Spring Boot 설정과 일치해야 함)
      // PEM 형식의 공개 키를 import
      const spki = await jose.importSPKI(JWT_PUBLIC_KEY, algorithm);
      
      // 토큰 검증
      const { payload } = await jose.jwtVerify(token, spki);

      if (!payload.sub) {
        throw new Error('Invalid token: Missing subject (email)');
      }
      // Spring Boot의 'extractEmail'와 동일 (subject에서 이메일을 가져옴)
      email = payload.sub; 

    } catch (err: any) {
      console.warn("JWT Verification Failed:", err.message);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // 3. (★★★★★ 핵심 로직 ★★★★★)
    // Prisma를 사용하여 카테고리별로 'amount' 필드의 합계(sum)를 계산합니다.
    //
    // (가정) 'Item' 모델에 'userEmail' 필드가 있다고 가정합니다.
    // (Prisma 스키마에 이 필드가 없다면, 이 부분은 스키마에 맞게 수정되어야 합니다)
    const reportData = await prisma.item.groupBy({
      by: ['category'], // 'category' 필드로 그룹화
      _sum: {
        amount: true,  // 'amount' 필드의 합계를 계산
      },
      where: {
        // (★★★★★ 중요 ★★★★★)
        // 반드시 '로그인한 사용자'의 데이터만 집계해야 합니다.
        userEmail: email, // (가정: Item 모델에 'userEmail' 필드가 있음)
      },
    });

    // 4. 성공 응답 반환
    // [ { category: '식비', _sum: { amount: 50000 } }, ... ]
    return NextResponse.json(reportData, { status: 200 });

  } catch (error) {
    console.error("Reports API error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}