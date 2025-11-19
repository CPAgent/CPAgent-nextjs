// file: app/reports/page.tsx
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import MonthlyComparison from '@/components/MonthlyComparison';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  PointElement
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  PieChart,
  BarChart3,
  LineChart,
  Download,
  AlertCircle,
  Target,
  Lightbulb
} from 'lucide-react';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  LineElement,
  PointElement
);

const mockPieChartData = {
  labels: ['식비', '교통', '쇼핑', '문화생활', '생활용품', '간식'],
  datasets: [
    {
      label: '지출액',
      data: [31500, 54800, 32000, 15000, 18000, 2100],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(250, 204, 21, 0.8)',
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(251, 146, 60, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(250, 204, 21, 1)',
      ],
      borderWidth: 2,
    },
  ],
};

const mockBarChartData = {
  labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
  datasets: [
    {
      label: '월별 지출액',
      data: [145000, 168000, 132000, 156000, 141200, 125400],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      borderRadius: 8,
    },
  ],
};

const mockLineChartData = {
  labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
  datasets: [
    {
      label: '식비',
      data: [35000, 42000, 38000, 45000, 40000, 31500],
      borderColor: 'rgba(59, 130, 246, 1)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    },
    {
      label: '교통',
      data: [48000, 52000, 45000, 51000, 48000, 54800],
      borderColor: 'rgba(168, 85, 247, 1)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      tension: 0.4,
    },
    {
      label: '쇼핑',
      data: [38000, 45000, 28000, 35000, 32000, 32000],
      borderColor: 'rgba(34, 197, 94, 1)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 15,
        font: {
          size: 12,
        },
      },
    },
  },
};

const categoryInsights = [
  { 
    category: '교통', 
    trend: 'up', 
    amount: 54800, 
    percentage: 13.8,
    message: '지난달 대비 14% 증가했습니다',
    color: 'text-red-500'
  },
  { 
    category: '식비', 
    trend: 'down', 
    amount: 31500, 
    percentage: -21.3,
    message: '지난달 대비 21% 감소했습니다',
    color: 'text-green-500'
  },
  { 
    category: '쇼핑', 
    trend: 'stable', 
    amount: 32000, 
    percentage: 0,
    message: '지난달과 비슷한 수준입니다',
    color: 'text-gray-500'
  },
];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* 헤더 섹션 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                상세 분석 리포트
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                2025년 10월 지출 분석
              </p>
            </div>
            <Button className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Download className="w-4 h-4 mr-2" />
              리포트 다운로드
            </Button>
          </div>

          {/* 주요 인사이트 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingDown className="w-8 h-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">좋음</Badge>
                </div>
                <p className="text-sm opacity-90 mb-1">전월 대비</p>
                <p className="text-3xl font-bold mb-2">-12.6%</p>
                <p className="text-sm opacity-80">15,800원 절약</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-8 h-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">목표</Badge>
                </div>
                <p className="text-sm opacity-90 mb-1">예산 달성률</p>
                <p className="text-3xl font-bold mb-2">62.7%</p>
                <p className="text-sm opacity-80">74,600원 남음</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <PieChart className="w-8 h-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">최다</Badge>
                </div>
                <p className="text-sm opacity-90 mb-1">최다 지출 카테고리</p>
                <p className="text-3xl font-bold mb-2">교통</p>
                <p className="text-sm opacity-80">54,800원</p>
              </CardContent>
            </Card>
          </div>

          {/* 차트 탭 */}
          <Tabs defaultValue="category" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="category" className="flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                카테고리별
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                월별 추이
              </TabsTrigger>
              <TabsTrigger value="trend" className="flex items-center gap-2">
                <LineChart className="w-4 h-4" />
                카테고리 트렌드
              </TabsTrigger>
            </TabsList>

            <TabsContent value="category" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-blue-600" />
                      카테고리별 지출 분포
                    </CardTitle>
                    <CardDescription>
                      2025년 10월 지출 내역을 기준으로 합니다
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-[350px] flex items-center justify-center">
                      <Pie data={mockPieChartData} options={chartOptions} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>카테고리 상세 분석</CardTitle>
                    <CardDescription>각 카테고리별 지출 현황</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {mockPieChartData.labels.map((label, index) => {
                      const amount = mockPieChartData.datasets[0].data[index];
                      const total = mockPieChartData.datasets[0].data.reduce((a, b) => a + b, 0);
                      const percentage = ((amount / total) * 100).toFixed(1);
                      
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: mockPieChartData.datasets[0].backgroundColor[index] }}
                              ></div>
                              <span className="font-medium text-gray-700">{label}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{amount.toLocaleString()}원</p>
                              <p className="text-sm text-gray-500">{percentage}%</p>
                            </div>
                          </div>
                          <Progress value={parseFloat(percentage)} className="h-2" />
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    월별 지출 추이
                  </CardTitle>
                  <CardDescription>
                    최근 6개월간의 지출 패턴을 확인하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[400px]">
                    <Bar data={mockBarChartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <MonthlyComparison 
                  currentMonth={{ month: '10월', amount: 125400 }}
                  previousMonth={{ month: '9월', amount: 141200 }}
                />

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>평균 월별 지출</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {Math.round(mockBarChartData.datasets[0].data.reduce((a, b) => a + b, 0) / mockBarChartData.datasets[0].data.length).toLocaleString()}원
                    </p>
                    <p className="text-sm text-gray-600">최근 6개월 평균</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>최저/최고 지출</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">최저 지출</p>
                      <p className="text-2xl font-bold text-green-600">
                        {Math.min(...mockBarChartData.datasets[0].data).toLocaleString()}원
                      </p>
                      <p className="text-xs text-gray-500">10월</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">최고 지출</p>
                      <p className="text-2xl font-bold text-red-600">
                        {Math.max(...mockBarChartData.datasets[0].data).toLocaleString()}원
                      </p>
                      <p className="text-xs text-gray-500">6월</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trend" className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-green-600" />
                    카테고리별 트렌드 분석
                  </CardTitle>
                  <CardDescription>
                    주요 카테고리의 지출 변화를 추적합니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[400px]">
                    <Line data={mockLineChartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* 인사이트 및 추천 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  주요 인사이트
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0">
                      {insight.trend === 'up' && <TrendingUp className={`w-6 h-6 ${insight.color}`} />}
                      {insight.trend === 'down' && <TrendingDown className={`w-6 h-6 ${insight.color}`} />}
                      {insight.trend === 'stable' && <div className={`w-6 h-1 bg-gray-400 rounded`}></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{insight.category}</h4>
                        <Badge variant={insight.trend === 'down' ? 'success' : insight.trend === 'up' ? 'warning' : 'secondary'}>
                          {insight.percentage !== 0 ? `${insight.percentage > 0 ? '+' : ''}${insight.percentage}%` : '동일'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{insight.message}</p>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        {insight.amount.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  AI 절약 추천
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🚗 교통비 절감 팁</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    교통비가 지난달 대비 14% 증가했습니다. 대중교통 이용을 늘리면 월 평균 12,000원을 절약할 수 있습니다.
                  </p>
                  <Badge variant="info">월 12,000원 절약 가능</Badge>
                </div>

                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🍕 식비 관리 잘하고 계세요!</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    식비가 지난달 대비 21% 감소했습니다. 이 패턴을 유지하면 연간 250,000원 이상 절약할 수 있습니다.
                  </p>
                  <Badge variant="success">좋은 습관 유지 중</Badge>
                </div>

                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">💰 예산 목표 설정</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    현재 저축률이 37.3%입니다. 목표를 40%로 설정하면 월 5,400원만 더 절약하면 됩니다.
                  </p>
                  <Badge variant="info">목표까지 5,400원</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}