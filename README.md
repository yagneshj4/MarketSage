# MarketSage 📈

**AI-Powered Stock Portfolio Analysis for Indian Markets**

Get personalized investment advice powered by Google's Gemini AI. Analyze your portfolio and receive smart buy/sell/hold
recommendations.

**Developer**: Yagnesh Yallapu  
**Contact**: yagneshyallapu@gmail.com  
**Version**: 2.0.0

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup API Key

Create `.env.local` file:

```env
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
```

Get your free API key: https://aistudio.google.com/app/apikey

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:9002

---

## ✨ Features

- 🤖 **AI Analysis** - Powered by Google Gemini 2.5 Flash
- 📊 **Portfolio Tracking** - Manage multiple stocks and cash
- 💡 **Smart Recommendations** - Buy, Sell, Hold, or Diversify advice
- ⚠️ **Risk Assessment** - Low, Medium, High risk levels
- 🇮🇳 **Indian Stocks** - Supports NSE/BSE stocks
- 📱 **Responsive Design** - Works on all devices

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **AI**: Google Gemini AI, Firebase Genkit
- **UI**: shadcn/ui, Radix UI
- **Forms**: React Hook Form, Zod

---

## 📁 Project Structure

```
MarketSage/
├── src/
│   ├── ai/                    # AI flows
│   ├── app/                   # Next.js pages
│   ├── components/
│   │   └── MarketSage.tsx    # Main app component
│   ├── hooks/                # React hooks
│   └── lib/                  # Utilities
├── .env.local               # API keys (create this)
├── package.json
└── README.md
```

---

## 🚀 Deploy to Vercel

```bash
vercel
```

Add environment variable in Vercel dashboard:

- `GOOGLE_GENAI_API_KEY` = Your API key

See `DEPLOY.md` for detailed instructions.

---

## 📝 How to Use

1. **Add Stocks** - Enter ticker, shares, and cost
2. **Add Cash** - Input available cash balance
3. **Analyze** - Click "Analyze Portfolio" button
4. **Review** - Get AI recommendations with reasons
5. **Act** - Follow buy/sell/hold advice

---

## 🎯 Supported Stocks

TCS, INFY, RELIANCE, HDFCBANK, ICICIBANK, BHARTIARTL, SBIN, WIPRO, ITC, LT

---

## 📊 What's New in v2.0.0

- ✅ Consolidated 7 components into 1 file
- ✅ Removed 21 unnecessary files
- ✅ Optimized build size (40 KB)
- ✅ Production-ready deployment
- ✅ Comprehensive documentation
- ✅ Clean codebase structure

---

## 🔧 Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
vercel               # Deploy to Vercel
```

---

## ⚠️ Disclaimer

**Educational purposes only. Not financial advice.**

Always consult a qualified financial advisor before making investment decisions. The developers are not responsible for
any financial losses.

---

## 📄 License

MIT License - see `LICENSE` file

---

## 📧 Contact

**Yagnesh Yallapu**  
Email: yagneshyallapu@gmail.com

---

## 🙏 Acknowledgments

- Google Gemini AI
- Firebase Genkit
- shadcn/ui
- Next.js Team

---

<div align="center">
  <p>Made with ❤️ for Indian Stock Market Enthusiasts</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
