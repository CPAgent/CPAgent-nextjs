// API Client for frontend

const API_BASE_URL = '/api'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  message?: string
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refreshToken')
  }

  private setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  private setRefreshToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', token)
    }
  }

  private clearTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (options.headers) {
      Object.assign(headers, options.headers)
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      })

      const data: ApiResponse<T> = await response.json()

      // 토큰 만료시 갱신 시도
      if (!data.success && data.error?.code === 'AUTH_003') {
        const refreshed = await this.refreshToken()
        if (refreshed) {
          // 재시도
          return this.request(endpoint, options)
        }
      }

      return data
    } catch (error) {
      console.error('API request error:', error)
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: '네트워크 오류가 발생했습니다.',
        },
      }
    }
  }

  async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return false

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      const data = await response.json()

      if (data.success) {
        this.setToken(data.data.token)
        this.setRefreshToken(data.data.refreshToken)
        return true
      }
    } catch (error) {
      console.error('Token refresh error:', error)
    }

    this.clearTokens()
    return false
  }

  // Auth APIs
  async signup(email: string, password: string, name: string, phone?: string) {
    const response = await this.request<{ user: any; token: string; refreshToken: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone }),
    })

    if (response.success && response.data) {
      this.setToken(response.data.token)
      this.setRefreshToken(response.data.refreshToken)
    }

    return response
  }

  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (response.success && response.data) {
      this.setToken(response.data.token)
      this.setRefreshToken(response.data.refreshToken)
    }

    return response
  }

  async logout() {
    this.clearTokens()
    // Optional: Call logout endpoint if you implement one
    // await this.request('/auth/logout', { method: 'POST' })
  }

  // User APIs
  async getProfile() {
    return this.request('/user/profile')
  }

  async updateProfile(data: { name?: string; phone?: string; profileImage?: string }) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Transaction APIs
  async getTransactions(params?: {
    page?: number
    limit?: number
    category?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: string
    search?: string
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/transactions${queryString}`)
  }

  async getTransaction(id: string) {
    return this.request(`/transactions/${id}`)
  }

  async createTransaction(data: {
    date: string
    merchant: string
    category: string
    amount: number
    type?: string
    paymentMethod: string
    memo?: string
    tags?: string[]
  }) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTransaction(id: string, data: any) {
    return this.request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTransaction(id: string) {
    return this.request(`/transactions/${id}`, {
      method: 'DELETE',
    })
  }

  // Statistics APIs
  async getDashboard() {
    return this.request('/statistics/dashboard')
  }

  async getCategories(params?: { startDate?: string; endDate?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return this.request(`/statistics/categories${queryString}`)
  }

  // Budget APIs
  async getBudget() {
    return this.request('/budget')
  }

  async setBudget(data: { monthly: number; categories: Record<string, number> }) {
    return this.request('/budget', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateBudget(data: { monthly: number; categories: Record<string, number> }) {
    return this.request('/budget', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const apiClient = new ApiClient()
