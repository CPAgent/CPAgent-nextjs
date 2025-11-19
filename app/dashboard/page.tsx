// file: app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import BudgetGoalCard from '@/components/BudgetGoalCard';
import QuickStats from '@/components/QuickStats';
import SpendingTips from '@/components/SpendingTips';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  TrendingDown, 
  TrendingUp, 
  Wallet, 
  ShoppingBag, 
  Coffee,
  Car,
  Receipt,
  Calendar,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';

// 최근 지출 내역을 위한 가짜(Mock) 데이터
const mockTransactions = [
  { id: 1, store: '스타벅스', category: '식비', amount: 6500, date: '10월 12일', icon: Coffee },
  { id: 2, store: '카카오택시', category: '교통', amount: 4800, date: '10월 12일', icon: Car },
  { id: 3, store: 'CU 편의점', category: '간식', amount: 2100, date: '10월 11일', icon: ShoppingBag },
  { id: 4, store: '쿠팡', category: '쇼핑', amount: 32000, date: '10월 10일', icon: ShoppingBag },
];

// 월별 요약을 위한 가짜(Mock) 데이터
const mockMonthlySummary = {
  totalSpending: 125400,
  budget: 200000,
  topCategories: [
    { name: '쇼핑', amount: 48000, color: 'bg-blue-500', percentage: 38 },
    { name: '식비', amount: 35500, color: 'bg-green-500', percentage: 28 },
    { name: '교통', amount: 21000, color: 'bg-yellow-500', percentage: 17 },
  ],
  comparison: -15800, // 지난달보다 15,800원 덜 씀 (음수)
  savingsRate: 37.3
};

// 빠른 통계 데이터
const quickStats = {
  dailyAverage: 4180,
  weeklySpending: 29260,
  monthlyGrowth: -12.6,
  transactionCount: mockTransactions.length
};


export default function DashboardPage() {
  const userName = '사용자';
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [budget, setBudget] = useState(mockMonthlySummary.budget);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleBudgetUpdate = (newBudget: number) => {
    setBudget(newBudget);
  };

  const budgetPercentage = (mockMonthlySummary.totalSpending / budget) * 100;

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
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                2025년 11월 20일
              </p>
            </div>
            <Button className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Receipt className="w-4 h-4 mr-2" />
              전체 내역 보기
            </Button>
          </div>

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
                  {mockMonthlySummary.totalSpending.toLocaleString()}원
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
                  {Math.abs(mockMonthlySummary.comparison).toLocaleString()}원
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
                <p className="text-3xl font-bold">{mockTransactions.length}건</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">목표</Badge>
                </div>
                <p className="text-sm opacity-90 mb-1">저축률</p>
                <p className="text-3xl font-bold">{mockMonthlySummary.savingsRate}%</p>
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
                    영수증 사진을 업로드하여 AI가 자동으로 분석합니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedFile ? (
                    <div className="text-center p-8 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <Receipt className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                      <p className="font-semibold text-green-700 mb-2">
                        파일이 선택되었습니다
                      </p>
                      <p className="text-sm text-gray-600 mb-4">{selectedFile.name}</p>
                      <div className="flex gap-3 justify-center">
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Upload className="w-4 h-4 mr-2" />
                          업로드하기
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedFile(null)}>
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`flex items-center justify-center w-full transition-all ${
                        isDragging ? 'scale-105' : ''
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <label className={`flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                        isDragging 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:bg-gray-50 hover:border-blue-400'
                      }`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-blue-600" />
                          </div>
                          <p className="mb-2 text-lg font-semibold text-gray-700">
                            클릭하거나 파일을 드래그하세요
                          </p>
                          <p className="text-sm text-gray-500">PNG, JPG, JPEG (최대 10MB)</p>
                        </div>
                        <input 
                          id="dropzone-file" 
                          type="file" 
                          className="hidden" 
                          onChange={handleFileChange} 
                          accept="image/png, image/jpeg" 
                        />
                      </label>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 최근 지출 내역 카드 */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-purple-600" />
                      <CardTitle>최근 지출 내역</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      전체보기
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {mockTransactions.map((item) => {
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
                </CardContent>
              </Card>
            </div>

            {/* 오른쪽: 월별 요약 및 예산 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 예산 목표 카드 (수정 가능) */}
              <BudgetGoalCard 
                currentSpending={mockMonthlySummary.totalSpending}
                budget={budget}
                onBudgetUpdate={handleBudgetUpdate}
              />

              {/* 카테고리별 지출 카드 */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>카테고리별 지출</CardTitle>
                  <CardDescription>상위 3개 카테고리</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockMonthlySummary.topCategories.map((category, index) => (
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
                  ))}
                </CardContent>
              </Card>

              {/* AI 절약 팁 */}
              <SpendingTips />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}