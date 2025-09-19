'use client';

import type { AnalyzePortfolioOutput } from '@/ai/flows/portfolio-analysis-and-advice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

type RebalanceSummaryCardProps = {
  advice: AnalyzePortfolioOutput['advice'];
};

export function RebalanceSummaryCard({ advice }: RebalanceSummaryCardProps) {
  const totalBuy = advice
    .filter(a => (a.recommendation === 'buy' || a.recommendation === 'diversify') && a.amount)
    .reduce((sum, a) => sum + (a.amount ?? 0), 0);

  const totalSell = advice
    .filter(a => a.recommendation === 'sell' && a.amount)
    .reduce((sum, a) => sum + (a.amount ?? 0), 0);

  return (
    <Card className="bg-muted/30 dark:bg-card/30 border-dashed">
      <CardHeader className='pb-4'>
        <CardTitle className="text-lg font-semibold">Rebalance Summary</CardTitle>
        <CardDescription className='!mt-1 text-xs'>
            Summary of recommended portfolio adjustments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-1">
              <ArrowUpCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Total to Invest</span>
            </div>
            <p className="text-2xl font-bold">
              ₹{totalBuy.toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 mb-1">
              <ArrowDownCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Total to Sell</span>
            </div>
            <p className="text-2xl font-bold">
              ₹{totalSell.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
