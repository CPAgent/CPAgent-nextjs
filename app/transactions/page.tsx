// file: app/transactions/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ExportDialog from '@/components/ExportDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  ArrowUpDown,
  LogIn,
} from 'lucide-react';
import { useTransactionsData } from '@/lib/hooks/useTransactionsData';
import { categories } from '@/lib/categories';

export default function TransactionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortOrder, setSortOrder] = useState<'date' | 'amount'>('date');
  
  // Custom Hook으로 모든 데이터 관리
  const {
    transactions,
    isLoggedInUser,
    isExample,
    loading
  } = useTransactionsData();

  const filteredTransactions = transactions
    .filter(t => 
      (selectedCategory === '전체' || t.category === selectedCategory) &&
      (t.store.toLowerCase().includes(searchTerm.toLowerCase()) || 
       t.category.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <main className="flex-grow p-4 md:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">데이터를 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 헤더 섹션 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                거래 내역
                {isExample && (
                  <Badge variant="secondary" className="ml-3 bg-blue-100 text-blue-700">
                    {isLoggedInUser ? '데이터 없음' : '예시'}
                  </Badge>
                )}
              </h1>
              <p className="text-gray-600">
                총 {filteredTransactions.length}건 · {totalAmount.toLocaleString()}원
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              {isLoggedInUser ? (
                <ExportDialog data={filteredTransactions} filename="거래내역" />
              ) : (
                <Button 
                  onClick={() => router.push('/login')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  로그인
                </Button>
              )}
            </div>
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
                      현재 보시는 것은 샘플 거래 데이터입니다. 회원가입하고 영수증을 업로드하면 실제 거래 내역이 표시됩니다!
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
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-900">아직 거래 내역이 없습니다</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      영수증을 업로드하면 거래 내역이 자동으로 생성됩니다!
                    </p>
                    <Button 
                      onClick={() => router.push('/transactions/upload')}
                      className="mt-3 bg-yellow-600 hover:bg-yellow-700"
                      size="sm"
                    >
                      영수증 업로드하기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 필터 카드 */}
          <Card className="shadow-lg border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                필터 및 검색
              </CardTitle>
              <CardDescription>
                원하는 조건으로 거래 내역을 필터링하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 검색 */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="상점명이나 카테고리 검색..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* 카테고리 필터 */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* 정렬 */}
                <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="정렬 기준" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">날짜순</SelectItem>
                    <SelectItem value="amount">금액순</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 카테고리 빠른 필터 */}
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.map(cat => (
                  <Badge
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 거래 내역 카드 */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>거래 목록</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSortOrder(sortOrder === 'date' ? 'amount' : 'date')}>
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  정렬 변경
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* 모바일 카드 뷰 */}
              <div className="md:hidden space-y-4">
                {filteredTransactions.map((transaction) => {
                  const Icon = transaction.icon;
                  return (
                    <div key={transaction.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{transaction.store}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {transaction.date}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-lg text-red-500">
                          -{transaction.amount.toLocaleString()}원
                        </p>
                      </div>
                      <Badge variant="secondary">{transaction.category}</Badge>
                    </div>
                  );
                })}
              </div>

              {/* 데스크톱 테이블 뷰 */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>날짜</TableHead>
                      <TableHead>상점</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead className="text-right">금액</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => {
                      const Icon = transaction.icon;
                      return (
                        <TableRow key={transaction.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{transaction.date}</TableCell>
                          <TableCell className="font-semibold text-gray-900">{transaction.store}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{transaction.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-bold text-red-500 text-lg">
                            -{transaction.amount.toLocaleString()}원
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">해당하는 거래 내역이 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 요약 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <p className="text-sm opacity-90 mb-1">총 거래 건수</p>
                <p className="text-3xl font-bold">{filteredTransactions.length}건</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <p className="text-sm opacity-90 mb-1">총 지출액</p>
                <p className="text-3xl font-bold">{totalAmount.toLocaleString()}원</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <p className="text-sm opacity-90 mb-1">평균 거래액</p>
                <p className="text-3xl font-bold">
                  {filteredTransactions.length > 0 
                    ? Math.round(totalAmount / filteredTransactions.length).toLocaleString() 
                    : 0}원
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}