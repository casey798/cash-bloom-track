export type TransactionType = 'income' | 'expense';

export type CategoryId = 
  | 'food'
  | 'shopping'
  | 'transport'
  | 'bills'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'travel'
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'gift'
  | 'other';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  type: TransactionType | 'both';
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: CategoryId;
  description: string;
  date: string;
  createdAt: string;
}

export interface BudgetGoal {
  id: string;
  category: CategoryId;
  limit: number;
  period: 'weekly' | 'monthly';
}

export interface UserSettings {
  name: string;
  currency: string;
}

export const CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Drink', icon: '🍔', color: 'hsl(16, 85%, 60%)', type: 'expense' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'hsl(270, 50%, 55%)', type: 'expense' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: 'hsl(200, 70%, 50%)', type: 'expense' },
  { id: 'bills', name: 'Bills', icon: '📄', color: 'hsl(45, 80%, 50%)', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'hsl(320, 70%, 55%)', type: 'expense' },
  { id: 'health', name: 'Health', icon: '💊', color: 'hsl(0, 70%, 55%)', type: 'expense' },
  { id: 'education', name: 'Education', icon: '📚', color: 'hsl(180, 60%, 45%)', type: 'expense' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: 'hsl(220, 70%, 55%)', type: 'expense' },
  { id: 'salary', name: 'Salary', icon: '💰', color: 'hsl(142, 70%, 45%)', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💼', color: 'hsl(160, 60%, 45%)', type: 'income' },
  { id: 'investment', name: 'Investment', icon: '📈', color: 'hsl(100, 60%, 45%)', type: 'income' },
  { id: 'gift', name: 'Gift', icon: '🎁', color: 'hsl(340, 70%, 55%)', type: 'both' },
  { id: 'other', name: 'Other', icon: '📌', color: 'hsl(0, 0%, 50%)', type: 'both' },
];

export const getCategoryById = (id: CategoryId): Category => {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
};

export const getExpenseCategories = (): Category[] => {
  return CATEGORIES.filter(c => c.type === 'expense' || c.type === 'both');
};

export const getIncomeCategories = (): Category[] => {
  return CATEGORIES.filter(c => c.type === 'income' || c.type === 'both');
};
