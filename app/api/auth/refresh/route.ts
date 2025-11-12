import { NextResponse } from 'next/server';

/**
 * (POST /api/auth/refresh)
 * 1단계에서 만든 lib/api.ts (Axios 인터셉터)가 
 * 401 (토큰 만료) 에러를 받으면 이 API를 호출합니다.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      // 브라우저가 refresh_token을 보내지 않은 경우
      return NextResponse.json({ error: 'Missing refresh_token' }, { status: 400 });
    }

    // [Next.js 서버]가 [Spring Boot 백엔드]로 토큰 갱신 요청을 대신 보냄
    const backendResponse = await fetch("http://localhost:8080/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token }), // { "refresh_token": "..." }
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      // 백엔드가 401 (토큰 만료/무효) 등을 반환한 경우
      // 그 에러를 브라우저의 lib/api.ts에 그대로 전달
      return NextResponse.json(data, { status: backendResponse.status });
    }

    // 성공 시 (새 access_token이 담겨있음), 브라우저에 그대로 전달
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    // fetch 실패 등 네트워크 오류
    console.error("Refresh proxy error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}