import { useLocalStorage } from './useLocalStorage';
import { BudgetGoal, CategoryId } from '@/types/transaction';

const STORAGE_KEY = 'gpay-tracker-goals';

export function useBudgetGoals() {
  const [goals, setGoals] = useLocalStorage<BudgetGoal[]>(STORAGE_KEY, []);

  const addGoal = (goal: Omit<BudgetGoal, 'id'>) => {
    const existingGoal = goals.find(g => g.category === goal.category && g.period === goal.period);
    if (existingGoal) {
      updateGoal(existingGoal.id, goal);
      return existingGoal;
    }
    
    const newGoal: BudgetGoal = {
      ...goal,
      id: crypto.randomUUID(),
    };
    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<Omit<BudgetGoal, 'id'>>) => {
    setGoals(prev => 
      prev.map(g => g.id === id ? { ...g, ...updates } : g)
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const getGoalByCategory = (category: CategoryId, period: 'weekly' | 'monthly') => {
    return goals.find(g => g.category === category && g.period === period);
  };

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalByCategory,
  };
}
