import { NextRequest, NextResponse } from 'next/server';

// [백엔드] Spring Boot 서버 주소
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

/**
 * (POST /api/receipts)
 * app/dashboard/page.tsx (대시보드)에서 영수증 파일을 업로드할 때 호출됩니다.
 * 이 API는 클라이언트의 'Authorization' 헤더를 Spring Boot 백엔드로 전달(프록시)해야 합니다.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. [클라이언트] -> [Next.js]로 전송된 'Authorization' 헤더(토큰)를 읽습니다.
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      // 토큰이 없으면 (로그인 안 됨) 401 에러 반환
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // 2. [클라이언트] -> [Next.js]로 전송된 FormData(이미지 파일)를 그대로 가져옵니다.
    const formData = await request.formData();
    // (참고: 'file'이라는 키로 파일이 전송될 것으로 dashboard/page.tsx에서 예상하고 있습니다)
    // const file = formData.get('file');

    // 3. [Next.js 서버]가 [Spring Boot 백엔드]로 요청을 전달합니다.
    // (TODO: 백엔드에 영수증 업로드 API가 /api/receipts가 맞는지 확인하세요)
    const backendResponse = await fetch(`${API_BASE_URL}/api/receipts`, { 
      method: "POST",
      headers: {
        // (★★★★★ 가장 중요 ★★★★★)
        // 클라이언트가 보낸 'Authorization' 헤더를 그대로 백엔드로 전달합니다.
        'Authorization': authorization,
        
        // (주의) 'Content-Type'은 'multipart/form-data'입니다.
        // 하지만 fetch가 FormData를 body로 받으면
        // 'boundary'가 포함된 정확한 Content-Type을 *자동으로* 생성해 줍니다.
        // 따라서 여기서 수동으로 설정하면 안 됩니다!
      },
      body: formData, // FormData를 그대로 body에 전달
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      // 백엔드가 401(토큰 만료 등)이나 다른 에러를 반환한 경우
      return NextResponse.json(data, { status: backendResponse.status });
    }

    // 성공
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Receipts proxy error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}