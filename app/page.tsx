// file: app/page.tsx
'use client';

import Link from 'next/link';
// Image 컴포넌트는 더 이상 배경으로 사용하지 않으므로 import 문을 지워도 됩니다.
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* 메인 콘텐츠 영역 */}
      <main
        className="flex h-[600px] flex-col items-center justify-center text-center text-white"
        style={{
          // CSS의 다중 배경 기능을 사용합니다.
          // 1. 반투명 검은색 오버레이를 먼저 그리고,
          // 2. 그 아래에 실제 이미지를 그립니다.
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/hero-image.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold mb-4"
        >
          영수증 사진 한 장으로,
          <br />
          가계부 정리를 한번에.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-gray-200 mb-8 max-w-2xl"
        >
          CPAgent가 당신의 지출을 자동으로 분석하고 분류해 드립니다.
          <br />
          이제 귀찮은 가계부 정리는 그만하세요.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/login"
            className="inline-block px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-transform duration-200"
          >
            지금 시작하기
          </Link>
        </motion.div>
      </main>

      {/* 주요 기능 소개 섹션 */}
      <section className="w-full py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">CPAgent의 주요 기능</h2>
          <p className="text-gray-500 mb-12">당신의 현명한 소비 생활을 도와드립니다.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white border rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">자동 분석</h3>
              <p className="text-gray-600">AI가 영수증을 인식해 자동으로 지출 내역을 분석합니다.</p>
            </div>
            <div className="p-8 bg-white border rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">카테고리 분류</h3>
              <p className="text-gray-600">식비, 교통, 쇼핑 등 지출 항목을 자동으로 분류해 줍니다.</p>
            </div>
            <div className="p-8 bg-white border rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">소비 리포트</h3>
              <p className="text-gray-600">월별, 카테고리별 소비 패턴을 한눈에 파악할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}