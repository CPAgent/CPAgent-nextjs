// file: app/login/page.tsx
'use client'; // useState와 같은 클라이언트 측 기능을 사용하려면 파일 맨 위에 이 선언이 필수입니다.

import { useState } from 'react'; // React의 useState 기능을 불러옵니다.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  // 사용자가 입력한 이메일과 비밀번호를 기억하기 위한 변수를 만듭니다.
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState(''); // 사용자 이름을 위한 상태 변수
  const [error, setError] = useState('');

  // 로그인 버튼 클릭 시 실행될 함수입니다.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // form 태그의 기본 동작(페이지 새로고침)을 막습니다.
    setError(''); // 에러 메시지 초기화
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "email": email,
          "password": password
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '로그인에 실패했습니다.');
      }

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        data.refresh_token && localStorage.setItem("refresh_token", data.refresh_token);
        router.push('/'); // 홈페이지로 리다이렉트
      } else {
        throw new Error('인증 토큰이 없습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          {/* 사용자 이름을 표시할 div (예시) */}
          {userName && (
            <div className="mb-4 text-center text-xl font-semibold text-gray-800">
              환영합니다, {userName}님!
            </div>
          )}
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
              />
            </div>
            <Button type="submit" className="w-full">
              로그인
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