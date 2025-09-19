'use client';

import { useState, useEffect } from 'react';
import type { AnalyzePortfolioOutput } from '@/ai/flows/portfolio-analysis-and-advice';
import { getAnalysisAction } from '@/app/actions/analyze';
import { Header } from './Header';
import { PortfolioForm, type PortfolioFormData } from './PortfolioForm';
import { AnalysisDisplay } from './AnalysisDisplay';
import { useToast } from '@/hooks/use-toast';
import { getMockMarketData } from '@/lib/market-data';

export type UsageStats = {
  creditsRemaining: number;
  analysesToday: number;
};

export function StockSageApp() {
  const [analysis, setAnalysis] = useState<AnalyzePortfolioOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    creditsRemaining: 50,
    analysesToday: 0,
  });
  const { toast } = useToast();
  const [marketData, setMarketData] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // By moving this into useEffect, we ensure it only runs on the client after hydration.
    getMockMarketData().then(setMarketData);
    setIsClient(true);
  }, []);


  const handleAnalyze = async (data: PortfolioFormData) => {
    if (data.stocks.length === 0) {
      toast({
        title: "Portfolio is empty",
        description: "Please add at least one stock to your portfolio.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      // Refresh market data on each analysis
      const freshMarketData = await getMockMarketData();
      setMarketData(freshMarketData);

      const result = await getAnalysisAction({ portfolio: data.stocks, marketData: freshMarketData, cash: data.cash });
      if (!result || !result.advice) {
        throw new Error("Invalid analysis result from AI.");
      }
      setAnalysis(result);
      setUsageStats((prev) => ({
        creditsRemaining: prev.creditsRemaining > 0 ? prev.creditsRemaining - 1 : 0,
        analysesToday: prev.analysesToday + 1,
      }));
    } catch (error) {
      console.error(error);
      toast({
        title: "Analysis Failed",
        description: "An error occurred while analyzing your portfolio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-6">
      <Header usageStats={usageStats}/>
      <div className="grid gap-6 md:grid-cols-5 lg:grid-cols-3">
        <div className="md:col-span-3 lg:col-span-1">
          <PortfolioForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>
        <div className="md:col-span-2 lg:col-span-2">
          <AnalysisDisplay analysis={analysis} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
