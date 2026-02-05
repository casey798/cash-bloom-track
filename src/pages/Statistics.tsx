import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import { useSettings } from '@/hooks/useSettings';
import { getCategoryById, CATEGORIES } from '@/types/transaction';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function Statistics() {
  const { transactions, stats } = useTransactions();
  const { formatCurrency } = useSettings();

  const categoryData = useMemo(() => {
    const data = Object.entries(stats.categoryBreakdown)
      .map(([categoryId, amount]) => {
        const category = getCategoryById(categoryId as any);
        return {
          name: category.name,
          value: amount,
          color: category.color,
          icon: category.icon,
        };
      })
      .sort((a, b) => b.value - a.value);
    
    return data;
  }, [stats.categoryBreakdown]);

  const totalExpense = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Statistics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-income" />
              <span className="text-sm text-muted-foreground">This Month</span>
            </div>
            <p className="text-xl font-bold text-income">{formatCurrency(stats.monthlyIncome)}</p>
            <p className="text-xs text-muted-foreground">Income</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-expense" />
              <span className="text-sm text-muted-foreground">This Month</span>
            </div>
            <p className="text-xl font-bold text-expense">{formatCurrency(stats.monthlyExpense)}</p>
            <p className="text-xs text-muted-foreground">Expenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart */}
      {categoryData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>No expense data yet</p>
            <p className="text-sm">Add some expenses to see your spending breakdown</p>
          </CardContent>
        </Card>
      )}

      {/* Category Breakdown List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoryData.slice(0, 5).map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ backgroundColor: `${item.color}20` }}
              >
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="font-semibold">{formatCurrency(item.value)}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${(item.value / totalExpense) * 100}%`,
                      backgroundColor: item.color 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {categoryData.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No expenses recorded yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
