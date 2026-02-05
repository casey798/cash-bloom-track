import { useState } from 'react';
import { Search, Filter, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TransactionList } from '@/components/transactions/TransactionList';
import { useTransactions } from '@/hooks/useTransactions';
import { CategoryId, Transaction } from '@/types/transaction';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function Transactions() {
  const { transactions, deleteTransaction } = useTransactions();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = () => {
    if (selectedTransaction) {
      deleteTransaction(selectedTransaction.id);
      toast.success('Transaction deleted');
      setSelectedTransaction(null);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Transactions</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-muted rounded-xl p-1">
        {(['all', 'expense', 'income'] as const).map((type) => (
          <button
            key={type}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all capitalize ${
              filterType === type 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-muted-foreground'
            }`}
            onClick={() => setFilterType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <TransactionList 
        transactions={filteredTransactions}
        onTransactionClick={setSelectedTransaction}
      />

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              View or delete this transaction
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="text-center">
                <p className={`text-3xl font-bold ${selectedTransaction.type === 'expense' ? 'text-expense' : 'text-income'}`}>
                  {selectedTransaction.type === 'expense' ? '-' : '+'}₹{selectedTransaction.amount.toLocaleString()}
                </p>
                <p className="text-muted-foreground mt-1">{selectedTransaction.description || 'No description'}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
