import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useTransactions } from '@/hooks/useTransactions';
import { useSettings } from '@/hooks/useSettings';
import { TransactionType, CategoryId, getExpenseCategories, getIncomeCategories, getCategoryById } from '@/types/transaction';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AddTransaction() {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();
  const { settings } = useSettings();
  
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());

  const categories = type === 'expense' ? getExpenseCategories() : getIncomeCategories();

  const handleSubmit = () => {
    if (!amount || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    addTransaction({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: date.toISOString(),
    });

    toast.success(`${type === 'expense' ? 'Expense' : 'Income'} added successfully!`);
    navigate('/');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.info('CSV import coming soon!');
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Add Transaction</h1>
      </div>

      {/* Type Toggle */}
      <div className="flex bg-muted rounded-xl p-1">
        <button
          className={cn(
            'flex-1 py-3 rounded-lg font-medium transition-all',
            type === 'expense' 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'text-muted-foreground'
          )}
          onClick={() => { setType('expense'); setCategory(null); }}
        >
          Expense
        </button>
        <button
          className={cn(
            'flex-1 py-3 rounded-lg font-medium transition-all',
            type === 'income' 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'text-muted-foreground'
          )}
          onClick={() => { setType('income'); setCategory(null); }}
        >
          Income
        </button>
      </div>

      {/* Amount Input */}
      <Card>
        <CardContent className="p-4">
          <label className="text-sm text-muted-foreground mb-2 block">Amount</label>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{settings.currency}</span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-2xl font-bold border-0 p-0 h-auto focus-visible:ring-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Selection */}
      <div>
        <label className="text-sm text-muted-foreground mb-3 block">Category</label>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                category === cat.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-transparent bg-muted/50'
              )}
              onClick={() => setCategory(cat.id)}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium text-center">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date Picker */}
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {format(date, 'PPP')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Description (optional)</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a note..."
          className="resize-none"
        />
      </div>

      {/* CSV Import */}
      <Card className="border-dashed">
        <CardContent className="p-4">
          <label className="flex items-center justify-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
            <Upload className="w-5 h-5" />
            <span>Import from GPay CSV</span>
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </label>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button 
        className="w-full h-12 text-base font-semibold"
        onClick={handleSubmit}
      >
        Add {type === 'expense' ? 'Expense' : 'Income'}
      </Button>
    </div>
  );
}
