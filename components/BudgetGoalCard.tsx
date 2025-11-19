'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Target, Edit2, Save, X } from 'lucide-react';

interface BudgetGoalCardProps {
  currentSpending: number;
  budget: number;
  onBudgetUpdate?: (newBudget: number) => void;
}

export default function BudgetGoalCard({ 
  currentSpending, 
  budget: initialBudget,
  onBudgetUpdate 
}: BudgetGoalCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [budget, setBudget] = useState(initialBudget);
  const [tempBudget, setTempBudget] = useState(initialBudget.toString());

  const percentage = (currentSpending / budget) * 100;
  const remaining = budget - currentSpending;

  const handleSave = () => {
    const newBudget = parseInt(tempBudget);
    if (!isNaN(newBudget) && newBudget > 0) {
      setBudget(newBudget);
      onBudgetUpdate?.(newBudget);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempBudget(budget.toString());
    setIsEditing(false);
  };

  return (
    <Card className="shadow-lg border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            월간 예산 목표
          </CardTitle>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              수정
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-green-600 hover:text-green-700"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-2">
            <Label htmlFor="budget">월간 예산 설정</Label>
            <Input
              id="budget"
              type="number"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              placeholder="예산 금액 입력"
              className="text-lg"
            />
          </div>
        ) : (
          <>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">사용률</span>
                <span className="text-sm font-bold text-gray-900">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={percentage} 
                className={`h-3 ${percentage > 90 ? 'bg-red-200' : percentage > 75 ? 'bg-orange-200' : 'bg-gray-200'}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm text-gray-500">사용 금액</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentSpending.toLocaleString()}원
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">남은 예산</p>
                <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {remaining >= 0 ? remaining.toLocaleString() : `초과 ${Math.abs(remaining).toLocaleString()}`}원
                </p>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">목표 예산</span>
                <span className="text-xl font-bold text-gray-900">
                  {budget.toLocaleString()}원
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
