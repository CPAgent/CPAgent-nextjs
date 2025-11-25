// 데이터 처리 관련 유틸리티
import { getCategoryIcon, getCategoryColor } from './categories';

export interface ProcessedTransaction {
  id: string;
  store: string;
  category: string;
  amount: number;
  date: string;
  icon: any;
}

export interface MonthlySummary {
  totalSpending: number;
  budget: number;
  topCategories: Array<{
    name: string;
    amount: number;
    color: string;
    percentage: number;
  }>;
  comparison: number;
  savingsRate: number;
}

export interface QuickStats {
  dailyAverage: number;
  weeklySpending: number;
  monthlyGrowth: number;
  transactionCount: number;
}

export function processTransactions(
  transactions: any[],
  displayLimit?: number
): ProcessedTransaction[] {
  const processed = transactions.map((txn: any) => ({
    id: txn.id,
    store: txn.description || txn.merchant || '상점명 없음',
    category: txn.category || '기타',
    amount: txn.amount,
    date: new Date(txn.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }),
    icon: getCategoryIcon(txn.category)
  }));

  return displayLimit ? processed.slice(0, displayLimit) : processed;
}

export function calculateMonthlySummary(
  transactions: any[],
  budget: number
): MonthlySummary {
  const expenses = transactions.filter((t: any) => t.type === 'EXPENSE');
  const totalSpending = expenses.reduce((sum: number, t: any) => sum + t.amount, 0);

  // 카테고리별 합계
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((txn: any) => {
    const category = txn.category || '기타';
    categoryTotals[category] = (categoryTotals[category] || 0) + txn.amount;
  });

  // 상위 카테고리 3개
  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, amount]) => ({
      name,
      amount,
      color: getCategoryColor(name),
      percentage: totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0
    }));

  return {
    totalSpending,
    budget: budget || 0,
    topCategories,
    comparison: 0, // TODO: 지난달 데이터와 비교
    savingsRate: budget > 0 ? ((budget - totalSpending) / budget) * 100 : 0
  };
}

export function calculateQuickStats(
  transactions: any[],
  currentDate: Date = new Date()
): QuickStats {
  const expenses = transactions.filter((t: any) => t.type === 'EXPENSE');
  const totalSpending = expenses.reduce((sum: number, t: any) => sum + t.amount, 0);

  const daysInMonth = currentDate.getDate();

  return {
    dailyAverage: daysInMonth > 0 ? Math.round(totalSpending / daysInMonth) : 0,
    weeklySpending: daysInMonth > 0 ? Math.round(totalSpending / (daysInMonth / 7)) : 0,
    monthlyGrowth: 0, // TODO: 지난달과 비교
    transactionCount: expenses.length
  };
}

export function getDateRange(period: 'month' | 'week' | 'year' = 'month') {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  switch (period) {
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { startDate, endDate };
}
