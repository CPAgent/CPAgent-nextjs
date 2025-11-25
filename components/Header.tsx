// file: components/Header.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { User, LogOut } from 'lucide-react'
import { isLoggedIn as checkIsLoggedIn, logout, getUserInfo } from '@/lib/client-auth'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('사용자')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // localStorage는 클라이언트에서만 사용 가능하므로 useEffect 안에서 읽습니다.
    const checkLoginStatus = async () => {
      try {
        const loggedIn = checkIsLoggedIn()
        setIsLoggedIn(loggedIn)
        
        if (loggedIn) {
          const userInfo = getUserInfo()
          if (userInfo?.name) {
            setUserName(userInfo.name)
          } else {
            // API에서 사용자 정보 가져오기
            try {
              const token = localStorage.getItem('token')
              const response = await fetch('/api/user/profile', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })
              
              if (response.ok) {
                const data = await response.json()
                setUserName(data.data?.name || '사용자')
                // 로컬 스토리지에 저장
                localStorage.setItem('user', JSON.stringify(data.data))
              }
            } catch (error) {
              console.error('Failed to fetch user info:', error)
            }
          }
        }
      } catch (e) {
        // 안전하게 무시: 일부 환경에서 localStorage 접근이 실패할 수 있습니다.
        setIsLoggedIn(false)
      }
    }

    checkLoginStatus()

    // 다른 탭에서 로그인 상태 변경을 반영하려면 storage 이벤트를 수신합니다.
    const handleStorage = (ev: StorageEvent) => {
      if (ev.key === 'token') {
        setIsLoggedIn(!!ev.newValue)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-800 transition-all">
            CPAgent
          </Link>

          {/* 데스크탑 네비게이션 링크 - 중앙 정렬 */}
          <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg p-1">
            <Link 
              href="/dashboard" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-white rounded-md transition-all"
            >
              대시보드
            </Link>
            <Link 
              href="/transactions" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-white rounded-md transition-all"
            >
              거래 내역
            </Link>
            <Link 
              href="/reports" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-white rounded-md transition-all"
            >
              상세 분석
            </Link>
          </div>

          {/* 데스크탑 로그인/회원가입 버튼 */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-800">{userName}</span>
                  <Badge className="bg-blue-600 text-white border-0 text-xs">로그인</Badge>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-red-300 hover:text-red-600 transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-400 transition-all"
                >
                  로그인
                </Link>
                <Link 
                  href="/signup" 
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow transition-all"
                >
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
                  <>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg mb-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{userName}</span>
                      <Badge className="bg-blue-100 text-blue-700 border-0 text-xs ml-auto">로그인</Badge>
                    </div>
                    <Button 
                      className="w-full px-4 py-2"
                      variant="outline"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </Button>
                  </>
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