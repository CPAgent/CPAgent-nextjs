'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calendar, CreditCard } from 'lucide-react';

interface QuickStatsProps {
  stats: {
    dailyAverage: number;
    weeklySpending: number;
    monthlyGrowth: number;
    transactionCount: number;
  };
}

export default function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">일평균 지출</p>
              <p className="text-lg font-bold text-gray-900">
                {stats.dailyAverage.toLocaleString()}원
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">이번 주 지출</p>
              <p className="text-lg font-bold text-gray-900">
                {stats.weeklySpending.toLocaleString()}원
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${stats.monthlyGrowth >= 0 ? 'bg-red-100' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
              {stats.monthlyGrowth >= 0 ? (
                <TrendingUp className="w-5 h-5 text-red-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500">전월 대비</p>
              <p className={`text-lg font-bold ${stats.monthlyGrowth >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.monthlyGrowth >= 0 ? '+' : ''}{stats.monthlyGrowth.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">거래 건수</p>
              <p className="text-lg font-bold text-gray-900">
                {stats.transactionCount}건
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
