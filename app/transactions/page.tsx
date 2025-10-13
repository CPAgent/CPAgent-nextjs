// file: app/transactions/page.tsx
// 'use client'와 useRouter가 더 이상 필요 없으므로 삭제합니다.
import Header from '@/components/Header'; // 공통 헤더를 불러옵니다.
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockAllTransactions = [
  { id: 1, date: '2025-10-12', store: '스타벅스', amount: 6500, category: '식비' },
  { id: 2, date: '2025-10-12', store: '카카오택시', amount: 4800, category: '교통' },
  { id: 3, date: '2025-10-11', store: 'CU 편의점', amount: 2100, category: '간식' },
  { id: 4, date: '2025-10-10', store: '쿠팡', amount: 32000, category: '쇼핑' },
  { id: 5, date: '2025-10-10', store: 'CGV', amount: 15000, category: '문화생활' },
  { id: 6, date: '2025-10-09', store: 'S-OIL', amount: 50000, category: '교통' },
  { id: 7, date: '2025-10-08', store: '배달의민족', amount: 25000, category: '식비' },
  { id: 8, date: '2025-10-07', store: '올리브영', amount: 18000, category: '생활용품' },
];

export default function TransactionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ----- 수정된 부분 ----- */}
      <Header />
      {/* ----- 수정된 부분 ----- */}

      {/* 메인 콘텐츠 */}
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">전체 거래 내역</h1>
          <Card>
            <CardHeader>
              <CardTitle>거래 내역 필터</CardTitle>
              <div className="mt-4">
                <Input placeholder="상점명으로 검색..." />
              </div>
            </CardHeader>
            <CardContent>
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
                  {mockAllTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell className="font-medium">{transaction.store}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className="text-right font-bold text-red-500">
                        -{transaction.amount.toLocaleString()}원
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}