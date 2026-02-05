import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useSettings } from '@/hooks/useSettings';

interface BalanceCardProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function BalanceCard({ totalIncome, totalExpense, balance }: BalanceCardProps) {
  const { formatCurrency } = useSettings();

  return (
    <Card className="bg-primary text-primary-foreground overflow-hidden">
      <CardContent className="p-6">
        <p className="text-sm opacity-80 mb-1">Total Balance</p>
        <h2 className="text-3xl font-bold mb-4">{formatCurrency(balance)}</h2>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-income/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-income" />
            </div>
            <div>
              <p className="text-xs opacity-70">Income</p>
              <p className="text-sm font-semibold">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-expense/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-expense" />
            </div>
            <div>
              <p className="text-xs opacity-70">Expenses</p>
              <p className="text-sm font-semibold">{formatCurrency(totalExpense)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
