# **App Name**: StockSage

## Core Features:

- Portfolio Input: Allow users to manually enter their stock portfolio including stock ticker and number of shares.
- Stock Data Fetching: Fetch mock stock data using Pathway from a CSV file or sample API to simulate live data.
- AI-Powered Stock Advisor Tool: Employ a generative AI model that acts as a financial tool by suggesting actions (buy/sell/hold/diversify) in plain English based on the user's portfolio and fetched stock data. The AI will reason about current holdings to decide if diversification is appropriate for the risk profile.  Live/updated stock data must influence the outcome.
- Actionable Advice Display: Present the AI-generated advice to the user in a clear, concise format, focusing on actionable steps.
- Usage Tracking: Track and display the number of portfolios analyzed and advice generated for each user, displaying the number of queries and reports that have been run.
- Flexprice Integration: Integrate Flexprice to bill users per advice generated or per portfolio analyzed.

## Style Guidelines:

- Primary color: Slate blue (#708090) for a sense of trust and stability.
- Background color: Very light gray (#F0F0F0) for a clean, modern look.
- Accent color: Muted green (#8FBC8F) to indicate growth and positive action.
- Body and headline font: 'Inter' sans-serif for a neutral, machined, modern feel that works for both headlines and body text.
- Use simple, clear icons to represent stocks, buy/sell actions, and portfolio diversification. Minimize visual clutter.
- A clean, well-organized layout with clear sections for portfolio input, advice display, and usage tracking. Ensure the user can quickly see the AI's conclusions.
- Subtle transitions when fetching stock data and generating advice.  A loading animation keeps the user engaged without distracting them from the content.