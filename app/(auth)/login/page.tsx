'use client'; // useState와 같은 클라이언트 측 기능을 사용하려면 파일 맨 위에 이 선언이 필수입니다.

import { useState } from 'react'; // React의 useState 기능을 불러옵니다.
import Link from 'next/link';
// (참고) useRouter는 AuthContext의 login 함수에 내장되어 있으므로 여기선 필요 없습니다.
// import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext'; // (★★★★★ 1. AuthContext 훅 import ★★★★★)

export default function LoginPage() {
  // (참고) router는 useAuth() 안에 포함되어 있습니다.
  // const router = useRouter(); 
  const auth = useAuth(); // (★★★★★ 2. AuthContext 사용 ★★★★★)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // 로그인 버튼 클릭 시 실행될 함수입니다.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // form 태그의 기본 동작(페이지 새로고침)을 막습니다.
    setError(''); // 에러 메시지 초기화
    setIsLoading(true); // 로딩 시작

    try {
      // (★★★★★ 3. AuthContext의 login 함수 호출 ★★★★★)
      // fetch, localStorage, router.push... 모든 로직이 이 함수 안에 있습니다.
      await auth.login(email, password);
      
      // (성공 시) AuthContext의 login 함수가 자동으로 
      // /dashboard로 라우팅하므로 여기선 아무것도 할 필요가 없습니다.

    } catch (err) {
      // (★★★★★ 4. 에러 처리 ★★★★★)
      // auth.login 함수가 실패하면 에러를 throw합니다.
      const errorMessage = (err instanceof Error) 
        ? err.message 
        : '로그인 중 알 수 없는 오류가 발생했습니다.';
      
      setError(errorMessage);
      setIsLoading(false); // 로딩 중지
    }
    // (참고) finally 블록을 사용하지 않는 이유:
    // 성공 시에는 페이지가 이동하므로 setIsLoading(false)를 
    // 호출할 필요가 없습니다. 실패 시에만 호출합니다.
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          {/* 사용자 이름 표시는 Header 컴포넌트가 담당할 것이므로 삭제합니다. */}
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>
            이메일과 비밀번호를 입력하여 로그인하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email} // input의 값을 email 상태와 연결
                onChange={(e) => setEmail(e.target.value)} // 입력값이 바뀔 때마다 email 상태 업데이트
                disabled={isLoading} // 로딩 중 비활성화
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                required
                value={password} // input의 값을 password 상태와 연결
                onChange={(e) => setPassword(e.target.value)} // 입력값이 바뀔 때마다 password 상태 업데이트
                disabled={isLoading} // 로딩 중 비활성화
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="underline">
              회원가입
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}