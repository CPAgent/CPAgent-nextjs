'use client'; // (★추가★) State/Effect를 사용하므로 클라이언트 컴포넌트여야 함

import { useState, useEffect } from 'react'; // (★추가★)
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// (★추가★) 1단계/3단계에서 만든 api 클라이언트와 useAuth 훅
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

// (삭제) Mock 데이터를 삭제합니다.
// const mockAllTransactions = [ ... ];

// (★추가★) API로부터 받아올 데이터 타입 정의 (임시)
interface Transaction {
  id: string; // 또는 number
  date: string; // ISO 문자열
  store: string;
  amount: number;
  category: string;
}

export default function TransactionsPage() {
  const { accessToken } = useAuth(); // (★추가★)

  // (★추가★) State 정의: 전체 데이터, 필터링된 텍스트, 로딩/에러
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // (★추가★) API 데이터 Fetch
  useEffect(() => {
    if (accessToken) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // (★수정★) [수정 1]에서 보안을 강화한 /api/item 호출
          const response = await api.get('/api/item'); 
          setAllTransactions(response.data); // 모든 데이터를 저장
        } catch (err) {
          console.error("Failed to fetch transactions:", err);
          setError("데이터를 불러오는 데 실패했습니다.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [accessToken]);

  // (★추가★) 필터링 로직
  // allTransactions 또는 filter가 변경될 때마다 다시 계산됨
  const filteredTransactions = allTransactions.filter(transaction =>
    transaction.store.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">전체 거래 내역</h1>
          <Card>
            <CardHeader>
              <CardTitle>거래 내역 필터</CardTitle>
              <div className="mt-4">
                {/* (★수정★) Input에 onChange 핸들러 연결 */}
                <Input 
                  placeholder="상점명으로 검색..." 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {/* (★수정★) 로딩 및 에러 상태 처리 */}
              {isLoading ? (
                <p>전체 내역을 불러오는 중...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>날짜</TableHead>
                      <TableHead>상점</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead className="text-right">금액</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* (★수정★) mockAllTransactions 대신 filteredTransactions를 렌더링 */}
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{transaction.store}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell className="text-right font-bold text-red-500">
                          -{transaction.amount.toLocaleString()}원
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {/* (★추가★) 필터 결과가 없을 때 */}
              {!isLoading && !error && filteredTransactions.length === 0 && allTransactions.length > 0 && (
                <p className="text-center mt-4 text-gray-500">
                  '{filter}'(으)로 검색된 결과가 없습니다.
                </p>
              )}
              {!isLoading && !error && allTransactions.length === 0 && (
                <p className="text-center mt-4 text-gray-500">
                  거래 내역이 없습니다.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}