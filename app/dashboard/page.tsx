// file: app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Header from '@/components/Header'; // 공통 헤더를 불러옵니다.
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

// 최근 지출 내역을 위한 가짜(Mock) 데이터
const mockTransactions = [
  { id: 1, store: '스타벅스', category: '식비', amount: 6500, date: '10월 12일' },
  { id: 2, store: '카카오택시', category: '교통', amount: 4800, date: '10월 12일' },
  { id: 3, store: 'CU 편의점', category: '간식', amount: 2100, date: '10월 11일' },
  { id: 4, store: '쿠팡', category: '쇼핑', amount: 32000, date: '10월 10일' },
];

// 월별 요약을 위한 가짜(Mock) 데이터
const mockMonthlySummary = {
  totalSpending: 125400,
  topCategories: [
    { name: '쇼핑', amount: 48000 },
    { name: '식비', amount: 35500 },
    { name: '교통', amount: 21000 },
  ],
  comparison: -15800, // 지난달보다 15,800원 덜 씀 (음수)
};


export default function DashboardPage() {
  const userName = '사용자';
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ----- 수정된 부분 ----- */}
      <Header />
      {/* ----- 수정된 부분 ----- */}

      {/* 메인 콘텐츠 (기존과 동일) */}
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {userName}님, 환영합니다!
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽: 영수증 업로드 및 최근 내역 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 영수증 업로드 카드 */}
              <Card>
                <CardHeader>
                  <CardTitle>영수증 업로드</CardTitle>
                  <CardDescription>
                    영수증 사진을 업로드하여 지출 내역을 자동으로 기록하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedFile ? (
                    <div className="text-center">
                      <p className="font-semibold text-green-600">
                        파일이 선택되었습니다: {selectedFile.name}
                      </p>
                      <div className="mt-4">
                        <Button onClick={async () => {
                          if (!selectedFile) return;

                          const formData = new FormData();
                          formData.append('image', selectedFile);

                          try {
                            const response = await fetch('/api/receipts', {
                              method: 'POST',
                              body: formData,
                            });

                            if (!response.ok) {
                              const errorData = await response.json();
                              throw new Error(errorData.error || '업로드 실패');
                            }

                            const result = await response.json();
                            console.log('Receipt processing result:', result);

                            // 성공적으로 업로드됨
                            alert('영수증이 성공적으로 처리되었습니다.');
                            setSelectedFile(null);
                          } catch (error) {
                            alert('업로드 중 오류가 발생했습니다.');
                            console.error('Upload error:', error);
                          }
                        }}>
                          업로드하기
                        </Button>
                        <Button variant="ghost" onClick={() => setSelectedFile(null)} className="ml-2">
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">클릭하여 업로드</span> 또는 파일을 드래그하세요
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg" />
                      </label>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 최근 지출 내역 카드 */}
              <Card>
                <CardHeader>
                  <CardTitle>최근 지출 내역 🧾</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {mockTransactions.map((item) => (
                      <li key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{item.store}</p>
                          <p className="text-sm text-gray-500">{item.category} · {item.date}</p>
                        </div>
                        <p className="font-bold text-lg text-red-500">-{item.amount.toLocaleString()}원</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* 오른쪽: 월별 요약 */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>월별 요약 📊</CardTitle>
                  <CardDescription>2025년 10월</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 총 지출액 */}
                  <div>
                    <p className="text-sm text-gray-500">총 지출액</p>
                    <p className="text-3xl font-bold">
                      {mockMonthlySummary.totalSpending.toLocaleString()}원
                    </p>
                  </div>

                  {/* 지난달 비교 */}
                  <div>
                    <p className="text-sm text-gray-500">지난달 대비</p>
                    <p className={`text-lg font-semibold ${mockMonthlySummary.comparison >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                      {mockMonthlySummary.comparison.toLocaleString()}원
                    </p>
                  </div>

                  <hr />

                  {/* 지출 TOP 3 카테고리 */}
                  <div>
                    <h4 className="font-semibold mb-2">지출 TOP 3</h4>
                    <ul className="space-y-2">
                      {mockMonthlySummary.topCategories.map((category, index) => (
                        <li key={index} className="flex justify-between text-sm">
                          <span>{index + 1}. {category.name}</span>
                          <span className="font-medium">{category.amount.toLocaleString()}원</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}