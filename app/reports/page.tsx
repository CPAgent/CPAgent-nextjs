// file: app/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Lightbulb,
  LogIn
} from 'lucide-react';
import { isLoggedIn, getToken } from '@/lib/client-auth';
import { exampleChartData } from '@/lib/example-data';
import { fetchCategoryStatistics, fetchTransactions } from '@/lib/api';
import { getCategoryColor } from '@/lib/categories';

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

// 예시 데이터는 example-data.ts에서 가져옴
const mockPieChartData = exampleChartData.pieChart;

const mockBarChartData = exampleChartData.barChart;

const mockLineChartData = exampleChartData.lineChart;

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
    category: '쇼핑', 
    trend: 'up', 
    amount: 79100, 
    percentage: 5.5,
    message: '지난달 대비 6% 증가했습니다',
    color: 'text-red-500'
  },
  { 
    category: '교통', 
    trend: 'up', 
    amount: 54800, 
    percentage: 1.5,
    message: '지난달 대비 2% 증가했습니다',
    color: 'text-orange-500'
  },
  { 
    category: '식비', 
    trend: 'down', 
    amount: 43500, 
    percentage: -13.0,
    message: '지난달 대비 13% 감소했습니다',
    color: 'text-green-500'
  },
];

export default function ReportsPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [isExample, setIsExample] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pieChartData, setPieChartData] = useState(mockPieChartData);
  const [barChartData, setBarChartData] = useState(mockBarChartData);
  const [lineChartData, setLineChartData] = useState(mockLineChartData);
  const [insights, setInsights] = useState(categoryInsights);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    const loggedIn = isLoggedIn();
    setIsLoggedInUser(loggedIn);
    
    if (!loggedIn) {
      // 비로그인 사용자는 예시 데이터 표시
      setIsExample(true);
      setLoading(false);
      return;
    }
    
    // 로그인 사용자 - 실제 데이터 로드 시도
    await fetchReportsData();
  };

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setIsExample(true);
        setLoading(false);
        return;
      }

      // 이번 달 데이터 가져오기
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const transactionsData = await fetchTransactions({
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString(),
        limit: 1000
      });

      const categoryStats = await fetchCategoryStatistics({
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString()
      });

      // 데이터가 있으면 실제 데이터 사용
      if (transactionsData && transactionsData.length > 0) {
        setIsExample(false);
        
        // 실제 거래 데이터를 차트 데이터로 변환
        const expenses = transactionsData.filter((t: any) => t.type === 'EXPENSE');
        
        // 카테고리별 집계
        const categoryTotals: Record<string, number> = {};
        expenses.forEach((txn: any) => {
          const category = txn.category || '기타';
          categoryTotals[category] = (categoryTotals[category] || 0) + txn.amount;
        });

        // Pie Chart 데이터 생성
        const pieLabels = Object.keys(categoryTotals);
        const pieData = Object.values(categoryTotals);
        const pieColors = pieLabels.map((_, index) => {
          const colors = [
            'rgba(59, 130, 246, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(250, 204, 21, 0.8)',
          ];
          return colors[index % colors.length];
        });
        const pieBorderColors = pieColors.map(color => color.replace('0.8', '1'));

        setPieChartData({
          labels: pieLabels,
          datasets: [{
            label: '지출액',
            data: pieData,
            backgroundColor: pieColors,
            borderColor: pieBorderColors,
            borderWidth: 2,
          }]
        });

        // 월별 데이터 (최근 6개월)
        const monthlyData: Record<string, number> = {};
        const monthNames: string[] = [];
        
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthLabel = `${date.getMonth() + 1}월`;
          monthNames.push(monthLabel);
          monthlyData[monthKey] = 0;
        }

        // 거래 데이터를 월별로 집계
        expenses.forEach((txn: any) => {
          const date = new Date(txn.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (monthlyData.hasOwnProperty(monthKey)) {
            monthlyData[monthKey] += txn.amount;
          }
        });

        const barData = Object.values(monthlyData);
        setBarChartData({
          labels: monthNames,
          datasets: [{
            label: '월별 지출액',
            data: barData,
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            borderRadius: 8,
          }]
        });

        // 카테고리별 월별 추이 (상위 3개 카테고리)
        const topCategories = Object.entries(categoryTotals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name]) => name);

        const lineDatasets = topCategories.map((category, index) => {
          const colors = [
            { border: 'rgba(59, 130, 246, 1)', bg: 'rgba(59, 130, 246, 0.1)' },
            { border: 'rgba(168, 85, 247, 1)', bg: 'rgba(168, 85, 247, 0.1)' },
            { border: 'rgba(34, 197, 94, 1)', bg: 'rgba(34, 197, 94, 0.1)' },
          ];
          
          const categoryMonthlyData = monthNames.map(() => 0);
          
          expenses.forEach((txn: any) => {
            if (txn.category === category) {
              const date = new Date(txn.date);
              const monthIndex = 5 - (now.getMonth() - date.getMonth());
              if (monthIndex >= 0 && monthIndex < 6) {
                categoryMonthlyData[monthIndex] += txn.amount;
              }
            }
          });

          return {
            label: category,
            data: categoryMonthlyData,
            borderColor: colors[index].border,
            backgroundColor: colors[index].bg,
            tension: 0.4,
          };
        });

        setLineChartData({
          labels: monthNames,
          datasets: lineDatasets
        });

        // 인사이트 생성
        const newInsights = Object.entries(categoryTotals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([category, amount], index) => {
            const colors = ['text-red-500', 'text-orange-500', 'text-green-500'];
            return {
              category,
              trend: index === 0 ? 'up' : index === 1 ? 'stable' : 'down',
              amount,
              percentage: 0, // 이전 달 데이터가 필요
              message: `이번 달 주요 지출 카테고리입니다`,
              color: colors[index]
            };
          });
        
        setInsights(newInsights);
      } else {
        setIsExample(true);
      }
    } catch (error) {
      console.error('Failed to fetch reports data:', error);
      setIsExample(true);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="max-w-7xl mx-auto space-y-8">
          {/* 헤더 섹션 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                상세 분석 리포트
                {isExample && (
                  <Badge variant="secondary" className="ml-3 bg-blue-100 text-blue-700">
                    {isLoggedInUser ? '데이터 없음' : '예시'}
                  </Badge>
                )}
              </h1>
              <div className="text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                2025년 11월 지출 분석
              </div>
            </div>
            {isLoggedInUser ? (
              <Button className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Download className="w-4 h-4 mr-2" />
                리포트 다운로드
              </Button>
            ) : (
              <Button 
                onClick={() => router.push('/login')}
                className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700"
              >
                <LogIn className="w-4 h-4 mr-2" />
                로그인
              </Button>
            )}
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
                      현재 보시는 것은 샘플 분석 데이터입니다. 회원가입하고 영수증을 업로드하면 나만의 실제 지출 분석 리포트가 생성됩니다!
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
                    <p className="font-semibold text-yellow-900">아직 분석할 데이터가 없습니다</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      영수증을 업로드하면 자동으로 지출 분석 리포트가 생성됩니다!
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
                      <Pie data={pieChartData} options={chartOptions} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>카테고리 상세 분석</CardTitle>
                    <CardDescription>각 카테고리별 지출 현황</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {pieChartData.labels.map((label, index) => {
                      const amount = pieChartData.datasets[0].data[index];
                      const total = pieChartData.datasets[0].data.reduce((a, b) => a + b, 0);
                      const percentage = ((amount / total) * 100).toFixed(1);
                      
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: pieChartData.datasets[0].backgroundColor[index] }}
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
                    <Bar data={barChartData} options={chartOptions} />
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
                      {Math.round(barChartData.datasets[0].data.reduce((a, b) => a + b, 0) / barChartData.datasets[0].data.length).toLocaleString()}원
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
                        {Math.min(...barChartData.datasets[0].data).toLocaleString()}원
                      </p>
                      <p className="text-xs text-gray-500">10월</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">최고 지출</p>
                      <p className="text-2xl font-bold text-red-600">
                        {Math.max(...barChartData.datasets[0].data).toLocaleString()}원
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
                    <Line data={lineChartData} options={chartOptions} />
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
                {insights.map((insight, index) => (
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