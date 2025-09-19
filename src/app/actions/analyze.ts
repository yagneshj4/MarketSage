'use server';

import { z } from 'zod';
import { analyzePortfolio } from '@/ai/flows/portfolio-analysis-and-advice';

const portfolioSchema = z.array(z.object({
  ticker: z.string(),
  shares: z.number(),
}));

const analyzeActionSchema = z.object({
  portfolio: portfolioSchema,
  marketData: z.string(),
  cash: z.coerce.number(),
});

export async function getAnalysisAction(input: z.infer<typeof analyzeActionSchema>) {
  const { portfolio, marketData, cash } = analyzeActionSchema.parse(input);

  const analysisInput = {
    portfolio: portfolio,
    marketData: marketData,
    cash: cash,
  };

  const result = await analyzePortfolio(analysisInput);
  
  return result;
}
