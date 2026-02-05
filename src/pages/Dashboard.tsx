import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { MonthlyChart } from '@/components/dashboard/MonthlyChart';
import { CategoryFilter } from '@/components/dashboard/CategoryFilter';
import { TransactionList } from '@/components/transactions/TransactionList';
import { useTransactions } from '@/hooks/useTransactions';
import { useSettings } from '@/hooks/useSettings';
import { CategoryId } from '@/types/transaction';

export default function Dashboard() {
  const { transactions, stats } = useTransactions();
  const { settings } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);

  const filteredTransactions = selectedCategory
    ? transactions.filter(t => t.category === selectedCategory)
    : transactions;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">Hello,</p>
          <h1 className="text-2xl font-bold">{settings.name}</h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Search className="w-5 h-5" />
        </Button>
      </div>

      {/* Balance Card */}
      <BalanceCard 
        totalIncome={stats.totalIncome}
        totalExpense={stats.totalExpense}
        balance={stats.balance}
      />

      {/* Monthly Chart */}
      <MonthlyChart transactions={transactions} />

      {/* Category Filter */}
      <CategoryFilter 
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Recent Transactions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Transactions</h2>
        <TransactionList 
          transactions={filteredTransactions}
          limit={10}
        />
      </div>
    </div>
  );
}
