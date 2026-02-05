import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CATEGORIES, CategoryId } from '@/types/transaction';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selected: CategoryId | null;
  onSelect: (category: CategoryId | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const expenseCategories = CATEGORIES.filter(c => c.type === 'expense' || c.type === 'both');

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        <Button
          variant={selected === null ? 'default' : 'outline'}
          size="sm"
          className="rounded-full shrink-0"
          onClick={() => onSelect(null)}
        >
          All
        </Button>
        {expenseCategories.map((category) => (
          <Button
            key={category.id}
            variant={selected === category.id ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'rounded-full shrink-0 gap-1.5',
              selected === category.id && 'text-primary-foreground'
            )}
            onClick={() => onSelect(category.id)}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
