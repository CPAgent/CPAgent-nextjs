'use client';

import { useState, useEffect } from 'react'; // (★추가★)
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// (★추가★) 1단계/3단계에서 만든 api 클라이언트와 useAuth 훅
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend);

// (삭제) Mock 데이터를 삭제합니다.
// const mockPieChartData = { ... };

// (★추가★) Chart.js가 요구하는 데이터 형식 state
const initialChartData = {
  labels: [] as string[],
  datasets: [
    {
      label: ' 지출액',
      data: [] as number[],
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

// (★추가★) API가 반환하는 데이터 타입 (Prisma groupBy 결과)
interface CategoryReport {
  category: string;
  _sum: {
    amount: number | null; // Prisma의 sum은 null일 수 있음
  };
}

export default function ReportsPage() {
  const { accessToken } = useAuth(); // (★추가★)

  // (★추가★) State 정의
  const [chartData, setChartData] = useState(initialChartData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // (★추가★) API 데이터 Fetch
  useEffect(() => {
    if (accessToken) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // (★수정★) [새 파일 1]에서 만든 /api/reports/categories 호출
          const response = await api.get('/api/reports/categories');
          const data: CategoryReport[] = response.data;

          // (★추가★) API 데이터를 Chart.js 형식으로 가공
          const labels = data.map(item => item.category);
          const amounts = data.map(item => item._sum.amount || 0);

          setChartData({
            labels: labels,
            datasets: [
              {
                ...initialChartData.datasets[0], // 스타일은 기존 것 재사용
                data: amounts,
              },
            ],
          });

        } catch (err) {
          console.error("Failed to fetch report data:", err);
          setError("리포트 데이터를 불러오는 데 실패했습니다.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [accessToken]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">상세 분석 리포트</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>카테고리별 지출 분석</CardTitle>
                <CardDescription>전체 기간 지출 내역을 기준으로 합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[400px] flex items-center justify-center">
                  {/* (★수정★) 로딩 및 에러 상태 처리 */}
                  {isLoading ? (
                    <p>리포트 데이터를 불러오는 중...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : chartData.labels.length === 0 ? (
                    <p>분석할 데이터가 없습니다.</p>
                  ) : (
                    // (★수정★) mockPieChartData 대신 chartData state를 렌더링
                    <Pie data={chartData} />
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>월별 지출 추이</CardTitle>
                <CardDescription>지난 6개월간의 지출 내역입니다.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[400px]">
                <p>(막대 그래프 API는 아직 구현되지 않았습니다)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}