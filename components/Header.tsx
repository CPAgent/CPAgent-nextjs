// file: components/Header.tsx
import Link from 'next/link';

export default function Header() {
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
            <Link href="/login" className="text-gray-600 hover:text-blue-600">
              로그인
            </Link>
            <Link href="/signup" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
              회원가입
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}