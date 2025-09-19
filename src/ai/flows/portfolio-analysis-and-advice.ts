'use server';

/**
 * @fileOverview Analyzes a user's stock portfolio and provides investment advice.
 *
 * - analyzePortfolio - Analyzes the portfolio and returns investment advice.
 * - AnalyzePortfolioInput - The input type for the analyzePortfolio function.
 * - AnalyzePortfolioOutput - The return type for the analyzePortfolio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StockSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock.'),
  shares: z.number().describe('The number of shares held.'),
});

const AnalyzePortfolioInputSchema = z.object({
  portfolio: z.array(StockSchema).describe('The user’s stock portfolio.'),
  marketData: z.string().describe('The current market data as a JSON string.'),
  cash: z.number().describe('Available cash for investment.'),
});
export type AnalyzePortfolioInput = z.infer<typeof AnalyzePortfolioInputSchema>;

const AdviceSchema = z.enum(['buy', 'sell', 'hold', 'diversify']);
const RiskLevelSchema = z.enum(['low', 'medium', 'high']);

const AnalyzePortfolioOutputSchema = z.object({
  advice: z
    .array(
      z.object({
        ticker: z.string().describe('The ticker symbol of the stock.'),
        recommendation: AdviceSchema.describe(
          'Recommended action for the stock.'
        ),
        reason: z.string().describe('Reasoning behind the recommendation.'),
        riskLevel: RiskLevelSchema.describe(
          'The estimated risk level of the stock (low, medium, or high).'
        ),
        amount: z.number().optional().describe('The amount in rupees to buy or sell.'),
        percentage: z.number().optional().describe('The percentage of the portfolio this stock represents.'),
      })
    )
    .describe('Investment advice for each stock in the portfolio.'),
  generatedAt: z.string().optional().describe('The ISO 8601 timestamp when the analysis was generated.'),
});
export type AnalyzePortfolioOutput = z.infer<typeof AnalyzePortfolioOutputSchema>;

export async function analyzePortfolio(input: AnalyzePortfolioInput): Promise<AnalyzePortfolioOutput> {
  return analyzePortfolioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'portfolioAnalysisPrompt',
  input: {schema: AnalyzePortfolioInputSchema},
  output: {schema: z.object({ advice: AnalyzePortfolioOutputSchema.shape.advice }) },
  prompt: `You are a friendly and encouraging financial advisor for beginners. You specialize in the Indian stock market. Your goal is to provide clear, simple, and actionable advice.

Analyze the user's portfolio and provide specific buy/sell/hold/diversify recommendations for each stock.
Explain your reasoning for each recommendation in simple, easy-to-understand language. Avoid jargon.

For EACH stock, you MUST perform the following:
1.  Calculate the percentage that the stock represents of the total portfolio value (including cash). This is a required field.
2.  Assess its risk as 'low', 'medium', or 'high'. If a single stock makes up a large portion of the portfolio (e.g., over 30%), you MUST classify it as 'high' risk due to concentration and recommend selling a portion to diversify.
3.  For 'buy' or 'sell' recommendations, specify a clear amount in rupees to transact.

Portfolio:
{{#each portfolio}}
  - {{ticker}}: {{shares}} shares
{{/each}}

Available Cash: ₹{{cash}}

Market Data (from Pathway):
{{{marketData}}}

Provide your advice in JSON format. Be encouraging and focus on long-term growth and learning. Ensure every stock in the input portfolio has a corresponding entry in the output advice.
`,
});

const analyzePortfolioFlow = ai.defineFlow(
  {
    name: 'analyzePortfolioFlow',
    inputSchema: AnalyzePortfolioInputSchema,
    outputSchema: AnalyzePortfolioOutputSchema,
  },
  async input => {
    try {
      JSON.parse(input.marketData);
    } catch (e) {
      throw new Error('Invalid market data: ' + e);
    }
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Analysis failed to generate output.');
    }
    return {
      advice: output.advice,
      generatedAt: new Date().toISOString(),
    };
  }
);
