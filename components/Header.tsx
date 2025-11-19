// file: components/Header.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

          {/* 데스크탑 네비게이션 링크 */}
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

          {/* 데스크탑 로그인/회원가입 버튼 */}
          <div className="hidden md:flex items-center space-x-4">
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
                <Link href="/login" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  로그인
                </Link>
                <Link href="/signup" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* 모바일 햄버거 버튼 */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="메뉴 열기"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-blue-600 font-medium px-2 py-2 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                대시보드
              </Link>
              <Link 
                href="/transactions" 
                className="text-gray-600 hover:text-blue-600 font-medium px-2 py-2 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                거래 내역
              </Link>
              <Link 
                href="/reports" 
                className="text-gray-600 hover:text-blue-600 font-medium px-2 py-2 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                상세 분석
              </Link>
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
                {isLoggedIn ? (
                  <Button 
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    onClick={() => {
                      localStorage.removeItem('access_token');
                      localStorage.removeItem('refresh_token');
                      setIsLoggedIn(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    로그아웃
                  </Button>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="w-full block text-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      로그인
                    </Link>
                    <Link 
                      href="/signup" 
                      className="w-full block text-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      회원가입
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}