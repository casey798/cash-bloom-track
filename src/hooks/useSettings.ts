import { useLocalStorage } from './useLocalStorage';
import { UserSettings } from '@/types/transaction';

const STORAGE_KEY = 'gpay-tracker-settings';

const defaultSettings: UserSettings = {
  name: 'User',
  currency: '₹',
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<UserSettings>(STORAGE_KEY, defaultSettings);

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const formatCurrency = (amount: number) => {
    return `${settings.currency}${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  return {
    settings,
    updateSettings,
    formatCurrency,
  };
}
