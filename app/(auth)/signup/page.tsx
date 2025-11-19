// file: app/signup/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  // email, password 외에 '비밀번호 확인'을 위한 상태를 추가합니다.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 비밀번호와 비밀번호 확인이 일치하는지 확인하는 로직 추가
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    console.log('회원가입 시도 데이터:', { email, password, confirmPassword });
    // 추후 이 곳에서 백엔드 API로 데이터를 전송하게 됩니다.

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "email": email,
        "password": password
      }),
    });

    if (response.ok) {
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      // 회원가입 성공 시 로그인 페이지로 리다이렉트
      router.push('/login');
    } else {
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* 왼쪽: 회원가입 폼 */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                CPAgent
              </h1>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mt-6">무료로 시작하세요</h2>
            <p className="text-gray-600 mt-2">지금 가입하고 스마트한 재무 관리를 경험하세요</p>
          </div>

          <Card className="border-2 shadow-xl">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    이메일 주소
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    비밀번호
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">최소 8자 이상 입력해주세요</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700">
                    비밀번호 확인
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      이용약관
                    </Link>
                    {' '}및{' '}
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      개인정보처리방침
                    </Link>
                    에 동의합니다
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                >
                  무료로 계정 만들기
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">또는</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    이미 계정이 있으신가요?{' '}
                    <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                      로그인하기
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 혜택 표시 */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">무료</div>
              <div className="text-xs text-gray-600 mt-1">시작 비용</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">AI</div>
              <div className="text-xs text-gray-600 mt-1">자동 분석</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">24/7</div>
              <div className="text-xs text-gray-600 mt-1">언제든지</div>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽: 디자인 영역 */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 text-white max-w-lg">
          <div className="space-y-8">
            <div>
              <h3 className="text-4xl font-bold mb-4">지금 바로 시작하세요</h3>
              <p className="text-xl text-white/90">
                수천 명의 사용자가 CPAgent와 함께
                더 나은 재무 습관을 만들어가고 있습니다.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">신용카드 필요 없음</h4>
                  <p className="text-sm text-white/80">무료로 모든 기능을 이용하세요</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">즉시 사용 가능</h4>
                  <p className="text-sm text-white/80">가입 후 바로 시작할 수 있어요</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">안전한 데이터 보호</h4>
                  <p className="text-sm text-white/80">최신 보안 기술로 정보를 보호합니다</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/20">
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold">10,000+</div>
                  <div className="text-sm text-white/80">활성 사용자</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">4.9★</div>
                  <div className="text-sm text-white/80">평균 평점</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">99%</div>
                  <div className="text-sm text-white/80">만족도</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 배경 장식 */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}