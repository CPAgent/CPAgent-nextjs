// file: app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Sparkles, 
  TrendingUp, 
  PieChart, 
  Camera, 
  Zap, 
  Shield,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { isLoggedIn } from '@/lib/client-auth';

export default function HomePage() {
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    setIsUserLoggedIn(isLoggedIn());
  }, []);

  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isUserLoggedIn) {
      router.push('/transactions/upload');
    } else {
      router.push('/login');
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      {/* 히어로 섹션 - 배경 이미지 포함 */}
      <main className="flex-grow">
        <section 
          className="relative overflow-hidden bg-cover bg-center flex items-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/hero-image.png')`,
            minHeight: '700px'
          }}
        >
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium mb-8 border border-white/30"
              >
                <Sparkles className="w-4 h-4" />
                AI 기반 스마트 가계부
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight"
              >
                영수증 한 장으로
                <br />
                <span className="bg-gradient-to-r from-blue-300 to-blue-200 bg-clip-text text-transparent">
                  완벽한 재무 관리
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                AI가 자동으로 영수증을 분석하고 분류합니다.
                <br />
                이제 복잡한 가계부 정리는 CPAgent에게 맡기세요.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <button
                  onClick={handleStartClick}
                  className="group relative inline-flex items-center justify-center gap-2 px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:shadow-[0_12px_40px_rgb(37,99,235,0.4)] hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    {isUserLoggedIn ? (
                      <>
                        <Camera className="w-5 h-5" />
                        영수증 업로드하기
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        무료로 시작하기
                      </>
                    )}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
                
                {!isUserLoggedIn && (
                  <Link
                    href="/dashboard"
                    className="group relative inline-flex items-center justify-center gap-2 px-10 py-4 text-lg font-bold text-blue-700 bg-white/95 backdrop-blur-sm rounded-xl border-2 border-white/50 shadow-[0_8px_30px_rgba(255,255,255,0.3)] hover:bg-white hover:shadow-[0_12px_40px_rgba(255,255,255,0.5)] hover:scale-[1.02] transition-all duration-300"
                  >
                    <PieChart className="w-5 h-5" />
                    <span>데모 체험하기</span>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 -ml-5 group-hover:ml-0 transition-all duration-300" />
                  </Link>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm text-white/90"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="font-medium">무료 시작</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="font-medium">신용카드 불필요</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="font-medium">언제든 취소</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 주요 기능 섹션 - 업그레이드된 디자인 */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                왜 CPAgent를 선택해야 할까요?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                최신 AI 기술로 여러분의 재무 관리를 혁신적으로 바꿔드립니다
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="group p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-xl transition-all duration-300 border border-blue-200"
              >
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">자동 인식</h3>
                <p className="text-gray-600 leading-relaxed">
                  영수증 사진을 찍기만 하면 AI가 자동으로 항목을 인식하고 데이터를 추출합니다.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="group p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-xl transition-all duration-300 border border-purple-200"
              >
                <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">스마트 분류</h3>
                <p className="text-gray-600 leading-relaxed">
                  식비, 교통, 쇼핑 등 지출을 자동으로 카테고리별로 분류하여 정리해드립니다.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="group p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-xl transition-all duration-300 border border-green-200"
              >
                <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <PieChart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">시각화 리포트</h3>
                <p className="text-gray-600 leading-relaxed">
                  월별, 카테고리별 지출을 직관적인 차트와 그래프로 한눈에 확인하세요.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="group p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl hover:shadow-xl transition-all duration-300 border border-orange-200"
              >
                <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">소비 트렌드</h3>
                <p className="text-gray-600 leading-relaxed">
                  나의 소비 패턴을 분석하여 더 나은 재무 결정을 내릴 수 있도록 도와드립니다.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="group p-8 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl hover:shadow-xl transition-all duration-300 border border-pink-200"
              >
                <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">안전한 보안</h3>
                <p className="text-gray-600 leading-relaxed">
                  최신 암호화 기술로 여러분의 금융 정보를 안전하게 보호합니다.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="group p-8 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl hover:shadow-xl transition-all duration-300 border border-indigo-200"
              >
                <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">AI 추천</h3>
                <p className="text-gray-600 leading-relaxed">
                  지출 패턴을 기반으로 절약 팁과 맞춤형 재무 조언을 제공합니다.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                지금 바로 시작하세요
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                수천 명의 사용자가 이미 CPAgent로 재무 관리를 개선하고 있습니다
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-10 py-5 text-lg font-bold text-blue-600 bg-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-200"
              >
                무료로 시작하기
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}