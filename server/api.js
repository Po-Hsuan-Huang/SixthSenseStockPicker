import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ||3001;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
// Cache with 5-minute TTL
let cache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// External data store (from n8n)
let realStockData = null;
let realStockTimestamp = null;
const REAL_DATA_TTL = 10 * 60 * 1000; // 10 minutes (allow some buffer for 5-min cron)

// Stock tickers (same as Python version)
const STOCK_TICKERS = [
    // Tech Giants
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'AVGO',
    // Cloud & Software
    'CRM', 'ADBE', 'NOW', 'INTU', 'TEAM', 'PLTR', 'SNOW', 'DDOG',
    // Semiconductors
    'AMD', 'INTC', 'QCOM', 'MU', 'AMAT', 'LRCX', 'KLAC', 'TSM',
    // Finance
    'JPM', 'BAC', 'GS', 'MS', 'V', 'MA', 'PYPL', 'SQ',
    // Consumer
    'WMT', 'TGT', 'COST', 'NKE', 'SBUX', 'MCD', 'DIS', 'NFLX',
    // Healthcare
    'JNJ', 'UNH', 'PFE', 'ABBV', 'TMO', 'DHR', 'LLY', 'MRNA',
    // Energy
    'XOM', 'CVX', 'COP', 'SLB', 'EOG',
    // Automotive
    'F', 'GM', 'RIVN', 'LCID',
    // E-commerce & Retail
    'SHOP', 'ETSY', 'MELI', 'SPOT',
    // Aerospace & Defense
    'BA', 'LMT', 'RTX', 'NOC',
    // Growth Stocks
    'ROKU', 'COIN', 'RBLX', 'U', 'DASH', 'ABNB',
    // Cloud Infrastructure
    'NET', 'FSLY', 'DOCN',
    // Cybersecurity
    'CRWD', 'ZS', 'PANW', 'FTNT',
    // AI/ML
    'AI', 'SMCI', 'DELL'
];

const SECTORS = [
    'Technology',
    'Financial Services',
    'Consumer Cyclical',
    'Healthcare',
    'Energy',
    'Industrials',
    'Consumer Defensive',
    'Communication Services'
];

/**
 * Generate realistic mock stock data
 */
function generateMockStockData() {
    const stocks = STOCK_TICKERS.map((ticker) => {
        // Generate random but realistic values
        const price = 20 + Math.random() * 500;
        const change_pct = (Math.random() - 0.5) * 10; // -5% to +5%
        const week_change = (Math.random() - 0.5) * 15;
        const month_change = (Math.random() - 0.5) * 25;

        const volume = Math.floor(Math.random() * 100000000) + 1000000; // 1M to 100M
        const market_cap = Math.floor(Math.random() * 3000000000000) + 1000000000; // 1B to 3T

        const operating_margin = (Math.random() - 0.2) * 60; // -12% to 48%
        const revenue_growth = (Math.random() - 0.3) * 100; // -30% to 70%
        const rule_of_40 = operating_margin + revenue_growth;

        const pe_ratio = 5 + Math.random() * 100;
        const beta = 0.5 + Math.random() * 2; // 0.5 to 2.5
        const volatility = 10 + Math.random() * 80; // 10% to 90%
        const debt_to_equity = Math.random() * 200; // 0 to 200

        const sector = SECTORS[Math.floor(Math.random() * SECTORS.length)];

        return {
            ticker,
            price: parseFloat(price.toFixed(2)),
            change_pct: parseFloat(change_pct.toFixed(2)),
            week_change: parseFloat(week_change.toFixed(2)),
            month_change: parseFloat(month_change.toFixed(2)),
            volume,
            market_cap,
            operating_margin: parseFloat(operating_margin.toFixed(2)),
            revenue_growth: parseFloat(revenue_growth.toFixed(2)),
            rule_of_40: parseFloat(rule_of_40.toFixed(2)),
            pe_ratio: parseFloat(pe_ratio.toFixed(2)),
            beta: parseFloat(beta.toFixed(2)),
            volatility: parseFloat(volatility.toFixed(2)),
            debt_to_equity: parseFloat(debt_to_equity.toFixed(2)),
            sector,
        };
    });

    return stocks;
}

/**
 * Get stocks with caching
 */
function getStocks() {
    const now = Date.now();

    // Return real data if available and fresh
    if (realStockData && realStockTimestamp && (now - realStockTimestamp) < REAL_DATA_TTL) {
        console.log('📡 Returning REAL data from n8n');
        return realStockData;
    }

    // Return cached data if still valid
    if (cache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
        console.log('📦 Returning cached data');
        return cache;
    }

    // Generate new data
    console.log('🔄 Generating new stock data');
    cache = generateMockStockData();
    cacheTimestamp = now;

    return cache;
}

// API Routes

/**
 * GET /api/stocks
 * Get all stocks
 */
app.get('/api/stocks', (req, res) => {
    try {
        const stocks = getStocks();
        res.json({
            success: true,
            count: stocks.length,
            data: stocks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * GET /api/stocks/gainers
 * Get top gaining stocks
 */
app.get('/api/stocks/gainers', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const stocks = getStocks();
        const gainers = stocks
            .sort((a, b) => b.change_pct - a.change_pct)
            .slice(0, limit);

        res.json({
            success: true,
            count: gainers.length,
            data: gainers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * GET /api/stocks/most-traded
 * Get most actively traded stocks
 */
app.get('/api/stocks/most-traded', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const stocks = getStocks();
        const mostTraded = stocks
            .sort((a, b) => b.volume - a.volume)
            .slice(0, limit);

        res.json({
            success: true,
            count: mostTraded.length,
            data: mostTraded,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * GET /api/stocks/best-value
 * Get best value stocks (high Rule of 40)
 */
app.get('/api/stocks/best-value', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const minRule40 = parseFloat(req.query.min_rule40) || 30;
        const stocks = getStocks();
        const bestValue = stocks
            .filter(s => s.rule_of_40 >= minRule40)
            .sort((a, b) => b.rule_of_40 - a.rule_of_40)
            .slice(0, limit);

        res.json({
            success: true,
            count: bestValue.length,
            data: bestValue,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * POST /api/cache/clear
 * Clear the cache
 */
app.post('/api/cache/clear', (req, res) => {
    cache = null;
    cacheTimestamp = null;
    res.json({
        success: true,
        message: 'Cache cleared',
    });
});

/**
 * POST /api/update-stocks
 * Receive updated stock data from n8n
 */
app.post('/api/update-stocks', (req, res) => {
    try {
        const data = req.body;

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Invalid data format. Expected array of stocks.');
        }

        console.log(`📥 Received update for ${data.length} stocks from n8n`);

        realStockData = data;
        realStockTimestamp = Date.now();

        // Clear internal cache to ensure next fetch uses this data
        cache = null;

        res.json({
            success: true,
            message: `Successfully updated ${data.length} stocks`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Error updating stocks:', error.message);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Stock Radar API Server running on http://localhost:${PORT}`);
    console.log(`📊 Endpoints:`);
    console.log(`   - GET  /api/stocks           (All stocks)`);
    console.log(`   - GET  /api/stocks/gainers   (Top gainers)`);
    console.log(`   - GET  /api/stocks/most-traded (High volume)`);
    console.log(`   - GET  /api/stocks/best-value (High Rule of 40)`);
    console.log(`   - POST /api/cache/clear      (Clear cache)`);
    console.log(`\n💡 Cache duration: 5 minutes\n`);
});
