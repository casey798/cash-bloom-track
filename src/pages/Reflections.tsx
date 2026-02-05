import { useState } from 'react';
import { TrendingUp, TrendingDown, Target, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useTransactions } from '@/hooks/useTransactions';
import { useBudgetGoals } from '@/hooks/useBudgetGoals';
import { useSettings } from '@/hooks/useSettings';
import { getCategoryById, getExpenseCategories, CategoryId } from '@/types/transaction';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Reflections() {
  const { stats } = useTransactions();
  const { goals, addGoal, deleteGoal } = useBudgetGoals();
  const { formatCurrency } = useSettings();

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalCategory, setNewGoalCategory] = useState<CategoryId | ''>('');
  const [newGoalLimit, setNewGoalLimit] = useState('');
  const [newGoalPeriod, setNewGoalPeriod] = useState<'weekly' | 'monthly'>('monthly');

  const weeklyChange = stats.weeklyChange;
  const monthlyChange = stats.monthlyChange;

  const handleAddGoal = () => {
    if (!newGoalCategory || !newGoalLimit) {
      toast.error('Please fill in all fields');
      return;
    }

    addGoal({
      category: newGoalCategory as CategoryId,
      limit: parseFloat(newGoalLimit),
      period: newGoalPeriod,
    });

    toast.success('Goal added!');
    setShowAddGoal(false);
    setNewGoalCategory('');
    setNewGoalLimit('');
  };

  const getSpentAmount = (category: CategoryId, period: 'weekly' | 'monthly') => {
    const spent = stats.categoryBreakdown[category] || 0;
    return spent;
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Reflections & Goals</h1>

      {/* Weekly Summary */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Summary</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm opacity-80">You spent</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.weeklyExpense)}</p>
              <p className="text-sm opacity-80">this week</p>
            </div>
            <div className={cn(
              'flex items-center gap-1 px-3 py-2 rounded-lg',
              weeklyChange <= 0 ? 'bg-income/20' : 'bg-expense/20'
            )}>
              {weeklyChange <= 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              <span className="font-semibold">
                {Math.abs(weeklyChange).toFixed(0)}%
              </span>
            </div>
          </div>
          <p className="text-sm opacity-80 mt-2">
            {weeklyChange <= 0
              ? `${formatCurrency(Math.abs(stats.weeklyExpense - stats.lastWeekExpense))} less than last week`
              : `${formatCurrency(Math.abs(stats.weeklyExpense - stats.lastWeekExpense))} more than last week`}
          </p>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Insights</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Spent</span>
              <span className="font-semibold">{formatCurrency(stats.monthlyExpense)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Income</span>
              <span className="font-semibold text-income">{formatCurrency(stats.monthlyIncome)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Net Savings</span>
              <span className={cn(
                'font-semibold',
                stats.monthlyIncome - stats.monthlyExpense >= 0 ? 'text-income' : 'text-expense'
              )}>
                {formatCurrency(stats.monthlyIncome - stats.monthlyExpense)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">vs Last Month</span>
              <span className={cn(
                'flex items-center gap-1',
                monthlyChange <= 0 ? 'text-income' : 'text-expense'
              )}>
                {monthlyChange <= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                {Math.abs(monthlyChange).toFixed(0)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Goals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Budget Goals</h2>
          <Button size="sm" onClick={() => setShowAddGoal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Goal
          </Button>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => {
            const category = getCategoryById(goal.category);
            const spent = getSpentAmount(goal.category, goal.period);
            const progress = Math.min((spent / goal.limit) * 100, 100);
            const isOverBudget = spent > goal.limit;

            return (
              <Card key={goal.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{goal.period}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={isOverBudget ? 'text-expense' : ''}>
                        {formatCurrency(spent)} spent
                      </span>
                      <span className="text-muted-foreground">
                        of {formatCurrency(goal.limit)}
                      </span>
                    </div>
                    <Progress
                      value={progress}
                      className={cn(
                        'h-2',
                        isOverBudget && '[&>div]:bg-expense'
                      )}
                    />
                    {isOverBudget && (
                      <p className="text-sm text-expense">
                        ⚠️ Over budget by {formatCurrency(spent - goal.limit)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {goals.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No budget goals set</p>
                <p className="text-sm">Set goals to track your spending limits</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Budget Goal</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Category</label>
              <Select value={newGoalCategory} onValueChange={(v) => setNewGoalCategory(v as CategoryId)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {getExpenseCategories().map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Budget Limit ({settings.currency})</label>
              <Input
                type="number"
                value={newGoalLimit}
                onChange={(e) => setNewGoalLimit(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Period</label>
              <Select value={newGoalPeriod} onValueChange={(v) => setNewGoalPeriod(v as 'weekly' | 'monthly')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddGoal(false)}>Cancel</Button>
            <Button onClick={handleAddGoal}>Add Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
