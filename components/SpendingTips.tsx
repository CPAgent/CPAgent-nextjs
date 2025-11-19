'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface SpendingTip {
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  description: string;
  savings?: number;
}

const tips: SpendingTip[] = [
  {
    type: 'success',
    title: '식비 절약 중',
    description: '지난달 대비 식비가 21% 감소했습니다. 이 패턴을 유지하면 연간 250,000원을 절약할 수 있어요!',
    savings: 250000
  },
  {
    type: 'warning',
    title: '교통비 증가 추세',
    description: '교통비가 14% 증가했습니다. 대중교통 이용을 늘리면 월 평균 12,000원을 절약할 수 있습니다.',
    savings: 12000
  },
  {
    type: 'info',
    title: '쇼핑 패턴 분석',
    description: '주말에 지출이 평균 35% 높습니다. 계획적인 쇼핑 리스트를 작성해보세요.',
  },
  {
    type: 'success',
    title: '목표 달성률 우수',
    description: '이번 달 예산 목표를 62.7%만 사용했습니다. 절약 습관이 매우 좋습니다!',
  }
];

export default function SpendingTips() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'danger':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'destructive';
      default:
        return 'info';
    }
  };

  const getCardStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'danger':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          AI 맞춤 절약 팁
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tips.map((tip, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg border ${getCardStyle(tip.type)} transition-all hover:shadow-md`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getIcon(tip.type)}
                <h4 className="font-semibold text-gray-900">{tip.title}</h4>
              </div>
              <Badge variant={getBadgeVariant(tip.type) as any}>
                {tip.type === 'success' && '좋음'}
                {tip.type === 'warning' && '주의'}
                {tip.type === 'danger' && '위험'}
                {tip.type === 'info' && '정보'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{tip.description}</p>
            {tip.savings && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs font-medium text-green-700">
                  💰 예상 절약액: {tip.savings.toLocaleString()}원
                </p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
