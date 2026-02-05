import { Home, List, PieChart, Target, Settings, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: List, label: 'Transactions', path: '/transactions' },
  { icon: Plus, label: 'Add', path: '/add', isMain: true },
  { icon: PieChart, label: 'Stats', path: '/statistics' },
  { icon: Target, label: 'Goals', path: '/reflections' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all',
                item.isMain
                  ? 'bg-accent text-accent-foreground -mt-6 w-14 h-14 rounded-full shadow-lg hover:scale-105'
                  : isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <item.icon className={cn('w-5 h-5', item.isMain && 'w-6 h-6')} />
            {!item.isMain && <span className="text-xs font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
