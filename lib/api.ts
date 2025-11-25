// API 호출 관련 유틸리티
import { getToken } from './client-auth';

interface Transaction {
  id: string;
  date: string;
  description?: string;
  merchant?: string;
  category: string;
  amount: number;
  type: string;
  paymentMethod?: string;
  memo?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function fetchUserProfile() {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch('/api/user/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data: ApiResponse<any> = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
  }
  return null;
}

export async function fetchBudget() {
  const token = getToken();
  if (!token) return 0;

  try {
    const response = await fetch('/api/budget', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data: ApiResponse<any> = await response.json();
      return data.data?.totalBudget || 0;
    }
  } catch (error) {
    console.error('Failed to fetch budget:', error);
  }
  return 0;
}

export async function fetchTransactions(params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}) {
  const token = getToken();
  if (!token) return [];

  try {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `/api/transactions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data: ApiResponse<{ transactions: Transaction[] }> = await response.json();
      return data.data?.transactions || [];
    }
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
  }
  return [];
}

export async function fetchStatistics(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const token = getToken();
  if (!token) return null;

  try {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = `/api/statistics/dashboard${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data: ApiResponse<any> = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Failed to fetch statistics:', error);
  }
  return null;
}

export async function fetchCategoryStatistics(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const token = getToken();
  if (!token) return null;

  try {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = `/api/statistics/categories${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data: ApiResponse<any> = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Failed to fetch category statistics:', error);
  }
  return null;
}
