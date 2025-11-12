'use client'; 

import { useState } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // (삭제) AuthContext가 라우팅을 처리합니다.
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// (★추가★) 3단계에서 만든 useAuth 훅을 import합니다.
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  // const router = useRouter(); // (삭제)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState(''); 
  const [error, setError] = useState('');

  // (★추가★) AuthContext에서 login 함수를 가져옵니다.
  const { login } = useAuth();

  // 로그인 버튼 클릭 시 실행될 함수입니다.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(''); 
    
    try {
      // (★수정★)
      // 기존 fetch 로직 대신, AuthContext의 login 함수를 호출합니다.
      // 이 login 함수는 내부적으로 API 호출, 토큰 저장, /dashboard로 라우팅까지 모두 처리합니다.
      await login(email, password);

      // (성공 시 /dashboard로 자동 이동되므로 별도 처리가 필요 없습니다.)

    } catch (err: any) {
      // (★수정★)
      // login() 함수가 실패하면 (예: 401 에러) AuthContext가 에러를 throw합니다.
      // 백엔드 또는 프록시가 보낸 에러 메시지를 표시합니다.
      const errorMessage = err.response?.data?.error || err.message || '로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
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
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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