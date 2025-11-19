'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MonthlyComparisonProps {
  currentMonth: {
    month: string;
    amount: number;
  };
  previousMonth: {
    month: string;
    amount: number;
  };
}

export default function MonthlyComparison({ currentMonth, previousMonth }: MonthlyComparisonProps) {
  const difference = currentMonth.amount - previousMonth.amount;
  const percentageChange = ((difference / previousMonth.amount) * 100).toFixed(1);
  const isIncrease = difference > 0;
  const isEqual = difference === 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>월별 비교 분석</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {/* 이전 달 */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">{previousMonth.month}</p>
            <p className="text-2xl font-bold text-gray-900">
              {previousMonth.amount.toLocaleString()}원
            </p>
          </div>

          {/* 현재 달 */}
          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
            <p className="text-sm text-blue-600 mb-1 font-medium">{currentMonth.month}</p>
            <p className="text-2xl font-bold text-blue-900">
              {currentMonth.amount.toLocaleString()}원
            </p>
          </div>
        </div>

        {/* 변화량 */}
        <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isEqual ? (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Minus className="w-6 h-6 text-gray-600" />
                </div>
              ) : isIncrease ? (
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-red-600" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowDownRight className="w-6 h-6 text-green-600" />
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">전월 대비</p>
                <p className={`text-3xl font-bold ${
                  isEqual ? 'text-gray-600' : isIncrease ? 'text-red-600' : 'text-green-600'
                }`}>
                  {isEqual ? '변화 없음' : `${isIncrease ? '+' : ''}{percentageChange}%`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">차액</p>
              <p className={`text-2xl font-bold ${
                isEqual ? 'text-gray-600' : isIncrease ? 'text-red-600' : 'text-green-600'
              }`}>
                {isEqual ? '0원' : `${isIncrease ? '+' : '-'}${Math.abs(difference).toLocaleString()}원`}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-300">
            <p className="text-sm text-gray-700">
              {isEqual && '지난달과 동일한 수준의 지출을 유지하고 있습니다.'}
              {isIncrease && `지난달보다 ${Math.abs(difference).toLocaleString()}원 더 지출했습니다. 지출을 줄여보세요!`}
              {!isIncrease && !isEqual && `지난달보다 ${Math.abs(difference).toLocaleString()}원 절약했습니다. 훌륭합니다! 👏`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
