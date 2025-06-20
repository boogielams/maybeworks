# SIR Dashboard - AI Blockchain Readiness Platform

A comprehensive React-based dashboard for analyzing blockchain networks' AI readiness with integrated prediction markets and betting interfaces.

## 🚀 Features

### Core Analytics
- **SIR Score Framework**: Synthetic Intelligence Readiness scoring system
- **Real-time Data**: Live blockchain metrics from multiple networks
- **AI-Powered Analysis**: Custom weighting based on project requirements
- **Historical Trends**: 1-year performance tracking and analysis

### Prediction Markets
- **Binary Outcomes**: Yes/No predictions on network performance
- **Dynamic Odds**: Real-time odds calculation based on market sentiment
- **Trading Interface**: Polymarket-style betting with USDC integration
- **Price Charts**: Historical odds movement visualization

### Network Coverage
- **Solana** (S-Tier): High-performance L1 with parallel processing
- **Base** (A-Tier): Coinbase's L2 solution
- **Sei** (A-Tier): AI-optimized parallel chain
- **Sui** (A-Tier): Object-centric parallel execution
- **Arbitrum** (B-Tier): Optimistic rollup
- **Optimism** (B-Tier): Ethereum L2 scaling
- **Polygon** (B-Tier): Multi-chain scaling solution
- **Avalanche** (B-Tier): Subnet architecture
- **BNB Chain** (C-Tier): Binance Smart Chain
- **Ethereum** (C-Tier): Base layer with high security

## 🛠️ Technology Stack

- **Frontend**: React 18.2.0
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data Fetching**: Axios
- **Build Tool**: Create React App

## 📊 SIR Score Components

The SIR (Synthetic Intelligence Readiness) score is calculated using 8 key metrics:

1. **Speed** (24%): TPS, finality, latency
2. **Cost** (22%): Gas fees, transaction costs
3. **Reliability** (19%): Uptime, stability
4. **Developer Experience** (15%): Tooling, community
5. **Liquidity** (5%): TVL, trading volume
6. **Security** (5%): Audit history, attack resistance
7. **Parallel Processing** (5%): Concurrent execution capability
8. **Payments** (5%): Payment infrastructure quality

## 🎯 Use Cases

### AI Agent Projects
- High-frequency trading bots
- NFT marketplaces with AI curation
- Cross-chain DeFi yield optimizers
- Real-time prediction markets
- Autonomous trading systems

### Custom Weighting
The dashboard supports custom weighting based on specific project requirements:
- **General**: Balanced weights for most AI projects
- **Trading**: Emphasizes speed, cost, and payments
- **Service**: Prioritizes cost and reliability
- **Enterprise**: Focuses on reliability and security
- **Custom**: AI-optimized weights for specific projects

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sir-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm eject`: Ejects from Create React App

## 📈 Dashboard Sections

### Overview
- AI Readiness Leaderboard
- Network performance metrics
- Real-time data indicators
- Historical performance charts

### Analytics
- Market correlation analysis
- Momentum tracking
- Ecosystem maturity scoring
- Developer activity metrics

### Predictions
- 6-month growth forecasts
- Confidence scoring
- Risk assessment
- Market sentiment analysis

### Betting Interface
- Binary outcome markets
- Dynamic odds calculation
- Position sizing tools
- Price history charts

### Network Details
- Comprehensive network profiles
- Performance breakdowns
- Technical specifications
- Live data quality indicators

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_KEY=your_api_key
REACT_APP_BASE_URL=your_api_base_url
```

### Custom Networks
Add new networks by updating the `mockNetworks` array in `src/App.js`:

```javascript
{
  id: 'new-network',
  name: 'New Network',
  // ... other properties
}
```

## 📊 Data Sources

- **On-chain Metrics**: Real-time blockchain data
- **Market Data**: Price and volume information
- **Developer Activity**: GitHub and community metrics
- **Network Performance**: TPS, gas prices, finality times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React and Tailwind CSS
- Icons from Lucide React
- Charts powered by Recharts
- Inspired by modern DeFi and prediction market platforms

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

---

**Note**: This is a demonstration project. The betting interface is for educational purposes and does not involve real money or actual trading.
