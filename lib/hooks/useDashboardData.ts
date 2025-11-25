// Custom Hook: 대시보드 데이터 관리
import { useState, useEffect } from 'react';
import { isLoggedIn } from '../client-auth';
import { 
  fetchUserProfile, 
  fetchBudget, 
  fetchTransactions 
} from '../api';
import {
  processTransactions,
  calculateMonthlySummary,
  calculateQuickStats,
  getDateRange,
  type ProcessedTransaction,
  type MonthlySummary,
  type QuickStats
} from '../data-processing';
import { 
  exampleTransactions, 
  exampleMonthlySummary, 
  exampleQuickStats 
} from '../example-data';

interface UseDashboardDataReturn {
  userName: string;
  budget: number;
  transactions: ProcessedTransaction[];
  monthlySummary: MonthlySummary;
  quickStats: QuickStats;
  isLoggedInUser: boolean;
  isExample: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useDashboardData(): UseDashboardDataReturn {
  const [userName, setUserName] = useState('사용자');
  const [budget, setBudget] = useState(0);
  const [transactions, setTransactions] = useState<ProcessedTransaction[]>([]);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [isExample, setIsExample] = useState(false);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary>({
    totalSpending: 0,
    budget: 0,
    topCategories: [],
    comparison: 0,
    savingsRate: 0
  });
  const [quickStats, setQuickStats] = useState<QuickStats>({
    dailyAverage: 0,
    weeklySpending: 0,
    monthlyGrowth: 0,
    transactionCount: 0
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const loggedIn = isLoggedIn();
    setIsLoggedInUser(loggedIn);

    if (!loggedIn) {
      // 비로그인 사용자 - 예시 데이터
      setIsExample(true);
      setTransactions(exampleTransactions);
      setMonthlySummary(exampleMonthlySummary);
      setQuickStats(exampleQuickStats);
      setBudget(exampleMonthlySummary.budget);
      setLoading(false);
      return;
    }

    // 로그인 사용자 - 실제 데이터 로드
    try {
      // 사용자 정보
      const userProfile = await fetchUserProfile();
      if (userProfile?.name) {
        setUserName(userProfile.name);
      }

      // 예산
      const userBudget = await fetchBudget();
      setBudget(userBudget);

      // 거래 내역 (이번 달)
      const { startDate, endDate } = getDateRange('month');
      const txns = await fetchTransactions({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 100
      });

      if (txns.length === 0) {
        // 데이터 없음
        setIsExample(true);
        setTransactions([]);
        setMonthlySummary({
          totalSpending: 0,
          budget: userBudget,
          topCategories: [],
          comparison: 0,
          savingsRate: 100
        });
        setQuickStats({
          dailyAverage: 0,
          weeklySpending: 0,
          monthlyGrowth: 0,
          transactionCount: 0
        });
      } else {
        // 실제 데이터
        setIsExample(false);
        const processed = processTransactions(txns, 4);
        setTransactions(processed);

        const summary = calculateMonthlySummary(txns, userBudget);
        setMonthlySummary(summary);

        const stats = calculateQuickStats(txns);
        setQuickStats(stats);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setIsExample(true);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    userName,
    budget,
    transactions,
    monthlySummary,
    quickStats,
    isLoggedInUser,
    isExample,
    loading,
    refresh: loadData
  };
}
