import { NextResponse } from 'next/server';

/**
 * (POST /api/auth/logout)
 * 나중에 만들 <Header> 컴포넌트의 '로그아웃' 버튼이 
 * AuthContext의 logout() 함수를 통해 이 API를 호출합니다.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      // 로그아웃 시엔 refresh_token이 없어도 큰 문제는 없지만,
      // 백엔드에 굳이 요청을 보낼 필요가 없으므로 여기서 응답합니다.
      return NextResponse.json({ status: 'No token to invalidate' }, { status: 200 });
    }

    // [Next.js 서버]가 [Spring Boot 백엔드]로 로그아웃 요청을 대신 보냄
    // (Spring Boot는 DB에 저장된 refresh_token을 파기함)
    const backendResponse = await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token }),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      // (예: 404 - 토큰 못찾음)
      // 에러를 브라우저에 그대로 전달
      return NextResponse.json(data, { status: backendResponse.status });
    }

    // 성공 시 ("logged out" 메시지), 브라우저에 그대로 전달
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Logout proxy error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}