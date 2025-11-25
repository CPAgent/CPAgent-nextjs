// 카테고리 관련 유틸리티
import { Coffee, Car, ShoppingBag, Film, Package, Wallet, AlertCircle } from 'lucide-react';

export const categoryIcons: Record<string, any> = {
  '식비': Coffee,
  '교통': Car,
  '쇼핑': ShoppingBag,
  '간식': ShoppingBag,
  '문화생활': Film,
  '생활용품': Package,
  '의료': AlertCircle,
  '미용': ShoppingBag,
  '통신': Package,
  '교육': Package,
  '기타': Wallet,
};

export const categoryColors: Record<string, string> = {
  '식비': 'bg-green-500',
  '교통': 'bg-yellow-500',
  '쇼핑': 'bg-blue-500',
  '문화생활': 'bg-purple-500',
  '생활용품': 'bg-pink-500',
  '의료': 'bg-red-500',
  '미용': 'bg-pink-500',
  '통신': 'bg-indigo-500',
  '교육': 'bg-orange-500',
  '기타': 'bg-gray-500',
};

export const categories = [
  '전체',
  '식비',
  '교통',
  '쇼핑',
  '문화생활',
  '생활용품',
  '간식',
  '의료',
  '미용',
  '통신',
  '교육',
  '기타'
];

export function getCategoryIcon(category: string) {
  return categoryIcons[category] || Wallet;
}

export function getCategoryColor(category: string) {
  return categoryColors[category] || 'bg-gray-500';
}
