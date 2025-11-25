// file: app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BudgetGoalCard from '@/components/BudgetGoalCard';
import QuickStats from '@/components/QuickStats';
import SpendingTips from '@/components/SpendingTips';
import ReceiptUpload from '@/components/ReceiptUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  TrendingDown, 
  TrendingUp, 
  Wallet, 
  Receipt,
  Calendar,
  ArrowUpRight,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { useDashboardData } from '@/lib/hooks/useDashboardData';

export default function DashboardPage() {
  const router = useRouter();
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Custom Hook으로 모든 데이터 관리
  const {
    userName,
    budget,
    transactions,
    monthlySummary,
    quickStats,
    isLoggedInUser,
    isExample,
    loading,
    refresh
  } = useDashboardData();

  const handleBudgetUpdate = async (newBudget: number) => {
    // 예산 업데이트 후 데이터 새로고침
    await refresh();
  };

  const handleUploadSuccess = (result: any) => {
    console.log('영수증 분석 완료:', result);
    
    // 거래가 생성된 경우에만 모달 닫고 새로고침
    if (result.transactionCreated) {
      setShowUploadModal(false);
      fetchDashboardData();
    } else {
      // 분석만 완료된 경우 (거래 생성 대기)
      alert('영수증이 성공적으로 분석되었습니다! 거래 생성 버튼을 눌러주세요.');
    }
  };

  const handleUploadError = (error: string) => {
    console.error('영수증 분석 오류:', error);
  };

  const budgetPercentage = budget > 0 ? (monthlySummary.totalSpending / budget) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* 헤더 섹션 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                안녕하세요, {userName}님! 👋
              </h1>
              <div className="text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                2025년 11월 20일
                {isExample && (
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                    예시 데이터
                  </Badge>
                )}
              </div>
            </div>
            <Button className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Receipt className="w-4 h-4 mr-2" />
              전체 내역 보기
            </Button>
          </div>
          
          {/* 비로그인/데이터 없음 안내 배너 */}
          {!isLoggedInUser && (
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <LogIn className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-blue-900 text-lg mb-2">예시 데이터로 체험 중입니다</p>
                    <p className="text-sm text-blue-700 mb-4">
                      현재 보시는 것은 샘플 데이터입니다. 회원가입하고 영수증을 업로드하면<br/>
                      나만의 실제 지출 데이터로 대시보드가 채워집니다!
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => router.push('/signup')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        회원가입하기
                      </Button>
                      <Button 
                        onClick={() => router.push('/login')}
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        로그인
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {isLoggedInUser && isExample && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900">아직 거래 내역이 없습니다</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      영수증을 업로드하면 실제 데이터로 대시보드가 채워집니다!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 빠른 통계 */}
          <QuickStats stats={quickStats} />

          {/* 통계 카드 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Wallet className="w-8 h-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">이번 달</Badge>
                </div>
                <p className="text-sm opacity-90 mb-1">총 지출</p>
                <p className="text-3xl font-bold">
                  {loading ? '...' : monthlySummary.totalSpending.toLocaleString()}원
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingDown className="w-8 h-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">절약</Badge>
                </div>
                <p className="text-sm opacity-90 mb-1">지난달 대비</p>
                <p className="text-3xl font-bold flex items-center gap-1">
                  {loading ? '...' : Math.abs(monthlySummary.comparison).toLocaleString()}원
                  <TrendingDown className="w-6 h-6" />
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Receipt className="w-8 h-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">전체</Badge>
                </div>
                <p className="text-sm opacity-90 mb-1">거래 건수</p>
                <p className="text-3xl font-bold">{loading ? '...' : quickStats.transactionCount}건</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">목표</Badge>
                </div>
                <p className="text-sm opacity-90 mb-1">저축률</p>
                <p className="text-3xl font-bold">{loading ? '...' : monthlySummary.savingsRate.toFixed(1)}%</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽: 영수증 업로드 및 최근 내역 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 영수증 업로드 카드 */}
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <CardTitle>영수증 업로드</CardTitle>
                  </div>
                  <CardDescription>
                    {isLoggedInUser 
                      ? '영수증 사진을 업로드하여 AI가 자동으로 분석합니다' 
                      : '로그인 후 영수증을 업로드할 수 있습니다'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="mb-2 text-lg font-semibold text-gray-700">
                      AI 영수증 분석
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {isLoggedInUser 
                        ? '영수증을 업로드하면 자동으로\n거래 내역을 생성합니다' 
                        : '로그인하면 나만의 지출 데이터를\n관리할 수 있습니다'}
                    </p>
                    {isLoggedInUser ? (
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => setShowUploadModal(true)}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        영수증 업로드하기
                      </Button>
                    ) : (
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => router.push('/login')}
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        로그인하기
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 최근 지출 내역 카드 */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-purple-600" />
                      <CardTitle>최근 지출 내역</CardTitle>
                      {isExample && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          예시
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      전체보기
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      데이터를 불러오는 중...
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {transactions.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                                <Icon className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{item.store}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {item.category}
                                  </Badge>
                                  <span className="text-sm text-gray-500">{item.date}</span>
                                </div>
                              </div>
                            </div>
                            <p className="font-bold text-lg text-red-500">
                              -{item.amount.toLocaleString()}원
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 오른쪽: 월별 요약 및 예산 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 예산 목표 카드 (수정 가능) */}
              <BudgetGoalCard 
                currentSpending={monthlySummary.totalSpending}
                budget={budget}
                onBudgetUpdate={handleBudgetUpdate}
              />

              {/* 카테고리별 지출 카드 */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>카테고리별 지출</CardTitle>
                      <CardDescription>상위 3개 카테고리</CardDescription>
                    </div>
                    {isExample && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                        예시
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4 text-gray-500">
                      데이터를 불러오는 중...
                    </div>
                  ) : (
                    monthlySummary.topCategories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                            <span className="font-medium text-gray-700">{category.name}</span>
                          </div>
                          <span className="font-bold text-gray-900">
                            {category.amount.toLocaleString()}원
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={category.percentage} className="flex-1 h-2" />
                          <span className="text-sm text-gray-500 min-w-[40px] text-right">
                            {category.percentage}%
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* AI 절약 팁 */}
              <SpendingTips />
            </div>
          </div>
        </div>
      </main>

      {/* 영수증 업로드 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">영수증 업로드</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <ReceiptUpload 
                onSuccess={(result) => {
                  handleUploadSuccess(result);
                  // 분석 완료 후에는 모달을 닫지 않음 - 사용자가 결과를 확인할 수 있도록
                  // setShowUploadModal(false);
                }}
                onError={handleUploadError}
                showCreateButton={true}
                compact={true}
              />
              <div className="mt-3 pt-3 border-t">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowUploadModal(false)}
                  className="w-full"
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}