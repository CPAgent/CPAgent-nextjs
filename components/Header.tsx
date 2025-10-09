// file: components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-4 px-8 w-full">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-600">
          <Link href="/">CPAgent</Link>
        </h1>
        <nav className="space-x-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600">
            로그인
          </Link>
          <Link href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            회원가입
          </Link>
        </nav>
      </div>
    </header>
  );
}