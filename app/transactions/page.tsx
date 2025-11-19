// file: app/transactions/page.tsx
'use client';

import { useState } from 'react';
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
  Coffee,
  Car,
  ShoppingBag,
  Film,
  Package
} from 'lucide-react';

const mockAllTransactions = [
  { id: 1, date: '2025-10-12', store: '스타벅스', amount: 6500, category: '식비', icon: Coffee },
  { id: 2, date: '2025-10-12', store: '카카오택시', amount: 4800, category: '교통', icon: Car },
  { id: 3, date: '2025-10-11', store: 'CU 편의점', amount: 2100, category: '간식', icon: ShoppingBag },
  { id: 4, date: '2025-10-10', store: '쿠팡', amount: 32000, category: '쇼핑', icon: ShoppingBag },
  { id: 5, date: '2025-10-10', store: 'CGV', amount: 15000, category: '문화생활', icon: Film },
  { id: 6, date: '2025-10-09', store: 'S-OIL', amount: 50000, category: '교통', icon: Car },
  { id: 7, date: '2025-10-08', store: '배달의민족', amount: 25000, category: '식비', icon: Coffee },
  { id: 8, date: '2025-10-07', store: '올리브영', amount: 18000, category: '생활용품', icon: Package },
  { id: 9, date: '2025-10-06', store: '이마트', amount: 45000, category: '쇼핑', icon: ShoppingBag },
  { id: 10, date: '2025-10-05', store: '버거킹', amount: 12000, category: '식비', icon: Coffee },
];

const categories = ['전체', '식비', '교통', '쇼핑', '문화생활', '생활용품', '간식'];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortOrder, setSortOrder] = useState<'date' | 'amount'>('date');

  const filteredTransactions = mockAllTransactions
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
              </h1>
              <p className="text-gray-600">
                총 {filteredTransactions.length}건 · {totalAmount.toLocaleString()}원
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <ExportDialog data={filteredTransactions} filename="거래내역" />
            </div>
          </div>

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