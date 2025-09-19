'use client';

import type { AnalyzePortfolioOutput } from '@/ai/flows/portfolio-analysis-and-advice';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Circle, Layers, Shield, AlertTriangle, ShieldAlert, Percent, IndianRupee } from 'lucide-react';

type Advice = AnalyzePortfolioOutput['advice'][0];

type AnalysisCardProps = {
  advice: Advice;
};

const recommendationDisplay = {
  buy: { Icon: TrendingUp, label: "Buy", className: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800" },
  sell: { Icon: TrendingDown, label: "Sell", className: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800" },
  hold: { Icon: Circle, label: "Hold", className: "bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600" },
  diversify: { Icon: Layers, label: "Diversify", className: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
};

const riskDisplay = {
    low: { Icon: Shield, label: "Low Risk", className: "text-green-600 dark:text-green-400 border-green-200 dark:border-green-700" },
    medium: { Icon: AlertTriangle, label: "Medium Risk", className: "text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700" },
    high: { Icon: ShieldAlert, label: "High Risk", className: "text-red-600 dark:text-red-400 border-red-200 dark:border-red-700" },
};


export function AnalysisCard({ advice }: AnalysisCardProps) {
  const displayInfo = recommendationDisplay[advice.recommendation] || recommendationDisplay.hold;
  const riskInfo = riskDisplay[advice.riskLevel] || riskDisplay.medium;

  return (
    <Card className="transition-all hover:shadow-lg dark:bg-card/60">
      <CardHeader className='pb-2'>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{advice.ticker}</CardTitle>
          <Badge className={cn("capitalize text-xs font-semibold", displayInfo.className)}>
            <displayInfo.Icon className="mr-1 h-3.5 w-3.5" />
            {displayInfo.label}
          </Badge>
        </div>
        <CardDescription className="!mt-2 flex flex-wrap gap-2">
            <Badge variant="outline" className={cn("capitalize text-xs font-medium", riskInfo.className)}>
              <riskInfo.Icon className="mr-1 h-3 w-3" />
              {riskInfo.label}
            </Badge>
            {advice.percentage !== undefined && (
              <Badge variant="outline" className="text-xs font-medium text-muted-foreground">
                <Percent className="mr-1 h-3 w-3" />
                {advice.percentage.toFixed(2)}% of portfolio
              </Badge>
            )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80 dark:text-foreground/70 mb-3">{advice.reason}</p>
        {advice.amount !== undefined && (advice.recommendation === 'buy' || advice.recommendation === 'sell') && (
            <div className="flex items-center gap-2 text-sm font-semibold">
                <IndianRupee className="h-4 w-4 text-primary" />
                <span>Recommendation: {advice.recommendation === 'buy' ? 'Invest' : 'Sell'}</span>
                <span className="font-bold text-lg">₹{advice.amount.toLocaleString('en-IN')}</span>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
