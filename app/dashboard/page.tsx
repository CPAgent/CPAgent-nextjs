'use client';

import { useState, useEffect } from 'react'; // (★추가★)
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { prisma } from '@/lib/prisma'; // (★★★★★ 치명적 오류: 즉시 삭제 ★★★★★)

// (★추가★) 1단계/3단계에서 만든 api 클라이언트와 useAuth 훅
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

// (삭제) Mock 데이터를 삭제합니다.
// const mockTransactions = [ ... ];
// const mockMonthlySummary = { ... };

// (★추가★) API로부터 받아올 데이터 타입 정의 (임시)
// (참고: Prisma 스키마에 맞춰 더 정확하게 정의해야 합니다)
interface Transaction {
  id: string; // 또는 number
  store: string;
  category: string;
  amount: number;
  date: string; // ISO 문자열로 가정
}

export default function DashboardPage() {
  const { accessToken } = useAuth(); // (★추가★) 인증 상태 확인
  const userName = '사용자'; // (TODO: useAuth에서 사용자 정보 받아오기)

  // (★추가★) API 데이터를 저장할 State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<any | null>(null); // (TODO: 요약 API 필요)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // (★추가★) API 데이터 Fetch
  useEffect(() => {
    // accessToken이 있어야만 (즉, 로그인된 사용자만) API 호출
    if (accessToken) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // (★수정★) [수정 1]에서 보안을 강화한 /api/item 호출
          // 1단계에서 만든 api 클라이언트가 자동으로 'Authorization' 헤더를 붙여줍니다.
          const response = await api.get('/api/item'); 
          
          // (임시) 대시보드는 최근 4개만 표시
          setTransactions(response.data.slice(0, 4)); 

          // (TODO: 요약 데이터용 API도 호출해야 함)
          // const summaryRes = await api.get('/api/summary');
          // setSummary(summaryRes.data);

        } catch (err) {
          console.error("Failed to fetch dashboard data:", err);
          setError("데이터를 불러오는 데 실패했습니다.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [accessToken]); // accessToken이 변경될 때마다 (로그인/로그아웃) 다시 실행

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };
  
  // (★추가★) 영수증 업로드 핸들러
  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile); // [수정 2]에서 만든 API는 'file'을 기대합니다.

    try {
      // (★수정★) [수정 2]에서 보안을 강화한 /api/receipts 호출
      // 1단계 api 클라이언트가 'Authorization' 헤더를 자동으로 붙여줍니다.
      await api.post('/api/receipts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 파일 업로드는 이 헤더가 필수
        },
      });
      
      alert('영수증이 성공적으로 업로드되었습니다!');
      setSelectedFile(null);
      // (TODO: 업로드 성공 시, 거래 내역(transactions)을 다시 불러와야 함)

    } catch (err) {
      console.error("File upload failed:", err);
      alert('업로드에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {userName}님, 환영합니다!
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* 영수증 업로드 카드 */}
              <Card>
                <CardHeader>
                  <CardTitle>영수증 업로드</CardTitle>
                  <CardDescription>
                    영수증 사진을 업로드하여 지출 내역을 자동으로 기록하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedFile ? (
                    <div className="text-center">
                      <p className="font-semibold text-green-600">
                        파일이 선택되었습니다: {selectedFile.name}
                      </p>
                      <div className="mt-4">
                        {/* (★수정★) 업로드 핸들러 연결 */}
                        <Button onClick={handleUpload}>업로드하기</Button> 
                        <Button variant="ghost" onClick={() => setSelectedFile(null)} className="ml-2">
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">클릭하여 업로드</span> 또는 파일을 드래그하세요
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg" />
                      </label>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 최근 지출 내역 카드 */}
              <Card>
                <CardHeader>
                  <CardTitle>최근 지출 내역 🧾</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* (★수정★) 로딩 및 에러 상태 처리 */}
                  {isLoading ? (
                    <p>최근 내역을 불러오는 중...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : transactions.length === 0 ? (
                    <p>최근 거래 내역이 없습니다.</p>
                  ) : (
                    <ul className="space-y-4">
                      {/* (★수정★) mockTransactions 대신 transactions state를 렌더링 */}
                      {transactions.map((item) => (
                        <li key={item.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{item.store}</p>
                            <p className="text-sm text-gray-500">
                              {item.category} · {new Date(item.date).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="font-bold text-lg text-red-500">-{item.amount.toLocaleString()}원</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 오른쪽: 월별 요약 (TODO: API 연동 필요) */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>월별 요약 📊</CardTitle>
                  <CardDescription>2025년 10월</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* ... (이 부분은 아직 Mock Data 또는 임시 텍스트로 둡니다) ... */}
                  <p>요약 데이터 로딩 중...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}