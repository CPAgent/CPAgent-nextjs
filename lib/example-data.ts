// 예시 데이터 (비로그인 사용자용)
import { Coffee, Car, ShoppingBag, Film, Package, Wallet } from 'lucide-react';

export const exampleTransactions = [
  { id: 'example-1', store: '스타벅스', category: '식비', amount: 6500, date: '11월 18일', icon: Coffee },
  { id: 'example-2', store: '카카오택시', category: '교통', amount: 4800, date: '11월 18일', icon: Car },
  { id: 'example-3', store: 'CU 편의점', category: '쇼핑', amount: 2100, date: '11월 17일', icon: ShoppingBag },
  { id: 'example-4', store: '쿠팡', category: '쇼핑', amount: 32000, date: '11월 16일', icon: ShoppingBag },
  { id: 'example-5', store: 'CGV', category: '문화생활', amount: 15000, date: '11월 15일', icon: Film },
  { id: 'example-6', store: 'S-OIL', category: '교통', amount: 50000, date: '11월 14일', icon: Car },
  { id: 'example-7', store: '배달의민족', category: '식비', amount: 25000, date: '11월 13일', icon: Coffee },
  { id: 'example-8', store: '올리브영', category: '생활용품', amount: 18000, date: '11월 12일', icon: Package },
  { id: 'example-9', store: '이마트', category: '쇼핑', amount: 45000, date: '11월 11일', icon: ShoppingBag },
  { id: 'example-10', store: '버거킹', category: '식비', amount: 12000, date: '11월 10일', icon: Coffee },
];

export const exampleMonthlySummary = {
  totalSpending: 210400,
  budget: 300000,
  topCategories: [
    { name: '쇼핑', amount: 79100, color: 'bg-blue-500', percentage: 38 },
    { name: '식비', amount: 43500, color: 'bg-green-500', percentage: 21 },
    { name: '교통', amount: 54800, color: 'bg-yellow-500', percentage: 26 },
  ],
  comparison: -15800,
  savingsRate: 29.9
};

export const exampleQuickStats = {
  dailyAverage: 10520,
  weeklySpending: 73640,
  monthlyGrowth: -7.5,
  transactionCount: 10
};

export const exampleChartData = {
  pieChart: {
    labels: ['식비', '교통', '쇼핑', '문화생활', '생활용품'],
    datasets: [
      {
        label: '지출액',
        data: [43500, 54800, 79100, 15000, 18000],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 2,
      },
    ],
  },
  barChart: {
    labels: ['6월', '7월', '8월', '9월', '10월', '11월'],
    datasets: [
      {
        label: '월별 지출액',
        data: [245000, 268000, 232000, 256000, 227200, 210400],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  },
  lineChart: {
    labels: ['6월', '7월', '8월', '9월', '10월', '11월'],
    datasets: [
      {
        label: '식비',
        data: [45000, 52000, 48000, 55000, 50000, 43500],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: '교통',
        data: [52000, 58000, 50000, 60000, 54000, 54800],
        borderColor: 'rgba(168, 85, 247, 1)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
      },
      {
        label: '쇼핑',
        data: [85000, 92000, 78000, 88000, 75000, 79100],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  },
};
