import { CreditCard } from 'lucide-react';
import type { UsageStats } from './StockSageApp';

type UsageTrackerProps = {
  usageStats: UsageStats;
};

export function UsageTracker({ usageStats }: UsageTrackerProps) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
        <CreditCard className="h-4 w-4" />
        <span>Credits: <span className='font-bold text-foreground'>{usageStats.creditsRemaining}</span> remaining</span>
        <span className="text-foreground/40">|</span>
        <span>Usage: <span className='font-bold text-foreground'>{usageStats.analysesToday}</span> {usageStats.analysesToday === 1 ? 'analysis' : 'analyses'} today</span>
    </div>
  );
}
