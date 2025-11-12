'use client'

// import { useEffect, useState } from 'react' // (삭제) 더 이상 수동으로 상태 관리 안 함
import Link from 'next/link'
import { Button } from './ui/button'

// (★추가★) 3단계에서 만든 useAuth 훅을 import합니다.
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  // (★수정★)
  // AuthContext에서 현재 'accessToken'과 'logout' 함수를 가져옵니다.
  // 'isLoading'은 AuthContext에서 처리하므로 여기서 신경 쓸 필요 없습니다.
  const { accessToken, logout } = useAuth();

  // (★삭제★)
  // localStorage를 직접 읽고, storage 이벤트를 감시하던
  // 복잡한 useEffect 로직을 전부 삭제합니다.
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  // useEffect(() => { ... }, [])

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
            
            {/* (★수정★) isLoggedIn 대신 accessToken의 유무로 판단합니다. */}
            {accessToken ? (
              // 로그인된 상태: 로그아웃 버튼 표시
              <Button 
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={() => {
                  // (★수정★)
                  // localStorage를 직접 삭제하는 대신, AuthContext의 logout() 함수 호출
                  // 이 함수는 API 호출, localStorage/Context 상태 제거, 라우팅을 모두 처리합니다.
                  logout(); 
                }}>
                로그아웃
              </Button>
            ) : (
              // 로그아웃된 상태: 로그인/회원가입 버튼 표시
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
        </div>
      </nav>
    </header>
  )
}