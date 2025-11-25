// Custom Hook: 거래 내역 데이터 관리
import { useState, useEffect } from 'react';
import { isLoggedIn } from '../client-auth';
import { fetchTransactions } from '../api';
import { processTransactions, type ProcessedTransaction } from '../data-processing';
import { getCategoryIcon } from '../categories';
import { exampleTransactions } from '../example-data';

interface UseTransactionsDataReturn {
  transactions: ProcessedTransaction[];
  isLoggedInUser: boolean;
  isExample: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useTransactionsData(): UseTransactionsDataReturn {
  const [transactions, setTransactions] = useState<ProcessedTransaction[]>([]);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [isExample, setIsExample] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const loggedIn = isLoggedIn();
    setIsLoggedInUser(loggedIn);

    if (!loggedIn) {
      // 비로그인 사용자 - 예시 데이터
      setIsExample(true);
      setTransactions(exampleTransactions);
      setLoading(false);
      return;
    }

    // 로그인 사용자 - 실제 데이터 로드
    try {
      const txns = await fetchTransactions({ limit: 100 });

      if (txns.length === 0) {
        setIsExample(true);
        setTransactions([]);
      } else {
        setIsExample(false);
        const formatted = txns.map((txn: any) => ({
          id: txn.id,
          date: new Date(txn.date).toLocaleDateString('ko-KR'),
          store: txn.description || txn.merchant || '상점명 없음',
          amount: txn.amount,
          category: txn.category || '기타',
          icon: getCategoryIcon(txn.category)
        }));
        setTransactions(formatted);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
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
    transactions,
    isLoggedInUser,
    isExample,
    loading,
    refresh: loadData
  };
}
