import { PiggyBank, Database } from 'lucide-react';
import { UsageTracker } from './UsageTracker';
import type { UsageStats } from './StockSageApp';


type HeaderProps = {
  usageStats: UsageStats;
};

export function Header({ usageStats }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-card border-b rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
                <PiggyBank className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
                <span className="text-blue-800 dark:text-blue-400">Market</span>
                <span className="text-primary">Sage</span>
            </h1>
        </div>
        <div className="flex items-center gap-6 text-sm">
            <UsageTracker usageStats={usageStats} />
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="font-medium text-foreground/80">Powered by FlexPrice</span>
                </div>
                <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-foreground/80">Powered by Pathway</span>
                </div>
            </div>
        </div>
    </header>
  );
}
