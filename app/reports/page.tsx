// file: app/reports/page.tsx
'use client';

// useRouter, Button은 더 이상 필요 없으므로 삭제해도 됩니다.
import Header from '@/components/Header'; // 공통 헤더를 불러옵니다.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const mockPieChartData = {
  labels: ['식비', '교통', '쇼핑', '문화생활', '생활용품', '간식'],
  datasets: [
    {
      label: ' 지출액',
      data: [31500, 54800, 32000, 15000, 18000, 2100],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export default function ReportsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ----- 수정된 부분 ----- */}
      <Header />
      {/* ----- 수정된 부분 ----- */}

      {/* 메인 콘텐츠 */}
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">상세 분석 리포트</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>카테고리별 지출 분석</CardTitle>
                <CardDescription>2025년 10월 지출 내역을 기준으로 합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[400px] flex items-center justify-center">
                  <Pie data={mockPieChartData} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>월별 지출 추이</CardTitle>
                <CardDescription>지난 6개월간의 지출 내역입니다.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[400px]">
                <p>막대 그래프가 여기에 표시됩니다.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}