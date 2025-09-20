'use client';

import type { AnalyzePortfolioOutput } from '@/ai/flows/portfolio-analysis-and-advice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalysisCard } from './AnalysisCard';
import { BrainCircuit, Clock, Database } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { RebalanceSummaryCard } from './RebalanceSummaryCard';
import { useEffect, useState } from 'react';

type AnalysisDisplayProps = {
  analysis: AnalyzePortfolioOutput | null;
  isLoading: boolean;
};

export function AnalysisDisplay({ analysis, isLoading }: AnalysisDisplayProps) {
  const [formattedDate, setFormattedDate] = useState({ distance: '', time: '', dataTime: '' });
  
  useEffect(() => {
    if (analysis?.generatedAt) {
      const generatedAtDate = new Date(analysis.generatedAt);
      setFormattedDate({
        distance: formatDistanceToNow(generatedAtDate, { addSuffix: true }),
        time: format(generatedAtDate, "h:mm:ss a"),
        dataTime: format(generatedAtDate, "h:mm a"),
      });
    }
  }, [analysis?.generatedAt]);

  const generatedAt = analysis?.generatedAt;

  return (
    <Card className="h-full min-h-[500px] flex flex-col shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">AI-Generated Analysis</CardTitle>
        {generatedAt && !isLoading && (
          <div className='flex flex-col gap-2'>
            <CardDescription className="flex items-center gap-2 !mt-2 text-xs">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                Analyzed {formattedDate.distance}
              </span>
              <span className='text-muted-foreground'>
                ({formattedDate.time})
              </span>
            </CardDescription>
            <CardDescription className="flex items-center gap-2 !mt-1 text-xs">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span>
                    Data updated via Pathway at {formattedDate.dataTime}
                </span>
            </CardDescription>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-6">
        {isLoading && <LoadingSkeletons />}
        {!isLoading && !analysis && <EmptyState />}
        {!isLoading && analysis && (
          <>
            <RebalanceSummaryCard advice={analysis.advice} />
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {analysis.advice.map((item, index) => (
                <AnalysisCard key={index} advice={item} />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function LoadingSkeletons() {
  return (
    <div className="space-y-6">
      <Card className="shadow-none border-dashed p-6">
          <Skeleton className="h-6 w-3/5 mb-4" />
          <div className="flex justify-around">
            <div className='text-center'>
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-7 w-24" />
            </div>
            <div className='text-center'>
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-7 w-24" />
            </div>
          </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="shadow-none border-dashed p-6">
             <div className="flex items-center justify-between pb-2">
               <Skeleton className="h-6 w-24" />
               <Skeleton className="h-6 w-16 rounded-md" />
            </div>
            <Skeleton className="h-5 w-20 mt-4" />
            <Skeleton className="h-4 w-full mt-4" />
            <Skeleton className="h-4 w-5/6 mt-2" />
          </Card>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg bg-secondary/30 dark:bg-card/20">
        <BrainCircuit className="mx-auto h-12 w-12 text-primary/50" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">AI Analysis Awaits</h3>
        <p className="mt-2 text-sm max-w-xs">
          Add your stocks and cash balance, then click "Analyze Portfolio" to receive your personalized investment advice from MarketSage.
        </p>
      </div>
    </div>
  );
}
