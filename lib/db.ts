import fs from 'fs'
import path from 'path'

// JSON 파일 기반 데이터베이스 (영구 저장)
interface User {
  id: string
  email: string
  password: string
  name: string
  phone?: string
  createdAt: string
}

interface Transaction {
  id: string
  userId: string
  date: string
  description: string
  category: string
  amount: number
  type: string
  paymentMethod: string
  memo?: string
  receiptId?: string
  createdAt: string
}

interface Receipt {
  id: string
  userId: string
  url: string
  thumbnail?: string
  transactionId?: string
  ocrData?: string
  uploadedAt: string
}

interface Budget {
  userId: string
  totalBudget: number
  categoryBudgets: Record<string, number>
}

interface DBData {
  users: User[]
  transactions: Transaction[]
  receipts: Receipt[]
  budgets: Budget[]
}

class FileDB {
  private dbPath: string
  private data: DBData

  constructor() {
    this.dbPath = path.join(process.cwd(), 'data.json')
    this.data = this.loadData()
  }

  private loadData(): DBData {
    try {
      if (fs.existsSync(this.dbPath)) {
        const fileContent = fs.readFileSync(this.dbPath, 'utf-8')
        const data = JSON.parse(fileContent)
        // 기존 데이터에 receipts 배열이 없으면 추가
        if (!data.receipts) {
          data.receipts = []
        }
        return data
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
    return { users: [], transactions: [], receipts: [], budgets: [] }
  }

  private saveData(): void {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf-8')
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  // User methods
  async createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = {
      ...data,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    this.data.users.push(user)
    this.saveData()
    return user
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.data.users.find(u => u.email === email) || null
  }

  async findUserById(id: string): Promise<User | null> {
    return this.data.users.find(u => u.id === id) || null
  }

  async getAllUsers(): Promise<User[]> {
    return this.data.users
  }

  async updateUser(id: string, data: Partial<Pick<User, 'name' | 'phone'>>): Promise<User | null> {
    const index = this.data.users.findIndex(u => u.id === id)
    if (index === -1) return null
    
    this.data.users[index] = { ...this.data.users[index], ...data }
    this.saveData()
    return this.data.users[index]
  }

  // Transaction methods
  async createTransaction(data: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const transaction: Transaction = {
      ...data,
      date: typeof data.date === 'string' ? data.date : new Date(data.date).toISOString(),
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    this.data.transactions.push(transaction)
    this.saveData()
    return transaction
  }

  async findTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return this.data.transactions.filter(t => t.userId === userId)
  }

  async findTransactionById(id: string): Promise<Transaction | null> {
    return this.data.transactions.find(t => t.id === id) || null
  }

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction | null> {
    const index = this.data.transactions.findIndex(t => t.id === id)
    if (index === -1) return null
    
    this.data.transactions[index] = { ...this.data.transactions[index], ...data }
    this.saveData()
    return this.data.transactions[index]
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const index = this.data.transactions.findIndex(t => t.id === id)
    if (index === -1) return false
    
    this.data.transactions.splice(index, 1)
    this.saveData()
    return true
  }

  // Receipt methods
  async createReceipt(data: Omit<Receipt, 'id' | 'uploadedAt'>): Promise<Receipt> {
    const receipt: Receipt = {
      ...data,
      id: `rcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: new Date().toISOString(),
    }
    this.data.receipts.push(receipt)
    this.saveData()
    return receipt
  }

  async findReceiptById(id: string): Promise<Receipt | null> {
    return this.data.receipts.find(r => r.id === id) || null
  }

  async findReceiptsByUserId(userId: string): Promise<Receipt[]> {
    return this.data.receipts.filter(r => r.userId === userId)
  }

  async updateReceipt(id: string, data: Partial<Receipt>): Promise<Receipt | null> {
    const index = this.data.receipts.findIndex(r => r.id === id)
    if (index === -1) return null
    
    this.data.receipts[index] = { ...this.data.receipts[index], ...data }
    this.saveData()
    return this.data.receipts[index]
  }

  async deleteReceipt(id: string): Promise<boolean> {
    const index = this.data.receipts.findIndex(r => r.id === id)
    if (index === -1) return false
    
    this.data.receipts.splice(index, 1)
    this.saveData()
    return true
  }

  // Budget methods
  async createOrUpdateBudget(userId: string, totalBudget: number, categoryBudgets: Record<string, number> = {}): Promise<Budget> {
    const index = this.data.budgets.findIndex(b => b.userId === userId)
    const budget: Budget = { userId, totalBudget, categoryBudgets }
    
    if (index === -1) {
      this.data.budgets.push(budget)
    } else {
      this.data.budgets[index] = budget
    }
    
    this.saveData()
    return budget
  }

  async findBudgetByUserId(userId: string): Promise<Budget | null> {
    return this.data.budgets.find(b => b.userId === userId) || null
  }

  // Statistics helper
  async getTransactionStats(userId: string, startDate: Date, endDate: Date) {
    const txns = this.data.transactions.filter((t: Transaction) => {
      const txnDate = new Date(t.date)
      return t.userId === userId && 
        txnDate >= startDate && 
        txnDate <= endDate
    })

    const expenses = txns.filter((t: Transaction) => t.type === 'EXPENSE')
    const income = txns.filter((t: Transaction) => t.type === 'INCOME')

    const totalExpense = expenses.reduce((sum: number, t: Transaction) => sum + t.amount, 0)
    const totalIncome = income.reduce((sum: number, t: Transaction) => sum + t.amount, 0)

    return {
      totalExpense,
      totalIncome,
      transactionCount: txns.length,
      transactions: txns,
    }
  }
}

// Singleton instance
export const db = new FileDB()
