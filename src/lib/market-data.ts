// A list of common stocks to provide data for.
export const MOCK_STOCKS = [
  { ticker: "TCS", basePrice: 3850.50 },
  { ticker: "INFY", basePrice: 1650.75 },
  { ticker: "RELIANCE", basePrice: 2900.00 },
  { ticker: "HDFCBANK", basePrice: 1500.25 },
  { ticker: "ICICIBANK", basePrice: 1100.80 },
  { ticker: "BHARTIARTL", basePrice: 1400.10 },
  { ticker: "SBIN", basePrice: 830.55 },
  { ticker: "WIPRO", basePrice: 480.90 },
  { ticker: "ITC", basePrice: 430.20 },
  { ticker: "LT", basePrice: 3600.00 },
];

/**
 * Simulates fetching live market data.
 * Prices will fluctuate slightly on each call to simulate a live market.
 */
export async function getMockMarketData(): Promise<string> {
  const marketData = {
    generatedAt: new Date().toISOString(),
    stocks: MOCK_STOCKS.map(({ ticker, basePrice }) => {
      const fluctuation = (Math.random() - 0.5) * 0.1; // Fluctuate by up to 5%
      const currentPrice = basePrice * (1 + fluctuation);
      const change = currentPrice - basePrice;
      const changePercent = (change / basePrice) * 100;
      
      return {
        ticker,
        price: parseFloat(currentPrice.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        change_percent: parseFloat(changePercent.toFixed(2)),
        volume: `${(Math.random() * 10).toFixed(1)}M`,
        market_cap: `${(basePrice / 100 * (Math.random()*5+1)).toFixed(1)}T`
      };
    }),
  };

  return JSON.stringify(marketData, null, 2);
}
