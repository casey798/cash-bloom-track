import { Transaction, getCategoryById } from '@/types/transaction';
import { useSettings } from '@/hooks/useSettings';
import { cn } from '@/lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

export function TransactionItem({ transaction, onClick }: TransactionItemProps) {
  const { formatCurrency } = useSettings();
  const category = getCategoryById(transaction.category);
  const isExpense = transaction.type === 'expense';

  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-xl bg-card hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
        style={{ backgroundColor: `${category.color}20` }}
      >
        {category.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{transaction.description || category.name}</p>
        <p className="text-sm text-muted-foreground">{category.name}</p>
      </div>
      
      <div className="text-right">
        <p className={cn(
          'font-semibold',
          isExpense ? 'text-expense' : 'text-income'
        )}>
          {isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
        </p>
      </div>
    </div>
  );
}
