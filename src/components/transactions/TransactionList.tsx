import { useMemo } from 'react';
import { Transaction } from '@/types/transaction';
import { TransactionItem } from './TransactionItem';
import { format, parseISO, isToday, isYesterday } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  limit?: number;
}

export function TransactionList({ transactions, onTransactionClick, limit }: TransactionListProps) {
  const groupedTransactions = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
    );
    
    const limited = limit ? sorted.slice(0, limit) : sorted;
    
    const groups: Record<string, Transaction[]> = {};
    
    limited.forEach(transaction => {
      const date = parseISO(transaction.date);
      let dateLabel: string;
      
      if (isToday(date)) {
        dateLabel = 'Today';
      } else if (isYesterday(date)) {
        dateLabel = 'Yesterday';
      } else {
        dateLabel = format(date, 'dd MMMM');
      }
      
      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(transaction);
    });
    
    return groups;
  }, [transactions, limit]);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No transactions yet</p>
        <p className="text-sm">Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedTransactions).map(([date, items]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{date}</h3>
          <div className="space-y-2">
            {items.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onClick={() => onTransactionClick?.(transaction)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
