// file: components/Header.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // localStorage는 클라이언트에서만 사용 가능하므로 useEffect 안에서 읽습니다.
    try {
      const token = localStorage.getItem('access_token')
      setIsLoggedIn(!!token)
    } catch (e) {
      // 안전하게 무시: 일부 환경에서 localStorage 접근이 실패할 수 있습니다.
      setIsLoggedIn(false)
    }

    // 다른 탭에서 로그인 상태 변경을 반영하려면 storage 이벤트를 수신합니다.
    const handleStorage = (ev: StorageEvent) => {
      if (ev.key === 'access_token') {
        setIsLoggedIn(!!ev.newValue)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            CPAgent
          </Link>

          {/* 네비게이션 링크 (화면이 작아지면 숨겨짐) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
              대시보드
            </Link>
            <Link href="/transactions" className="text-gray-600 hover:text-blue-600 font-medium">
              거래 내역
            </Link>
            <Link href="/reports" className="text-gray-600 hover:text-blue-600 font-medium">
              상세 분석
            </Link>
          </div>

          {/* 로그인/회원가입 버튼 */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={() => {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('refresh_token');
                  setIsLoggedIn(false);
                }}>
                로그아웃
              </Button>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600">
                  로그인
                </Link>
                <Link href="/signup" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}