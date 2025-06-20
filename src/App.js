import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Star, Zap, Search, Heart, Download, AlertTriangle, Eye, Calculator, BarChart3, Activity, Brain, Target, Sparkles, Info, Wallet, Clock, Users, ChartBar, ArrowRight, DollarSign, BarChart2 } from 'lucide-react';
import solanaLogo from './assets/solana.svg';
import { useBaseData } from './services/blockchainData';
import { useEthereumData } from './services/ethereumData';
import { useSolanaData } from './services/solanaData';
import { usePolygonData } from './services/polygonData';
import { useBSCData } from './services/bscData';
import { useSeiData } from './services/seiData';
import { useSuiData } from './services/suiData';
import { useAllDeveloperData } from './services/developerData';
import { createPortal } from 'react-dom';

// Tooltip Component
const InfoTooltip = ({ children, content, position = 'top' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const ref = React.useRef();

  const handleMouseEnter = (e) => {
    setShowTooltip(true);
    const rect = ref.current.getBoundingClientRect();
    setCoords({ x: rect.left + rect.width / 2, y: rect.top });
  };

  const handleMouseLeave = () => setShowTooltip(false);

  return (
    <span className="relative inline-block" ref={ref}>
      <span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-flex items-center cursor-help"
      >
        {children}
        <Info className="w-4 h-4 text-gray-400 ml-1" />
      </span>
      {showTooltip && typeof window !== 'undefined' && createPortal(
        <div
          className={`fixed z-[9999]`}
          style={{
            left: coords.x,
            top: position === 'top' ? coords.y - 12 : coords.y + 32
          }}
        >
          <div className="bg-gray-900 text-white text-sm rounded-lg p-3 max-w-xs shadow-lg border relative">
            {content}
            <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
              'right-full top-1/2 -translate-y-1/2 -mr-1'
            }`}></div>
          </div>
        </div>,
        document.body
      )}
    </span>
  );
};

// Network Logo Component with actual blockchain logos
const sizePxMap = {
  'text-lg': 24,
  'text-xl': 28,
  'text-2xl': 32,
  'text-3xl': 40,
  'text-4xl': 48
};

const NetworkLogo = ({ network, size = 'text-3xl', className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeMap = {
    'text-lg': 'w-6 h-6',
    'text-xl': 'w-7 h-7',
    'text-2xl': 'w-8 h-8',
    'text-3xl': 'w-10 h-10',
    'text-4xl': 'w-12 h-12'
  };
  const px = sizePxMap[size] || 32;

  const getLogoUrl = (networkId) => {
    const logoUrls = {
      'solana': solanaLogo,
      'ethereum': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
      'polygon': 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
      'arbitrum': 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png',
      'base': 'https://raw.githubusercontent.com/base/brand-kit/main/logo/symbol/Base_Symbol_Blue.svg',
      'sei': 'https://cdn.sei.io/assets/Sei_Symbol_Gradient.svg',
      'sui': 'https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png',
      'optimism': 'https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png',
      'avalanche': 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
      'bsc': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'
    };
    return logoUrls[networkId] || null;
  };

  const logoUrl = getLogoUrl(network.id);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [logoUrl]);

  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gray-100 ${sizeMap[size] || 'w-8 h-8'} ${className}`}
      style={{ width: px, height: px, minWidth: px, minHeight: px }}
    >
      {logoUrl && !imageError && (
        <img
          src={logoUrl}
          alt={`${network.name} logo`}
          width={px}
          height={px}
          className={`object-contain rounded-full absolute top-0 left-0`}
          style={{ width: px, height: px, minWidth: px, minHeight: px, backgroundColor: 'white', zIndex: 1, opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.2s' }}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          draggable={false}
        />
      )}
      {(!logoUrl || imageError || !imageLoaded) && (
        <div
          className={`flex items-center justify-center w-full h-full rounded-full absolute top-0 left-0 animate-pulse`}
          style={{ width: px, height: px, minWidth: px, minHeight: px, zIndex: 2, background: 'inherit' }}
        >
          <span className="text-lg font-bold text-gray-600" style={{ fontSize: Math.max(14, px * 0.6) }}>{network.logoFallback}</span>
        </div>
      )}
    </div>
  );
};

// Enhanced mock data with more detailed metrics
const mockNetworks = [
  {
    id: 'solana',
    name: 'Solana',
    logoFallback: '◉',
    tier: 'S',
    score: 91.3,
    rank: 1,
    change24h: -0.8,
    change7d: 2.1,
    change30d: 8.4,
    speed: 92,
    cost: 88,
    reliability: 92,
    devExp: 95,
    liquidity: 98,
    security: 85,
    parallel: 85,
    payments: 92,
    marketCap: '$89.2B',
    volume24h: '$2.1B',
    tps: 65000,
    finality: '0.8s',
    gasPrice: '$0.00025',
    uptime: 98.1,
    ecosystem: 'Mature',
    founded: 2020,
    consensus: 'Proof of History',
    prediction6m: 90.8,
    marketCorrelation: 0.85,
    developerActivity: 95,
    communitySize: 180000,
    partnerships: 45,
    githubStars: 12500
  },
  {
    id: 'base',
    name: 'Base',
    logoFallback: '🔵',
    tier: 'A',
    score: 87.2,
    rank: 3,
    change24h: 1.5,
    change7d: 3.2,
    change30d: 15.7,
    speed: 75,
    cost: 85,
    reliability: 88,
    devExp: 92,
    liquidity: 89,
    security: 90,
    parallel: 0,
    payments: 88,
    marketCap: '$8.1B',
    volume24h: '$456M',
    tps: 100,
    finality: '2.1s',
    gasPrice: '$0.05',
    uptime: 99.2,
    ecosystem: 'Growing',
    founded: 2023,
    consensus: 'Optimistic Rollup',
    prediction6m: 89.1,
    marketCorrelation: 0.92,
    developerActivity: 78,
    communitySize: 67000,
    partnerships: 31,
    githubStars: 8900
  },
  {
    id: 'sei',
    name: 'Sei',
    logoFallback: '⚡',
    tier: 'A',
    score: 84.1,
    rank: 1,
    change24h: 2.1,
    change7d: 5.3,
    change30d: 12.1,
    speed: 98,
    cost: 95,
    reliability: 89,
    devExp: 65,
    liquidity: 45,
    security: 82,
    parallel: 100,
    payments: 85,
    marketCap: '$2.4B',
    volume24h: '$145M',
    tps: 12000,
    finality: '0.4s',
    gasPrice: '$0.0008',
    uptime: 99.2,
    ecosystem: 'Emerging',
    founded: 2022,
    consensus: 'Tendermint',
    prediction6m: 88.5,
    marketCorrelation: 0.73,
    developerActivity: 72,
    communitySize: 45000,
    partnerships: 23,
    githubStars: 1250
  },
  {
    id: 'sui',
    name: 'Sui',
    logoFallback: '🔷',
    tier: 'A',
    score: 82.3,
    rank: 4,
    change24h: 1.8,
    change7d: 4.2,
    change30d: 18.5,
    speed: 95,
    cost: 90,
    reliability: 85,
    devExp: 75,
    liquidity: 55,
    security: 88,
    parallel: 95,
    payments: 80,
    marketCap: '$3.2B',
    volume24h: '$89M',
    tps: 8000,
    finality: '0.5s',
    gasPrice: '$0.001',
    uptime: 99.5,
    ecosystem: 'Emerging',
    founded: 2022,
    consensus: 'Proof of Stake',
    prediction6m: 86.2,
    marketCorrelation: 0.68,
    developerActivity: 68,
    communitySize: 35000,
    partnerships: 28,
    githubStars: 2100
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    logoFallback: '🔷',
    tier: 'B',
    score: 74.1,
    rank: 5,
    change24h: 0.3,
    change7d: -1.1,
    change30d: 4.2,
    speed: 65,
    cost: 82,
    reliability: 88,
    devExp: 89,
    liquidity: 91,
    security: 92,
    parallel: 0,
    payments: 68,
    marketCap: '$15.3B',
    volume24h: '$892M',
    tps: 40,
    finality: '7.2s',
    gasPrice: '$0.08',
    uptime: 99.1,
    ecosystem: 'Mature',
    founded: 2021,
    consensus: 'Optimistic Rollup',
    prediction6m: 76.3,
    marketCorrelation: 0.88,
    developerActivity: 82,
    communitySize: 95000,
    partnerships: 52,
    githubStars: 6700
  },
  {
    id: 'optimism',
    name: 'Optimism',
    logoFallback: '🟠',
    tier: 'B',
    score: 72.8,
    rank: 6,
    change24h: 0.8,
    change7d: 2.1,
    change30d: 6.8,
    speed: 70,
    cost: 80,
    reliability: 85,
    devExp: 88,
    liquidity: 85,
    security: 90,
    parallel: 0,
    payments: 70,
    marketCap: '$12.1B',
    volume24h: '$567M',
    tps: 45,
    finality: '6.5s',
    gasPrice: '$0.06',
    uptime: 99.3,
    ecosystem: 'Mature',
    founded: 2021,
    consensus: 'Optimistic Rollup',
    prediction6m: 75.1,
    marketCorrelation: 0.85,
    developerActivity: 79,
    communitySize: 82000,
    partnerships: 41,
    githubStars: 5200
  },
  {
    id: 'polygon',
    name: 'Polygon',
    logoFallback: '🟣',
    tier: 'B',
    score: 71.8,
    rank: 7,
    change24h: -1.2,
    change7d: -2.8,
    change30d: 1.5,
    speed: 72,
    cost: 85,
    reliability: 82,
    devExp: 86,
    liquidity: 78,
    security: 84,
    parallel: 0,
    payments: 65,
    marketCap: '$11.7B',
    volume24h: '$623M',
    tps: 350,
    finality: '2.3s',
    gasPrice: '$0.001',
    uptime: 98.8,
    ecosystem: 'Mature',
    founded: 2017,
    consensus: 'Proof of Stake',
    prediction6m: 73.2,
    marketCorrelation: 0.79,
    developerActivity: 73,
    communitySize: 120000,
    partnerships: 67,
    githubStars: 4500
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    logoFallback: '❄️',
    tier: 'B',
    score: 68.5,
    rank: 8,
    change24h: -0.5,
    change7d: 1.2,
    change30d: 3.8,
    speed: 78,
    cost: 75,
    reliability: 80,
    devExp: 82,
    liquidity: 72,
    security: 85,
    parallel: 60,
    payments: 62,
    marketCap: '$8.9B',
    volume24h: '$345M',
    tps: 4500,
    finality: '3s',
    gasPrice: '$0.02',
    uptime: 99.7,
    ecosystem: 'Mature',
    founded: 2020,
    consensus: 'Proof of Stake',
    prediction6m: 70.8,
    marketCorrelation: 0.82,
    developerActivity: 71,
    communitySize: 88000,
    partnerships: 38,
    githubStars: 3800
  },
  {
    id: 'bsc',
    name: 'BNB Chain',
    logoFallback: '🟡',
    tier: 'C',
    score: 65.2,
    rank: 9,
    change24h: 0.2,
    change7d: -0.8,
    change30d: 2.1,
    speed: 85,
    cost: 70,
    reliability: 75,
    devExp: 78,
    liquidity: 88,
    security: 72,
    parallel: 0,
    payments: 75,
    marketCap: '$45.2B',
    volume24h: '$1.8B',
    tps: 300,
    finality: '3s',
    gasPrice: '$0.15',
    uptime: 99.2,
    ecosystem: 'Mature',
    founded: 2020,
    consensus: 'Proof of Staked Authority',
    prediction6m: 67.5,
    marketCorrelation: 0.75,
    developerActivity: 65,
    communitySize: 150000,
    partnerships: 89,
    githubStars: 2800
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    logoFallback: '💎',
    tier: 'C',
    score: 58.2,
    rank: 10,
    change24h: 0.1,
    change7d: -0.5,
    change30d: -2.1,
    speed: 25,
    cost: 35,
    reliability: 95,
    devExp: 98,
    liquidity: 100,
    security: 100,
    parallel: 0,
    payments: 58,
    marketCap: '$445.8B',
    volume24h: '$12.4B',
    tps: 15,
    finality: '15s',
    gasPrice: '$2.50',
    uptime: 99.95,
    ecosystem: 'Dominant',
    founded: 2015,
    consensus: 'Proof of Stake',
    prediction6m: 62.1,
    marketCorrelation: 1.0,
    developerActivity: 98,
    communitySize: 500000,
    partnerships: 200,
    githubStars: 45000
  }
];

const useCaseWeights = {
  general: { speed: 24, cost: 22, reliability: 19, devExp: 15, liquidity: 5, security: 5, parallel: 5, payments: 5 },
  trading: { speed: 20, cost: 20, reliability: 15, devExp: 5, liquidity: 12, security: 8, parallel: 5, payments: 15 },
  service: { speed: 20, cost: 30, reliability: 15, devExp: 15, liquidity: 3, security: 5, parallel: 2, payments: 10 },
  enterprise: { speed: 15, cost: 10, reliability: 25, devExp: 18, liquidity: 3, security: 15, parallel: 2, payments: 7 }
};

const tierColors = {
  S: { bg: 'bg-gradient-to-r from-yellow-400 to-orange-500', text: 'text-white', border: 'border-yellow-400', light: 'bg-yellow-50', accent: '#f59e0b' },
  A: { bg: 'bg-gradient-to-r from-green-400 to-blue-500', text: 'text-white', border: 'border-green-400', light: 'bg-green-50', accent: '#10b981' },
  B: { bg: 'bg-gradient-to-r from-blue-400 to-purple-500', text: 'text-white', border: 'border-blue-400', light: 'bg-blue-50', accent: '#3b82f6' },
  C: { bg: 'bg-gradient-to-r from-gray-400 to-gray-600', text: 'text-white', border: 'border-gray-400', light: 'bg-gray-50', accent: '#6b7280' },
  D: { bg: 'bg-gradient-to-r from-red-400 to-pink-500', text: 'text-white', border: 'border-red-400', light: 'bg-red-50', accent: '#f87171' },
  F: { bg: 'bg-gradient-to-r from-red-600 to-red-800', text: 'text-white', border: 'border-red-600', light: 'bg-red-50', accent: '#dc2626' }
};

// Generate comprehensive historical data
const generateHistoricalData = (networkId, baseScore, days = 365) => {
  const data = [];
  
  // Network-specific starting points and growth patterns
  const networkPatterns = {
    'sei': {
      startScore: 60,
      baseGrowthRate: 0.015,
      recentGrowthRate: 0.25,
      accelerationPoint: 335,
      volatility: 0.5
    },
    'sui': {
      startScore: 55,
      baseGrowthRate: 0.02,
      recentGrowthRate: 0.2,
      accelerationPoint: 320,
      volatility: 0.8
    },
    'base': {
      startScore: 70,
      baseGrowthRate: 0.01,
      firstSpikeDay: 180, // First spike 6 months ago
      secondSpikeDay: 365, // Second spike today
      spikeHeight: 15, // Height of the spikes
      dipDepth: 8, // How much it dips between spikes
      volatility: 0.3
    }
  };
  
  const pattern = networkPatterns[networkId] || {
    startScore: baseScore * 0.8,
    baseGrowthRate: 0.01,
    recentGrowthRate: 0.1,
    accelerationPoint: 300,
    volatility: 0.5
  };
  
  let currentScore = pattern.startScore;
  
  for (let i = 0; i <= days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    // Add small random volatility
    const volatility = (Math.random() - 0.5) * pattern.volatility;
    
    if (networkId === 'base') {
      // Special pattern for Base with two spikes
      const daysFromFirstSpike = Math.abs(i - pattern.firstSpikeDay);
      const daysFromSecondSpike = Math.abs(i - pattern.secondSpikeDay);
      
      // Create gaussian-like spikes
      const firstSpikeEffect = pattern.spikeHeight * Math.exp(-Math.pow(daysFromFirstSpike / 15, 2));
      const secondSpikeEffect = pattern.spikeHeight * Math.exp(-Math.pow(daysFromSecondSpike / 15, 2));
      
      // Create a dip between spikes
      const dipCenter = (pattern.firstSpikeDay + pattern.secondSpikeDay) / 2;
      const dipEffect = pattern.dipDepth * Math.exp(-Math.pow((i - dipCenter) / 30, 2));
      
      currentScore = pattern.startScore + firstSpikeEffect + secondSpikeEffect - dipEffect + volatility;
    } else {
      // Calculate growth rate based on period for other networks
      const growthRate = i >= pattern.accelerationPoint ? pattern.recentGrowthRate : pattern.baseGrowthRate;
      currentScore = Math.max(0, Math.min(100, currentScore + growthRate + volatility));
    }
    
    // For Sei, ensure we hit exactly 86 at the end
    if (networkId === 'sei' && i === days) {
      currentScore = 86;
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      score: Math.round(currentScore * 10) / 10,
      timestamp: date.getTime(),
      volume: Math.random() * 1000000000,
      transactions: Math.floor(Math.random() * 50000),
      activeUsers: Math.floor(Math.random() * 10000)
    });
  }
  
  return data;
};

const SIRDashboard = () => {
  const [selectedUseCase, setSelectedUseCase] = useState('general');
  const [selectedNetwork, setSelectedNetwork] = useState('sei');
  const [timeframe, setTimeframe] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(['sei']);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAlerts, setShowAlerts] = useState(true);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customWeights, setCustomWeights] = useState(null);
  const [costCalculator, setCostCalculator] = useState({
    transactions: 1000,
    frequency: 'daily',
    complexity: 'simple'
  });
  
  const [simulatorConfig, setSimulatorConfig] = useState({
    workload: 'defi',
    duration: 24, // hours
    intensity: 'medium',
    network1: 'sei',
    network2: 'base',
    transactions: 10000,
    complexity: 'medium',
    simulationMode: 'duration' // 'duration' or 'completion'
  });
  
  const [simulationResults, setSimulationResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const [historicalData, setHistoricalData] = useState({});

  // Fetch real Base data
  const { data: baseData, loading: baseLoading, error: baseError } = useBaseData(30000); // Refresh every 30 seconds

  // Fetch real data for all networks
  const { data: ethData, loading: ethLoading, error: ethError } = useEthereumData(30000);
  const { data: solData, loading: solLoading, error: solError } = useSolanaData(30000);
  const { data: polygonData, loading: polygonLoading, error: polygonError } = usePolygonData(30000);
  const { data: bscData, loading: bscLoading, error: bscError } = useBSCData(30000);
  const { data: seiData, loading: seiLoading, error: seiError } = useSeiData(30000);
  const { data: suiData, loading: suiLoading, error: suiError } = useSuiData(30000);

  // Fetch developer data for all networks
  const { data: developerData } = useAllDeveloperData(300000); // 5 minutes

  // Merge real Base data with mock data
  const getNetworksWithLiveData = useCallback(() => {
    if (!baseData && !ethData && !solData && !polygonData && !bscData && !seiData && !suiData) return mockNetworks;
    
    return mockNetworks.map(network => {
      if (network.id === 'base' && baseData) {
        return {
          ...network,
          tps: baseData.tps || network.tps,
          gasPrice: baseData.gasPrice || network.gasPrice,
          finality: baseData.finality || network.finality,
          uptime: baseData.uptime || network.uptime,
          marketCap: baseData.marketCap || network.marketCap,
          volume24h: baseData.volume24h || network.volume24h,
          change24h: baseData.priceChange24h || network.change24h,
          lastUpdated: baseData.lastUpdated,
          isLiveData: true,
          dataQuality: baseData.dataQuality
        };
      }
      if (network.id === 'ethereum' && ethData) {
        return {
          ...network,
          tps: ethData.tps || network.tps,
          gasPrice: ethData.gasPrice || network.gasPrice,
          finality: ethData.finality || network.finality,
          uptime: ethData.uptime || network.uptime,
          marketCap: ethData.marketCap || network.marketCap,
          volume24h: ethData.volume24h || network.volume24h,
          change24h: ethData.priceChange24h || network.change24h,
          lastUpdated: ethData.lastUpdated,
          isLiveData: true,
          dataQuality: ethData.dataQuality
        };
      }
      if (network.id === 'solana' && solData) {
        return {
          ...network,
          tps: solData.tps || network.tps,
          gasPrice: solData.gasPrice || network.gasPrice,
          finality: solData.finality || network.finality,
          uptime: solData.uptime || network.uptime,
          marketCap: solData.marketCap || network.marketCap,
          volume24h: solData.volume24h || network.volume24h,
          change24h: solData.priceChange24h || network.change24h,
          lastUpdated: solData.lastUpdated,
          isLiveData: true,
          dataQuality: solData.dataQuality
        };
      }
      if (network.id === 'polygon' && polygonData) {
        return {
          ...network,
          tps: polygonData.tps || network.tps,
          gasPrice: polygonData.gasPrice || network.gasPrice,
          finality: polygonData.finality || network.finality,
          uptime: polygonData.uptime || network.uptime,
          marketCap: polygonData.marketCap || network.marketCap,
          volume24h: polygonData.volume24h || network.volume24h,
          change24h: polygonData.priceChange24h || network.change24h,
          lastUpdated: polygonData.lastUpdated,
          isLiveData: true,
          dataQuality: polygonData.dataQuality
        };
      }
      if (network.id === 'bsc' && bscData) {
        return {
          ...network,
          tps: bscData.tps || network.tps,
          gasPrice: bscData.gasPrice || network.gasPrice,
          finality: bscData.finality || network.finality,
          uptime: bscData.uptime || network.uptime,
          marketCap: bscData.marketCap || network.marketCap,
          volume24h: bscData.volume24h || network.volume24h,
          change24h: bscData.priceChange24h || network.change24h,
          lastUpdated: bscData.lastUpdated,
          isLiveData: true,
          dataQuality: bscData.dataQuality
        };
      }
      if (network.id === 'sei' && seiData) {
        return {
          ...network,
          tps: seiData.tps || network.tps,
          gasPrice: seiData.gasPrice || network.gasPrice,
          finality: seiData.finality || network.finality,
          uptime: seiData.uptime || network.uptime,
          marketCap: seiData.marketCap || network.marketCap,
          volume24h: seiData.volume24h || network.volume24h,
          change24h: seiData.priceChange24h || network.change24h,
          lastUpdated: seiData.lastUpdated,
          isLiveData: true,
          dataQuality: seiData.dataQuality
        };
      }
      if (network.id === 'sui' && suiData) {
        return {
          ...network,
          tps: suiData.tps || network.tps,
          gasPrice: suiData.gasPrice || network.gasPrice,
          finality: suiData.finality || network.finality,
          uptime: suiData.uptime || network.uptime,
          marketCap: suiData.marketCap || network.marketCap,
          volume24h: suiData.volume24h || network.volume24h,
          change24h: suiData.priceChange24h || network.change24h,
          lastUpdated: suiData.lastUpdated,
          isLiveData: true,
          dataQuality: suiData.dataQuality
        };
      }
      return network;
    });
  }, [baseData, ethData, solData, polygonData, bscData, seiData, suiData]);

  useEffect(() => {
    const data = {};
    getNetworksWithLiveData().forEach(network => {
      data[network.id] = generateHistoricalData(network.id, network.score, 365);
    });
    setHistoricalData(data);
  }, [getNetworksWithLiveData]);

  // AI Analysis Functions
  const analyzeProject = (query) => {
    // Simulated AI analysis - in real implementation, this would call an LLM API
    const analysis = {
      'high-frequency trading bot': {
        analysis: "Your HFT bot requires ultra-low latency and consistent execution. Speed and reliability are critical, while cost optimization matters for profitability at scale.",
        weights: { speed: 35, cost: 25, reliability: 20, devExp: 10, liquidity: 5, security: 3, parallel: 1, payments: 1 },
        projectType: "High-Frequency Trading Bot"
      },
      'nft marketplace': {
        analysis: "NFT marketplaces need robust infrastructure for high transaction volumes, good developer tools for complex smart contracts, and strong security for valuable assets.",
        weights: { speed: 20, cost: 15, reliability: 25, devExp: 20, liquidity: 5, security: 10, parallel: 3, payments: 2 },
        projectType: "NFT Marketplace"
      },
      'defi': {
        analysis: "DeFi applications require deep liquidity, battle-tested security, and reliable execution. Developer experience is crucial for complex financial protocols.",
        weights: { speed: 15, cost: 10, reliability: 20, devExp: 15, liquidity: 25, security: 12, parallel: 2, payments: 1 },
        projectType: "DeFi Application"
      },
      'prediction market': {
        analysis: "Prediction markets need real-time data processing, high reliability for accurate settlements, and good liquidity for market makers.",
        weights: { speed: 25, cost: 20, reliability: 25, devExp: 10, liquidity: 15, security: 3, parallel: 1, payments: 1 },
        projectType: "Prediction Market"
      }
    };

    // Simple keyword matching - in reality, this would be much more sophisticated
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('trading') || queryLower.includes('hft') || queryLower.includes('arbitrage')) {
      return analysis['high-frequency trading bot'];
    }
    if (queryLower.includes('nft') || queryLower.includes('marketplace') || queryLower.includes('collectible')) {
      return analysis['nft marketplace'];
    }
    if (queryLower.includes('defi') || queryLower.includes('yield') || queryLower.includes('lending') || queryLower.includes('swap')) {
      return analysis['defi'];
    }
    if (queryLower.includes('prediction') || queryLower.includes('betting') || queryLower.includes('oracle')) {
      return analysis['prediction market'];
    }
    
    // Default analysis for unrecognized queries
    return {
      analysis: "Based on your project description, I've created a balanced weighting that prioritizes performance and reliability while considering your specific requirements.",
      weights: { speed: 24, cost: 22, reliability: 19, devExp: 15, liquidity: 8, security: 7, parallel: 3, payments: 2 },
      projectType: "Custom AI Agent Project"
    };
  };

  const handleAiAnalysis = async () => {
    if (!aiQuery.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysis = analyzeProject(aiQuery);
    setAiResponse(analysis);
    setIsAnalyzing(false);
  };

  const applyAiWeights = () => {
    if (aiResponse) {
      setCustomWeights(aiResponse.weights);
      setSelectedUseCase('custom');
    }
  };

  const resetToGeneral = () => {
    setCustomWeights(null);
    setSelectedUseCase('general');
    setAiResponse(null);
    setAiQuery('');
  };

  // Workload Simulator Functions
  const workloadTypes = {
    defi: {
      name: 'DeFi Trading',
      description: 'High-frequency trading with complex smart contracts',
      characteristics: {
        transactionSize: 'medium',
        frequency: 'high',
        complexity: 'high',
        failureTolerance: 'low'
      }
    },
    nft: {
      name: 'NFT Marketplace',
      description: 'Mint, trade, and transfer NFTs with metadata',
      characteristics: {
        transactionSize: 'large',
        frequency: 'medium',
        complexity: 'medium',
        failureTolerance: 'medium'
      }
    },
    gaming: {
      name: 'Gaming',
      description: 'Real-time gaming transactions and state updates',
      characteristics: {
        transactionSize: 'small',
        frequency: 'very_high',
        complexity: 'low',
        failureTolerance: 'medium'
      }
    },
    payments: {
      name: 'Payments',
      description: 'Simple payment transfers and settlements',
      characteristics: {
        transactionSize: 'small',
        frequency: 'high',
        complexity: 'low',
        failureTolerance: 'very_low'
      }
    },
    ai: {
      name: 'AI Agent Operations',
      description: 'AI agent interactions and autonomous transactions',
      characteristics: {
        transactionSize: 'variable',
        frequency: 'very_high',
        complexity: 'high',
        failureTolerance: 'low'
      }
    }
  };

  const intensityMultipliers = {
    low: { tps: 0.3, failureRate: 0.5, cost: 0.7 },
    medium: { tps: 1.0, failureRate: 1.0, cost: 1.0 },
    high: { tps: 2.0, failureRate: 1.5, cost: 1.3 },
    extreme: { tps: 3.0, failureRate: 2.0, cost: 1.6 }
  };

  const complexityMultipliers = {
    simple: { gasMultiplier: 1.0, failureRate: 0.8, processingTime: 1.0 },
    medium: { gasMultiplier: 2.0, failureRate: 1.0, processingTime: 1.5 },
    complex: { gasMultiplier: 5.0, failureRate: 1.3, processingTime: 2.0 },
    very_complex: { gasMultiplier: 10.0, failureRate: 1.6, processingTime: 3.0 }
  };

  const simulateNetwork = (network) => {
    const intensity = intensityMultipliers[simulatorConfig.intensity];
    const complexity = complexityMultipliers[simulatorConfig.complexity];

    // Base success rate adjusted by workload
    const baseSuccessRate = network.reliability / 100;
    const effectiveSuccessRate = Math.min(1, baseSuccessRate * (1 / intensity.failureRate) * (1 / complexity.failureRate));

    const successfulTransactions = Math.round(simulatorConfig.transactions * effectiveSuccessRate);
    const failedTransactions = simulatorConfig.transactions - successfulTransactions;

    // Effective TPS is a portion of the network's max TPS, adjusted for intensity
    const effectiveTPS = Math.round(network.tps * (1 - (1 - effectiveSuccessRate) * 0.5) * Math.min(1, intensity.tps * 0.5));

    const gasPrice = parseFloat(network.gasPrice.replace('$', ''));
    const totalCost = (successfulTransactions * gasPrice * complexity.gasMultiplier * intensity.cost).toFixed(2);
    
    const performanceScore = Math.round(
      (effectiveSuccessRate * 40) +
      (Math.min(1, effectiveTPS / network.tps) * 30) +
      (Math.max(0, 1 - (gasPrice / 0.1)) * 30)
    );
    
    let metrics = {
      successRate: (effectiveSuccessRate * 100).toFixed(1),
      effectiveTPS: effectiveTPS,
      totalCost,
      performanceScore,
      successfulTransactions,
      failedTransactions,
    };

    if (simulatorConfig.simulationMode === 'duration') {
      metrics.costPerHour = (totalCost / simulatorConfig.duration).toFixed(2);
      metrics.avgProcessingTime = (parseFloat(network.finality.replace('s', '')) * complexity.processingTime).toFixed(3);
    } else { // completion mode
      metrics.completionTime = successfulTransactions > 0 && effectiveTPS > 0 ? successfulTransactions / effectiveTPS : 0;
    }
    
    return { network, metrics };
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    setSimulationResults(null);
    
    const network1 = rankedNetworks.find(n => n.id === simulatorConfig.network1);
    const network2 = rankedNetworks.find(n => n.id === simulatorConfig.network2);
    
    // Workload characteristics
    const workload = {
      type: simulatorConfig.workload,
      duration: simulatorConfig.duration,
      intensity: simulatorConfig.intensity,
      transactions: simulatorConfig.transactions,
      complexity: simulatorConfig.complexity
    };
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const results = {
      workload: workload,
      config: simulatorConfig,
      network1: simulateNetwork(network1),
      network2: simulateNetwork(network2)
    };
    
    setSimulationResults(results);
    setIsSimulating(false);
  };

  const generateTimelineData = (totalTransactions, successRate, durationHours) => {
    const data = [];
    const intervals = 24; // 24 data points for the timeline
    const transactionsPerInterval = totalTransactions / intervals;
    
    for (let i = 0; i < intervals; i++) {
      const hour = (i / intervals) * durationHours;
      const successful = Math.round(transactionsPerInterval * successRate);
      const failed = Math.round(transactionsPerInterval * (1 - successRate));
      
      data.push({
        hour: hour.toFixed(1),
        successful,
        failed,
        total: successful + failed,
        successRate: (successful / (successful + failed) * 100).toFixed(1)
      });
    }
    
    return data;
  };

  const calculateUseCaseScore = useCallback((network, useCase) => {
    const weights = useCase === 'custom' ? customWeights : useCaseWeights[useCase];
    if (!weights) return network.score;
    
    return (
      (network.speed * weights.speed +
       network.cost * weights.cost +
       network.reliability * weights.reliability +
       network.devExp * weights.devExp +
       network.liquidity * weights.liquidity +
       network.security * weights.security +
       network.parallel * weights.parallel +
       network.payments * weights.payments) / 100
    ).toFixed(1);
  }, [customWeights]);

  const rankedNetworks = useMemo(() => {
    let filtered = getNetworksWithLiveData();
    if (searchTerm) {
      filtered = filtered.filter(network => 
        network.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered
      .map(network => ({
        ...network,
        adjustedScore: parseFloat(calculateUseCaseScore(network, selectedUseCase))
      }))
      .sort((a, b) => b.adjustedScore - a.adjustedScore)
      .map((network, index) => ({ ...network, adjustedRank: index + 1 }));
  }, [selectedUseCase, searchTerm, calculateUseCaseScore, getNetworksWithLiveData]);

  const selectedNetworkData = rankedNetworks.find(n => n.id === selectedNetwork);

  // Advanced analytics calculations
  const trendAnalysis = useMemo(() => {
    return rankedNetworks.map(network => ({
      ...network,
      momentum: (network.change7d + network.change30d) / 2,
      volatility: Math.abs(network.change24h) + Math.abs(network.change7d - network.change24h),
      growthRate: network.change30d / 30
    })).sort((a, b) => b.momentum - a.momentum);
  }, [rankedNetworks]);

  const marketCorrelationData = useMemo(() => {
    return rankedNetworks.map(network => ({
      name: network.name,
      sirScore: network.adjustedScore,
      marketCap: parseFloat(network.marketCap.replace(/[$B]/g, '')),
      correlation: network.marketCorrelation
    }));
  }, [rankedNetworks]);

  const formatChange = (change) => {
    const isPositive = change > 0;
    const Icon = isPositive ? TrendingUp : change < 0 ? TrendingDown : Minus;
    const colorClass = isPositive ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-500';
    
    return (
      <div className={`flex items-center gap-1 ${colorClass}`}>
        <Icon className="w-4 h-4" />
        <span>{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  const getDimensionData = (network) => [
    { subject: 'Speed', value: network.speed, fullMark: 100 },
    { subject: 'Cost', value: network.cost, fullMark: 100 },
    { subject: 'Reliability', value: network.reliability, fullMark: 100 },
    { subject: 'Dev Experience', value: network.devExp, fullMark: 100 },
    { subject: 'Liquidity', value: network.liquidity, fullMark: 100 },
    { subject: 'Security', value: network.security, fullMark: 100 },
    { subject: 'Parallel', value: network.parallel, fullMark: 100 },
    { subject: 'Payments', value: network.payments, fullMark: 100 }
  ];

  const toggleFavorite = (networkId) => {
    setFavorites(prev => 
      prev.includes(networkId) 
        ? prev.filter(id => id !== networkId)
        : [...prev, networkId]
    );
  };

  const calculateCosts = () => {
    const multiplier = costCalculator.frequency === 'daily' ? 365 : 
                     costCalculator.frequency === 'weekly' ? 52 : 12;
    const complexityMultiplier = costCalculator.complexity === 'simple' ? 1 : 
                                costCalculator.complexity === 'medium' ? 5 : 20;
    
    return rankedNetworks.map(network => {
      const gasPrice = parseFloat(network.gasPrice.replace('$', ''));
      const annualCost = costCalculator.transactions * gasPrice * complexityMultiplier * multiplier;
      return {
        ...network,
        annualCost,
        monthlyCost: annualCost / 12,
        dailyCost: annualCost / 365
      };
    }).sort((a, b) => a.annualCost - b.annualCost);
  };

  const costAnalysis = calculateCosts();

  const getAlerts = () => {
    const alerts = [];
    rankedNetworks.forEach(network => {
      if (network.change24h < -5) {
        alerts.push({
          type: 'warning',
          title: `${network.name} Score Declined`,
          message: `SIR score dropped ${Math.abs(network.change24h).toFixed(1)}% in 24h`,
          network: network.id
        });
      }
      if (network.uptime < 99) {
        alerts.push({
          type: 'error',
          title: `${network.name} Uptime Alert`,
          message: `Network uptime below 99% (${network.uptime}%)`,
          network: network.id
        });
      }
      if (network.change30d > 10) {
        alerts.push({
          type: 'success',
          title: `${network.name} Strong Growth`,
          message: `SIR score improved ${network.change30d.toFixed(1)}% this month`,
          network: network.id
        });
      }
    });
    return alerts;
  };

  const alerts = getAlerts();

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        active 
          ? 'bg-blue-500 text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{label}</span>
    </button>
  );

  // Prediction Context Data
  const predictionContextData = {
    sei: {
      investmentThesis: {
        valuePropositions: [
          "Purpose-built for AI and ML workloads with parallel processing",
          "Low latency finality ideal for real-time AI interactions",
          "Native support for complex computational tasks"
        ],
        competitiveAdvantages: [
          "Fastest parallel processing among L1 chains",
          "Purpose-built for AI/ML workloads",
          "Strong institutional backing and partnerships"
        ],
        marketPositioning: "Leading next-gen L1 optimized for AI/ML applications"
      },
      catalysts: [
        {
          title: "Parallel EVM Launch",
          description: "Native support for parallel execution of EVM contracts",
          timeline: "Q2 2024",
          impact: "HIGH",
          details: "Will enable parallel processing for AI model inference"
        },
        {
          title: "AI Compute Layer",
          description: "Dedicated infrastructure for AI model deployment",
          timeline: "Q3 2024",
          impact: "HIGH",
          details: "Direct integration with popular ML frameworks"
        },
        {
          title: "Developer Tooling Expansion",
          description: "Enhanced SDK and API support for AI/ML workloads",
          timeline: "Ongoing",
          impact: "MEDIUM",
          details: "Simplified integration for AI developers"
        }
      ],
      risks: [
        {
          type: "Technical",
          title: "Parallel Processing Optimization",
          severity: "MEDIUM",
          likelihood: "LOW",
          mitigation: "Active development of parallel EVM implementation"
        },
        {
          type: "Market",
          title: "AI Chain Competition",
          severity: "HIGH",
          likelihood: "MEDIUM",
          mitigation: "First-mover advantage in parallel processing"
        },
        {
          type: "Regulatory",
          title: "AI Compliance Requirements",
          severity: "MEDIUM",
          likelihood: "MEDIUM",
          mitigation: "Proactive compliance framework development"
        }
      ],
      milestones: [
        {
          date: "2024 Q2",
          event: "Parallel EVM Launch",
          significance: "Enable parallel execution of AI workloads"
        },
        {
          date: "2024 Q3",
          event: "AI Compute Layer Release",
          significance: "Native support for AI model deployment"
        },
        {
          date: "2024 Q4",
          event: "Major Exchange Integrations",
          significance: "Increased liquidity and market access"
        }
      ],
      methodology: {
        confidence: 85,
        dataQuality: "HIGH",
        historicalAccuracy: 92,
        sources: [
          "On-chain metrics",
          "Developer activity",
          "Market correlation analysis",
          "Technical roadmap progress"
        ]
      }
    },
    sui: {
      investmentThesis: {
        valuePropositions: [
          "Object-centric parallel execution",
          "Native support for complex state management",
          "Optimized for data-intensive applications"
        ],
        competitiveAdvantages: [
          "Unique object-centric architecture",
          "Strong institutional partnerships",
          "Advanced parallel processing capabilities"
        ],
        marketPositioning: "Innovative L1 with unique parallel processing model"
      },
      catalysts: [
        {
          title: "zkProof Integration",
          description: "Zero-knowledge proof system for AI model verification",
          timeline: "Q3 2024",
          impact: "HIGH",
          details: "Enhanced privacy for AI computations"
        },
        {
          title: "Sui Move Evolution",
          description: "Enhanced Move language features for AI workloads",
          timeline: "Q2 2024",
          impact: "MEDIUM",
          details: "Improved developer experience for AI applications"
        }
      ],
      risks: [
        {
          type: "Technical",
          title: "Novel Architecture Adoption",
          severity: "HIGH",
          likelihood: "MEDIUM",
          mitigation: "Extensive developer education and tooling"
        },
        {
          type: "Market",
          title: "Developer Ecosystem Growth",
          severity: "MEDIUM",
          likelihood: "MEDIUM",
          mitigation: "Active developer incentive programs"
        }
      ],
      milestones: [
        {
          date: "2024 Q2",
          event: "Move Language Updates",
          significance: "Enhanced AI workload support"
        },
        {
          date: "2024 Q3",
          event: "zkProof System Launch",
          significance: "Privacy-preserving AI computation"
        }
      ],
      methodology: {
        confidence: 82,
        dataQuality: "HIGH",
        historicalAccuracy: 88,
        sources: [
          "On-chain metrics",
          "Developer activity",
          "Technical documentation",
          "Community feedback"
        ]
      }
    }
  };

  // Prediction Context Component
  const PredictionContext = ({ chainId }) => {
    const context = predictionContextData[chainId];
    if (!context) return null;

    const RiskBadge = ({ level }) => {
      const colors = {
        HIGH: 'bg-red-100 text-red-800',
        MEDIUM: 'bg-yellow-100 text-yellow-800',
        LOW: 'bg-green-100 text-green-800'
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
          {level}
        </span>
      );
    };

    const ImpactBadge = ({ level }) => {
      const colors = {
        HIGH: 'bg-purple-100 text-purple-800',
        MEDIUM: 'bg-blue-100 text-blue-800',
        LOW: 'bg-gray-100 text-gray-800'
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
          {level}
        </span>
      );
    };

    const ConfidenceMeter = ({ value }) => (
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    );

    return (
      <div className="space-y-6">
        {/* Investment Thesis */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Investment Thesis</h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Value Propositions</h5>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {context.investmentThesis.valuePropositions.map((prop, i) => (
                  <li key={i}>{prop}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Competitive Advantages</h5>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {context.investmentThesis.competitiveAdvantages.map((adv, i) => (
                  <li key={i}>{adv}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Market Positioning</h5>
              <p className="text-gray-600">{context.investmentThesis.marketPositioning}</p>
            </div>
          </div>
        </div>

        {/* Catalysts & Opportunities */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Catalysts & Opportunities</h4>
          <div className="space-y-4">
            {context.catalysts.map((catalyst, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{catalyst.title}</h5>
                  <ImpactBadge level={catalyst.impact} />
                </div>
                <p className="text-gray-600 mb-2">{catalyst.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600">{catalyst.timeline}</span>
                  <span className="text-gray-500">{catalyst.details}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Risk Factors</h4>
          <div className="space-y-4">
            {context.risks.map((risk, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase">{risk.type}</span>
                    <h5 className="font-medium text-gray-900">{risk.title}</h5>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiskBadge level={risk.severity} />
                    <RiskBadge level={risk.likelihood} />
                  </div>
                </div>
                <p className="text-gray-600">{risk.mitigation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline & Milestones */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Timeline & Milestones</h4>
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200"></div>
            <div className="space-y-6">
              {context.milestones.map((milestone, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-2.5 top-4 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2"></div>
                  <div className="text-sm font-medium text-blue-600 mb-1">{milestone.date}</div>
                  <div className="font-medium text-gray-900">{milestone.event}</div>
                  <div className="text-gray-600">{milestone.significance}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Prediction Methodology</h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Confidence Score</span>
                <span className="font-medium text-gray-900">{context.methodology.confidence}%</span>
              </div>
              <ConfidenceMeter value={context.methodology.confidence} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Data Quality</span>
                <div className="font-medium text-gray-900">{context.methodology.dataQuality}</div>
              </div>
              <div>
                <span className="text-gray-600">Historical Accuracy</span>
                <div className="font-medium text-gray-900">{context.methodology.historicalAccuracy}%</div>
              </div>
            </div>
            <div>
              <span className="text-gray-600">Data Sources</span>
              <ul className="mt-2 space-y-1">
                {context.methodology.sources.map((source, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    {source}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add Modal component at the top level
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    
    return createPortal(
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <div className="fixed inset-0 transition-opacity" onClick={onClose}>
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div className="relative inline-block w-full max-w-2xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            {children}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // Add NetworkAnalysisModal component
  const NetworkAnalysisModal = ({ network, isOpen, onClose }) => {
    if (!network) return null;
    
    const growth = network.prediction6m - network.adjustedScore;
    const confidence = (
      (network.developerActivity / 100 * 0.3) +
      (network.marketCorrelation * 0.3) +
      (network.reliability / 100 * 0.4)
    ) * 100;

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NetworkLogo network={network} size="text-3xl" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{network.name}</h3>
                <div className="text-sm text-gray-500">6-Month Growth Forecast</div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Prediction Summary */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Current Score</div>
              <div className="text-lg font-bold text-gray-900">{network.adjustedScore}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Predicted Score</div>
              <div className="text-lg font-bold text-gray-900">{network.prediction6m}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Growth</div>
              <div className={`text-lg font-bold ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growth > 0 ? '+' : ''}{growth.toFixed(1)}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Confidence</div>
              <div className="text-lg font-bold text-gray-900">{confidence.toFixed(0)}%</div>
            </div>
          </div>

          {/* Analysis Sections */}
          <div className="grid grid-cols-2 gap-4">
            {/* Growth Drivers */}
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Growth Drivers</h4>
              <ul className="space-y-2 text-sm">
                {network.developerActivity > 80 && (
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Strong developer ecosystem with {network.developerActivity}% activity growth</span>
                  </li>
                )}
                {network.communitySize > 100000 && (
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Large and engaged community ({(network.communitySize/1000).toFixed(1)}k members)</span>
                  </li>
                )}
                {network.parallel > 90 && (
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Superior parallel processing capabilities</span>
                  </li>
                )}
                {network.reliability > 95 && (
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Exceptional network reliability ({network.reliability}%)</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Opportunities</h4>
              <ul className="space-y-2 text-sm">
                {network.marketShare < 10 && (
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Significant room for market share growth</span>
                  </li>
                )}
                {network.change30d > 5 && (
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Strong recent momentum (+{network.change30d}% 30d)</span>
                  </li>
                )}
                {network.developerActivity > 70 && network.marketShare < 15 && (
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>High developer interest relative to market share</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Challenges */}
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Challenges</h4>
              <ul className="space-y-2 text-sm">
                {network.marketCorrelation > 0.8 && (
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <span>High correlation with market movements</span>
                  </li>
                )}
                {network.reliability < 90 && (
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <span>Network reliability needs improvement</span>
                  </li>
                )}
                {network.communitySize < 50000 && (
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <span>Limited community size could slow adoption</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Technical Analysis */}
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Technical Analysis</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>TPS: {network.parallel.toFixed(1)}k</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Reliability: {network.reliability}%</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Market Correlation: {network.marketCorrelation.toFixed(2)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  // Add expanded panels state
  const [expandedPanels, setExpandedPanels] = useState(new Set());

  // Add toggle function
  const togglePanel = (networkId) => {
    setExpandedPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(networkId)) {
        newSet.delete(networkId);
      } else {
        newSet.add(networkId);
      }
      return newSet;
    });
  };

  // Update the mock betting markets to be asset-specific
  const mockBettingMarkets = {
    ethereum: {
      marketId: 'eth-ai-score-q4',
      chainId: 'ethereum',
      question: 'Will Ethereum\'s AI score exceed 65 by Q4 2025?',
      outcomes: [
        { name: 'Yes', odds: 1.85, volume: 156000 },
        { name: 'No', odds: 2.25, volume: 142000 }
      ],
      totalVolume: 298000,
      expiryDate: new Date('2025-12-31'),
      status: 'active'
    },
    solana: {
      marketId: 'sol-ai-score-q4',
      chainId: 'solana',
      question: 'Will Solana\'s AI score exceed 95 by Q4 2025?',
      outcomes: [
        { name: 'Yes', odds: 2.15, volume: 134000 },
        { name: 'No', odds: 1.75, volume: 128000 }
      ],
      totalVolume: 262000,
      expiryDate: new Date('2025-12-31'),
      status: 'active'
    },
    base: {
      marketId: 'base-ai-score-q4',
      chainId: 'base',
      question: 'Will Base\'s AI score exceed 90 by Q4 2025?',
      outcomes: [
        { name: 'Yes', odds: 1.95, volume: 98000 },
        { name: 'No', odds: 2.05, volume: 92000 }
      ],
      totalVolume: 190000,
      expiryDate: new Date('2025-12-31'),
      status: 'active'
    },
    sei: {
      marketId: 'sei-ai-score-q4',
      chainId: 'sei',
      question: 'Will Sei\'s AI score exceed 90 by Q4 2025?',
      outcomes: [
        { name: 'Yes', odds: 1.75, volume: 112000 },
        { name: 'No', odds: 2.35, volume: 108000 }
      ],
      totalVolume: 220000,
      expiryDate: new Date('2025-12-31'),
      status: 'active'
    },
    sui: {
      marketId: 'sui-ai-score-q4',
      chainId: 'sui',
      question: 'Will Sui\'s AI score exceed 88 by Q4 2025?',
      outcomes: [
        { name: 'Yes', odds: 1.90, volume: 89000 },
        { name: 'No', odds: 2.10, volume: 86000 }
      ],
      totalVolume: 175000,
      expiryDate: new Date('2025-12-31'),
      status: 'active'
    },
    arbitrum: {
      marketId: 'arb-ai-score-q4',
      chainId: 'arbitrum',
      question: 'Will Arbitrum\'s AI score exceed 78 by Q4 2025?',
      outcomes: [
        { name: 'Yes', odds: 2.05, volume: 76000 },
        { name: 'No', odds: 1.85, volume: 72000 }
      ],
      totalVolume: 148000,
      expiryDate: new Date('2025-12-31'),
      status: 'active'
    },
    optimism: {
      marketId: 'opt-ai-score-q4',
      chainId: 'optimism',
      question: 'Will Optimism\'s AI score exceed 78 by Q4 2025?',
      outcomes: [
        { name: 'Yes', odds: 2.10, volume: 68000 },
        { name: 'No', odds: 1.80, volume: 65000 }
      ],
      totalVolume: 133000,
      expiryDate: new Date('2025-12-31'),
      status: 'active'
    },
    polygon: {
      marketId: 'pol-ai-score-q4',
      chainId: 'polygon',
      question: 'Will Polygon\'s AI score exceed 75 by Q4 2025?',
      outcomes: [
        { name: 'Yes', odds: 2.20, volume: 82000 },
        { name: 'No', odds: 1.70, volume: 78000 }
      ],
      totalVolume: 160000,
      expiryDate: new Date('2025-12-31'),
      status: 'active'
    },
    avalanche: {
      marketId: 'avax-ai-score-q4',
      chainId: 'avalanche',
      question: 'Will Avalanche\'s AI score exceed 72 by Q4 2025?',
      outcomes: [
        { name: 'Yes', odds: 2.25, volume: 54000 },
        { name: 'No', odds: 1.65, volume: 52000 }
      ],
      totalVolume: 106000,
      expiryDate: new Date('2025-12-31'),
      status: 'active'
    },
    bsc: {
      marketId: 'bsc-ai-score-q4',
      chainId: 'bsc',
      question: 'Will BNB Chain\'s AI score exceed 68 by Q4 2025?',
      outcomes: [
        { name: 'Yes', odds: 2.30, volume: 95000 },
        { name: 'No', odds: 1.60, volume: 92000 }
      ],
      totalVolume: 187000,
      expiryDate: new Date('2025-12-31'),
      status: 'active'
    }
  };

  // Update the BettingInterface component with cleaner design
  const BettingInterface = ({ network, prediction }) => {
    const [betAmount, setBetAmount] = useState('');
    const [selectedOutcome, setSelectedOutcome] = useState(null);
    const market = mockBettingMarkets[network.id] || mockBettingMarkets.ethereum;
    
    const calculatePotentialPayout = () => {
      if (!betAmount || !selectedOutcome) return 0;
      return (parseFloat(betAmount) * selectedOutcome.odds).toFixed(2);
    };

    const calculateProfit = () => {
      if (!betAmount || !selectedOutcome) return 0;
      return (parseFloat(betAmount) * selectedOutcome.odds - parseFloat(betAmount)).toFixed(2);
    };

    return (
      <div className="bg-gray-50 rounded-xl border p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Prediction Market</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Expires {market.expiryDate.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4 border">
          <p className="font-semibold text-center text-gray-800">{market.question}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {market.outcomes.map((outcome) => (
            <button
              key={outcome.name}
              onClick={() => setSelectedOutcome(outcome)}
              className={`p-4 rounded-xl text-center transition-all duration-200 ${
                selectedOutcome?.name === outcome.name
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white border hover:bg-gray-100'
              }`}
            >
              <div className="font-bold text-xl">{outcome.name}</div>
              <div className="text-lg">{outcome.odds.toFixed(2)}x</div>
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter bet amount"
            />
          </div>

          {selectedOutcome && betAmount > 0 && (
            <div className="bg-white rounded-lg p-4 border grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-500">Potential Payout</div>
                <div className="text-xl font-bold text-green-600">${calculatePotentialPayout()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Profit</div>
                <div className="text-xl font-bold text-green-600">${calculateProfit()}</div>
              </div>
            </div>
          )}

          <button
            disabled={!selectedOutcome || !betAmount || betAmount <= 0}
            className="w-full py-3 px-4 rounded-lg font-semibold text-lg text-white transition-all duration-200 bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Place Bet
          </button>
        </div>
      </div>
    );
  };

  const formatSeconds = (seconds) => {
    if (isNaN(seconds) || seconds <= 0) return 'N/A';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    const hDisplay = h > 0 ? h + "h " : "";
    const mDisplay = m > 0 ? m + "m " : "";
    const sDisplay = s >= 0 ? s + "s" : "";
    
    const result = hDisplay + mDisplay + sDisplay;
    return result.trim() === '' ? '0s' : result.trim();
  }

  const growthAnalysisData = {
    solana: {
      aiIntegration: [
        "Core AI Capabilities: High throughput (65k TPS) is ideal for running large-scale AI inference models on-chain.",
        "Developer Ecosystem: Growing support for AI/ML frameworks makes it attractive for developers.",
        "Scalability for AI: Sub-second finality ensures AI agents can react and transact in near real-time."
      ],
      growthDrivers: [
        "Market Demand: Solana's low transaction costs attract high-volume applications, a key requirement for many AI use cases.",
        "Competitive Advantages: Proven ability to handle high traffic demonstrates robustness for future AI dApps.",
        "Tokenomics & Utility: Staking SOL secures the network, and its use as gas for AI-driven transactions directly ties utility to adoption."
      ],
      riskAssessment: [
        "Technical Risks: Historically, network stability has been a concern; any downtime could be catastrophic for real-time AI services.",
        "Market Risks: Faces intense competition from both new L1s (Sei, Sui) and Ethereum L2s targeting the performance market.",
        "Execution Risks: Must continue to foster a developer environment that is as welcoming as Ethereum's to attract top AI talent."
      ]
    },
    sei: {
      aiIntegration: [
        "Core AI Capabilities: The first parallelized EVM is purpose-built for concurrent transaction processing, a core need for many AI algorithms.",
        "Developer Ecosystem: Actively courting AI projects with a dedicated $10M fund and specialized technical support.",
        "Scalability for AI: Twin-turbo consensus provides massive parallel processing, allowing multiple AI agents to operate without bottlenecks."
      ],
      growthDrivers: [
        "Market Demand: Positioned to capture the wave of on-chain AI and DePIN applications that are too resource-intensive for other chains.",
        "Competitive Advantages: A first-mover in parallelized EVMs creates a strong technical moat for high-frequency AI tasks.",
        "Tokenomics & Utility: Transaction fees from anticipated high-volume AI usage could create a powerful value accrual mechanism for the token."
      ],
      riskAssessment: [
        "Technical Risks: The novel parallelized EVM is less battle-tested and potential bugs could be more subtle and complex.",
        "Market Risks: Heavily reliant on the 'AI narrative'; a cooling of interest in on-chain AI could significantly impact its growth.",
        "Execution Risks: Must build a robust ecosystem from a relatively new starting point to compete with established players."
      ]
    },
    sui: {
      aiIntegration: [
        "Core AI Capabilities: Object-centric model allows for fine-grained parallel execution of complex AI computations.",
        "Developer Ecosystem: The Move language offers enhanced security features, crucial for developing safe AI smart contracts.",
        "Scalability for AI: Horizontally scalable, meaning throughput can increase with more nodes to meet AI demands."
      ],
      growthDrivers: [
        "Market Demand: Well-suited for dynamic on-chain assets and complex state management required in AI-driven gaming or simulations.",
        "Competitive Advantages: Unique data model provides a different approach to scalability that may unlock novel AI applications.",
        "Tokenomics & Utility: Gas fees and storage fund mechanism create sustainable economics for data-heavy AI dApps."
      ],
      riskAssessment: [
        "Technical Risks: Developer adoption of the Move language has been slower than for EVM-compatible chains.",
        "Market Risks: Needs to carve out a distinct niche against other high-performance L1s to attract users and liquidity.",
        "Valuation Risks: Current valuation assumes significant adoption of its unique architecture, which is not yet guaranteed."
      ]
    },
    base: {
      aiIntegration: [
        "Core AI Capabilities: Leverages Ethereum's security while providing a low-cost environment for AI transaction execution.",
        "Developer Ecosystem: Backed by Coinbase, providing a massive user base and on-ramp for mainstream AI applications.",
        "Scalability for AI: As an L2, it offers significantly higher throughput and lower costs than Ethereum L1 for AI operations."
      ],
      growthDrivers: [
        "Market Demand: Positioned as a key on-ramp for retail users to interact with AI-powered dApps.",
        "Competitive Advantages: Deep integration with Coinbase's products and services provides an unparalleled distribution channel.",
        "Tokenomics & Utility: While it doesn't have its own token, its success drives value for ETH and the broader Ethereum ecosystem."
      ],
      riskAssessment: [
        "Technical Risks: Dependent on a centralized sequencer, which introduces a single point of failure and censorship risk.",
        "Market Risks: The L2 space is hyper-competitive, with many well-funded teams competing for market share.",
        "Execution Risks: Must navigate the path to decentralization successfully to align with the crypto ethos long-term."
      ]
    },
    ethereum: {
      aiIntegration: [
        "Core AI Capabilities: The most decentralized and secure platform for high-value AI applications and smart contracts.",
        "Developer Ecosystem: Unmatched developer community and battle-tested infrastructure provide a solid base for complex AI logic.",
        "Scalability for AI: L2 rollups (like Arbitrum, Base) are the primary strategy for scaling AI applications, keeping activity within the Ethereum ecosystem."
      ],
      growthDrivers: [
        "Market Demand: The established standard for DeFi and NFTs; AI applications requiring ultimate security will build here.",
        "Competitive Advantages: The network's 'money' status (ETH) and massive liquidity are a powerful moat.",
        "Tokenomics & Utility: ETH's ultrasound money narrative, driven by fee burns (EIP-1559), creates a strong value proposition."
      ],
      riskAssessment: [
        "Technical Risks: The L1 itself is not scalable for high-frequency AI tasks, forcing reliance on a fragmented L2 landscape.",
        "Market Risks: High gas fees on L1 price out many types of AI applications, pushing innovation to other chains.",
        "Valuation Risks: Its large market cap means growth is slower, and it's less likely to see the explosive gains of smaller-cap tokens."
      ]
    },
    arbitrum: {
      aiIntegration: [
        "Core AI Capabilities: Offers a low-cost, high-throughput environment on top of Ethereum's security for AI dApps.",
        "Developer Ecosystem: Strong EVM compatibility makes it easy for developers to migrate existing smart contracts and tools.",
        "Scalability for AI: Benefits from ongoing Ethereum upgrades and its own Nitro tech stack to improve performance for AI."
      ],
      growthDrivers: [
        "Market Demand: Leading L2 for DeFi, positioning it well to support AI-driven financial applications.",
        "Competitive Advantages: Has a strong brand and significant first-mover advantage among Ethereum L2s.",
        "Tokenomics & Utility: The ARB token allows for governance over the network's future, including AI-related initiatives."
      ],
      riskAssessment: [
        "Technical Risks: Like other L2s, it relies on a centralized sequencer, posing potential uptime and censorship risks.",
        "Market Risks: Faces fierce competition from other L2s and alternative L1s for developer and user attention.",
        "Execution Risks: The transition to a fully decentralized network with permissionless validation is a complex multi-year process."
      ]
    },
    optimism: {
      aiIntegration: [
        "Core AI Capabilities: The OP Stack provides a modular framework for building custom chains (Superchain), which could host specialized AI environments.",
        "Developer Ecosystem: Strong focus on public goods funding and a positive-sum ethos attracts mission-driven developers.",
        "Scalability for AI: The Superchain vision aims for horizontal scalability, allowing AI applications to operate across an interoperable network of chains."
      ],
      growthDrivers: [
        "Market Demand: The narrative of a cohesive 'Superchain' is a compelling vision for a future of interoperable AI agents.",
        "Competitive Advantages: The OP Stack has become a popular choice for new L2s (e.g., Base), creating a powerful network effect.",
        "Tokenomics & Utility: Governance over the OP Stack and public goods funding gives the token significant influence."
      ],
      riskAssessment: [
        "Technical Risks: The Superchain vision is highly ambitious and faces significant technical hurdles to achieve seamless interoperability.",
        "Market Risks: Must compete with the monolithic chain thesis and other L2 ecosystems like Arbitrum and Polygon.",
        "Execution Risks: Relies on a broad coalition of teams to build out the Superchain, which requires strong coordination."
      ]
    },
    polygon: {
      aiIntegration: [
        "Core AI Capabilities: Offers a suite of scaling solutions (PoS, zkEVM, Miden) that can be tailored to different AI application needs.",
        "Developer Ecosystem: Strong enterprise and business development focus has led to major partnerships (e.g., Starbucks, Disney).",
        "Scalability for AI: The upcoming Polygon 2.0 aims to unify its various chains into an interoperable 'value layer' for the internet."
      ],
      growthDrivers: [
        "Market Demand: A trusted brand for enterprises looking to experiment with blockchain and AI technology.",
        "Competitive Advantages: Multi-pronged scaling strategy allows it to be flexible and adapt to different market needs.",
        "Tokenomics & Utility: The POL token upgrade is designed to allow staking across all Polygon chains, unifying the ecosystem."
      ],
      riskAssessment: [
        "Technical Risks: Managing a diverse suite of scaling solutions creates complexity and can fragment liquidity and developers.",
        "Market Risks: The Polygon brand can be confusing due to the variety of chains and technologies under its umbrella.",
        "Execution Risks: The Polygon 2.0 vision is a massive undertaking that requires flawless execution to succeed."
      ]
    },
    avalanche: {
      aiIntegration: [
        "Core AI Capabilities: Subnets allow applications to create custom, dedicated chains optimized for specific AI workloads.",
        "Developer Ecosystem: Strong in the gaming and enterprise sectors, which are prime areas for AI integration.",
        "Scalability for AI: The subnet architecture provides a path to near-infinite scalability by isolating traffic."
      ],
      growthDrivers: [
        "Market Demand: Ideal for applications that need high performance and customizability without competing for blockspace.",
        "Competitive Advantages: Subnets offer a unique value proposition for projects wanting full control over their environment.",
        "Tokenomics & Utility: AVAX is staked to secure the main network and is often used as the gas token for subnets."
      ],
      riskAssessment: [
        "Technical Risks: Subnets can be complex to set up and maintain, and security is the responsibility of the subnet deployer.",
        "Market Risks: The model of paying for subnet validation can be expensive, potentially limiting adoption to well-funded projects.",
        "Execution Risks: Must prove that the subnet model can create a more vibrant ecosystem than a single, shared L1."
      ]
    },
    bsc: {
      aiIntegration: [
        "Core AI Capabilities: High throughput and low fees make it a viable, low-cost environment for experimenting with AI dApps.",
        "Developer Ecosystem: EVM compatibility and a large user base provide a ready market for new applications.",
        "Scalability for AI: Has demonstrated the ability to handle very high transaction volumes, though with centralization trade-offs."
      ],
      growthDrivers: [
        "Market Demand: Very popular in emerging markets due to its low fees, which could be a key demographic for accessible AI tools.",
        "Competitive Advantages: Deep liquidity and a massive, active user base give it a strong network effect.",
        "Tokenomics & Utility: BNB has deep utility within the broader Binance ecosystem, from trading fees to launchpad access."
      ],
      riskAssessment: [
        "Technical Risks: Highly centralized, which runs counter to the core ethos of crypto and introduces significant censorship risk.",
        "Market Risks: Often perceived as less innovative and more of a copy of Ethereum, which can deter some developers.",
        "Regulatory Risks: Tightly linked to Binance, making it and its ecosystem a potential target for regulators."
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header with AI Chat */}
        <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 border border-blue-200">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                {/* Modern Logo Icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                
                <div className="flex items-center h-16">
                  <h1 className="text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight leading-none">
                    SIR
                  </h1>
                </div>
                
                <div className="flex flex-col justify-center h-16">
                  <p className="text-xl text-gray-600 font-medium leading-tight">Synthetic Intelligence Readiness</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full border border-green-200">
                      Live Data
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                      AI-Powered
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full border border-purple-200">
                      Real-time
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search networks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                <select 
                  value={timeframe} 
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900"
                >
                  <option value="7d">7 Days</option>
                  <option value="30d">30 Days</option>
                  <option value="90d">90 Days</option>
                </select>

                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* AI Chat Interface */}
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-3 flex-shrink-0 shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-gray-900 text-xl">AI Project Analyzer</h3>
                      <InfoTooltip 
                        content={
                          <div>
                            <div className="font-semibold mb-2">Use Case Weighting</div>
                            <div className="text-xs space-y-1">
                              <div><strong>General:</strong> Balanced weights for most AI projects</div>
                              <div><strong>Trading:</strong> Emphasizes speed, cost, and payments</div>
                              <div><strong>Service:</strong> Prioritizes cost and reliability</div>
                              <div><strong>Enterprise:</strong> Focuses on reliability and security</div>
                              <div><strong>Custom:</strong> AI-optimized weights for your specific project</div>
                            </div>
                            <div className="mt-2 text-xs text-gray-300">
                              Weights automatically adjust SIR scores to match your use case.
                            </div>
                          </div>
                        }
                      >
                        <span></span>
                      </InfoTooltip>
                    </div>
                    <p className="text-gray-600 mb-4 text-base">
                      Describe your AI agent project and I'll customize the blockchain rankings for your specific needs
                    </p>
                    
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="e.g., 'I'm building a DeFi trading bot that needs to execute 1000+ transactions per day with minimal latency...'"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAiAnalysis()}
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                      />
                      <button
                        onClick={handleAiAnalysis}
                        disabled={!aiQuery.trim() || isAnalyzing}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Analyze
                          </>
                        )}
                      </button>
                    </div>

                    {/* AI Response */}
                    {aiResponse && (
                      <div className="mt-6 p-6 bg-white rounded-2xl border border-blue-200 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="bg-green-100 rounded-2xl p-2 border border-green-200">
                            <Target className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-3 text-lg">Custom Analysis for Your Project</h4>
                            <p className="text-gray-600 mb-4">{aiResponse.analysis}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                              {Object.entries(aiResponse.weights).map(([key, weight]) => (
                                <div key={key} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                                  <div className="text-xs text-gray-500 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                  </div>
                                  <div className="font-bold text-blue-600 text-lg">{weight}%</div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <button
                                onClick={applyAiWeights}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                Apply Custom Weights
                              </button>
                              <button
                                onClick={resetToGeneral}
                                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-all duration-200"
                              >
                                Reset to General
                              </button>
                              <span className="text-sm text-gray-500">
                                Ranking updated for: <strong className="text-gray-900">{aiResponse.projectType}</strong>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Examples */}
                    {!aiResponse && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-sm text-gray-500">Try:</span>
                        {[
                          "High-frequency trading bot",
                          "NFT marketplace with AI curation", 
                          "Cross-chain DeFi yield optimizer",
                          "Real-time prediction market"
                        ].map((example) => (
                          <button
                            key={example}
                            onClick={() => setAiQuery(example)}
                            className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all duration-200"
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 border">
          <div className="flex flex-wrap gap-2">
            <TabButton id="overview" label="Overview" icon={BarChart3} active={activeTab === 'overview'} onClick={setActiveTab} />
            <TabButton id="analytics" label="Analytics" icon={Activity} active={activeTab === 'analytics'} onClick={setActiveTab} />
            <TabButton id="network-details" label="Network Details" icon={Info} active={activeTab === 'network-details'} onClick={setActiveTab} />
            <TabButton id="simulator" label="Workload Simulator" icon={Zap} active={activeTab === 'simulator'} onClick={setActiveTab} />
            <TabButton id="calculator" label="Cost Calculator" icon={Calculator} active={activeTab === 'calculator'} onClick={setActiveTab} />
            <TabButton id="predictions" label="Predictions" icon={Brain} active={activeTab === 'predictions'} onClick={setActiveTab} />
            <TabButton id="alerts" label={`Alerts (${alerts.length})`} icon={AlertTriangle} active={activeTab === 'alerts'} onClick={setActiveTab} />
          </div>
        </div>

        {/* Alerts Panel */}
        {showAlerts && alerts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Network Alerts
              </h3>
              <button 
                onClick={() => setShowAlerts(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {alerts.slice(0, 3).map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'success' ? 'bg-green-50 border-green-400' :
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-red-50 border-red-400'
                }`}>
                  <h4 className="font-medium text-sm">{alert.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Main Leaderboard - First and Prominent */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <InfoTooltip 
                      content={
                        <div>
                          <div className="font-semibold mb-2">SIR Score Framework</div>
                          <div className="space-y-1 text-xs">
                            <div><strong>SIR</strong> = Speed + Intelligence + Reliability</div>
                            <div>• <strong>Speed:</strong> TPS, finality, latency (24%)</div>
                            <div>• <strong>Cost:</strong> Gas fees, transaction costs (22%)</div>
                            <div>• <strong>Reliability:</strong> Uptime, security, stability (19%)</div>
                            <div>• <strong>Dev Experience:</strong> Tooling, documentation, community (15%)</div>
                            <div>• <strong>Liquidity:</strong> TVL, trading volume (5%)</div>
                            <div>• <strong>Security:</strong> Audit history, attack resistance (5%)</div>
                            <div>• <strong>Parallel:</strong> Concurrent processing capability (5%)</div>
                            <div>• <strong>Payments:</strong> Payment infrastructure quality (5%)</div>
                          </div>
                          <div className="mt-2 text-xs text-gray-300">
                            Weights adjust based on your selected use case or AI analysis.
                          </div>
                        </div>
                      }
                    >
                      <h2 className="text-2xl font-bold text-gray-900">AI Readiness Leaderboard</h2>
                    </InfoTooltip>
                    <p className="text-gray-600 mt-1">
                      {customWeights 
                        ? `Custom ranking for: ${aiResponse?.projectType}` 
                        : `Ranked by ${selectedUseCase.replace(/([A-Z])/g, ' $1').toLowerCase()} agent suitability`
                      }
                    </p>
                    {customWeights && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          AI-Optimized Weights
                        </span>
                        <button
                          onClick={resetToGeneral}
                          className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                          Reset to default
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <button 
                      onClick={() => setActiveTab('calculator')}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cost Calculator
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Network</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        <span className="inline-flex items-center gap-1">
                          Tier
                          <InfoTooltip content={<div><div className="font-semibold mb-2">Tier System</div><div className="text-xs space-y-1"><div><strong>S-Tier:</strong> Elite AI-ready networks (90+ score)</div><div><strong>A-Tier:</strong> Excellent performance (80-89 score)</div><div><strong>B-Tier:</strong> Good performance (70-79 score)</div><div><strong>C-Tier:</strong> Adequate performance (60-69 score)</div><div><strong>D-Tier:</strong> Below average (50-59 score)</div><div><strong>F-Tier:</strong> Poor performance (&lt;50 score)</div></div></div>} />
                        </span>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        <span className="inline-flex items-center gap-1">
                          SIR Score
                          <InfoTooltip content={<div><div className="font-semibold mb-2">SIR Score</div><div className="text-xs space-y-1"><div>Weighted average of 8 key metrics:</div><div>• Speed (24%): TPS, finality, latency</div><div>• Cost (22%): Gas fees, transaction costs</div><div>• Reliability (19%): Uptime, stability</div><div>• Dev Experience (15%): Tooling, community</div><div>• Liquidity (5%): TVL, trading volume</div><div>• Security (5%): Audit history, attack resistance</div><div>• Parallel (5%): Concurrent processing</div><div>• Payments (5%): Payment infrastructure</div></div></div>} />
                        </span>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        <span className="inline-flex items-center gap-1">
                          TPS
                          <InfoTooltip content={<div><div className="font-semibold mb-2">Transactions Per Second</div><div className="text-xs"><div>Real-time calculation from recent blocks</div><div>• Higher TPS = better for high-frequency operations</div><div>• Critical for AI agents requiring fast execution</div><div>• Live data from network APIs when available</div></div></div>} />
                        </span>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        <span className="inline-flex items-center gap-1">
                          Finality
                          <InfoTooltip content={<div><div className="font-semibold mb-2">Finality</div><div className="text-xs"><div>Time for transaction to be irreversible</div><div>• Lower = faster settlement</div><div>• Critical for real-time applications</div><div>• Varies by consensus mechanism</div></div></div>} />
                        </span>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        <span className="inline-flex items-center gap-1">
                          Gas Price
                          <InfoTooltip content={<div><div className="font-semibold mb-2">Gas Price</div><div className="text-xs"><div>Average cost per transaction</div><div>• Lower = more cost-effective</div><div>• Live data from network gas oracles</div><div>• Affects AI agent operating costs</div></div></div>} />
                        </span>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">24h Change</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">30d Change</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rankedNetworks.map((network) => (
                      <tr 
                        key={network.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedNetwork === network.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedNetwork(network.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-gray-900">#{network.adjustedRank}</span>
                            {network.adjustedRank <= 3 && (
                              <span className="ml-2 text-lg">
                                {network.adjustedRank === 1 ? '🥇' : network.adjustedRank === 2 ? '🥈' : '🥉'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <NetworkLogo network={network} />
                            <div>
                              <div className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                                {network.name}
                                {network.isLiveData && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    Live
                                  </span>
                                )}
                                {network.id === 'base' && baseLoading && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin"></div>
                                    Loading...
                                  </span>
                                )}
                                {network.id === 'base' && baseError && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                    Error
                                  </span>
                                )}
                                {network.id === 'ethereum' && ethLoading && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin"></div>
                                    Loading...
                                  </span>
                                )}
                                {network.id === 'ethereum' && ethError && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                    Error
                                  </span>
                                )}
                                {network.id === 'solana' && solLoading && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin"></div>
                                    Loading...
                                  </span>
                                )}
                                {network.id === 'solana' && solError && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                    Error
                                  </span>
                                )}
                                {network.id === 'polygon' && polygonLoading && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin"></div>
                                    Loading...
                                  </span>
                                )}
                                {network.id === 'polygon' && polygonError && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                    Error
                                  </span>
                                )}
                                {network.id === 'bsc' && bscLoading && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin"></div>
                                    Loading...
                                  </span>
                                )}
                                {network.id === 'bsc' && bscError && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                    Error
                                  </span>
                                )}
                                {network.id === 'sei' && seiLoading && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin"></div>
                                    Loading...
                                  </span>
                                )}
                                {network.id === 'sei' && seiError && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                    Error
                                  </span>
                                )}
                                {network.id === 'sui' && suiLoading && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin"></div>
                                    Loading...
                                  </span>
                                )}
                                {network.id === 'sui' && suiError && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                    Error
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{network.ecosystem} ecosystem</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${tierColors[network.tier].bg} ${tierColors[network.tier].text}`}>
                            {network.tier}-Tier
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xl font-bold text-gray-900">{network.adjustedScore}</div>
                          <div className="text-sm text-gray-500">Predicted: {network.prediction6m}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">{network.tps.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">transactions/sec</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">{network.finality}</div>
                          <div className="text-xs text-gray-500">to finality</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">{network.gasPrice}</div>
                          <div className="text-xs text-gray-500">avg transaction</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatChange(network.change24h)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatChange(network.change30d)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(network.id);
                              }}
                              className={`p-2 rounded-lg ${favorites.includes(network.id) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-gray-100'} transition-colors`}
                              title="Add to favorites"
                            >
                              <Heart className="w-4 h-4" fill={favorites.includes(network.id) ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Stats - Now Below Leaderboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Top Rated Network</p>
                    <p className="text-2xl font-bold text-gray-900">{rankedNetworks[0]?.name}</p>
                    <p className="text-sm text-gray-600">Score: {rankedNetworks[0]?.adjustedScore}</p>
                  </div>
                  <div className="text-3xl">
                    <NetworkLogo network={rankedNetworks[0]} size="text-3xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(rankedNetworks.reduce((sum, n) => sum + n.adjustedScore, 0) / rankedNetworks.length).toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600">Across all networks</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Best Performer</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {trendAnalysis[0]?.name}
                    </p>
                    <p className="text-sm text-green-600">+{trendAnalysis[0]?.momentum.toFixed(1)}% momentum</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">S-Tier Networks</p>
                    <p className="text-2xl font-bold text-gray-900">{rankedNetworks.filter(n => n.tier === 'S').length}</p>
                    <p className="text-sm text-gray-600">Elite AI-ready</p>
                  </div>
                  <Zap className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Secondary Content in Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Network Details */}
              <div className="space-y-6">
                {selectedNetworkData && (
                  <>
                    <div className="bg-white rounded-xl shadow-sm p-6 border">
                      <div className="flex items-center gap-3 mb-4">
                        <NetworkLogo network={selectedNetworkData} />
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{selectedNetworkData.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${tierColors[selectedNetworkData.tier].bg} ${tierColors[selectedNetworkData.tier].text}`}>
                              {selectedNetworkData.tier}-Tier
                            </span>
                            <span className="text-gray-500">#{selectedNetworkData.adjustedRank}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">SIR Score</span>
                          <div className="font-bold text-xl">{selectedNetworkData.adjustedScore}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Prediction</span>
                          <div className="font-bold text-xl">{selectedNetworkData.prediction6m}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">TPS</span>
                          <div className="font-medium">{selectedNetworkData.tps.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Finality</span>
                          <div className="font-medium">{selectedNetworkData.finality}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Gas Price</span>
                          <div className="font-medium">{selectedNetworkData.gasPrice}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Uptime</span>
                          <div className="font-medium">{selectedNetworkData.uptime}%</div>
                        </div>
                      </div>
                      
                      {/* Live Data Indicator for Base */}
                      {selectedNetworkData.isLiveData && selectedNetworkData.lastUpdated && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-800 font-medium">Live Data</span>
                            <span className="text-green-600">
                              Last updated: {new Date(selectedNetworkData.lastUpdated).toLocaleTimeString()}
                            </span>
                          </div>
                          {selectedNetworkData.dataQuality && (
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                              {Object.entries(selectedNetworkData.dataQuality).map(([key, quality]) => (
                                <div key={key} className="flex items-center gap-1">
                                  <div className={`w-2 h-2 rounded-full ${quality === 'live' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                  <span className="text-gray-600 capitalize">{key}:</span>
                                  <span className={quality === 'live' ? 'text-green-700' : 'text-yellow-700'}>
                                    {quality}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Radar Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border">
                      <InfoTooltip 
                        content={
                          <div>
                            <div className="font-semibold mb-2">Performance Profile</div>
                            <div className="text-xs space-y-1">
                              <div>Radar chart showing 8 key dimensions:</div>
                              <div>• <strong>Speed:</strong> TPS, finality, latency</div>
                              <div>• <strong>Cost:</strong> Gas fees, transaction costs</div>
                              <div>• <strong>Reliability:</strong> Uptime, stability</div>
                              <div>• <strong>Dev Experience:</strong> Tooling, community</div>
                              <div>• <strong>Liquidity:</strong> TVL, trading volume</div>
                              <div>• <strong>Security:</strong> Audit history, attack resistance</div>
                              <div>• <strong>Parallel:</strong> Concurrent processing</div>
                              <div>• <strong>Payments:</strong> Payment infrastructure</div>
                            </div>
                          </div>
                        }
                      >
                        <h4 className="text-lg font-bold text-gray-900 mb-4">Performance Profile</h4>
                      </InfoTooltip>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={getDimensionData(selectedNetworkData)}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" className="text-xs" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" />
                            <Radar 
                              name={selectedNetworkData.name} 
                              dataKey="value" 
                              stroke={tierColors[selectedNetworkData.tier].accent}
                              fill={tierColors[selectedNetworkData.tier].accent}
                              fillOpacity={0.3}
                              strokeWidth={2}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Historical Chart */}
              <div className="space-y-6">
                {selectedNetworkData && historicalData[selectedNetwork] && (
                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {selectedNetworkData.name} Performance History
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData[selectedNetwork]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          />
                          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                          <Tooltip 
                            labelFormatter={(date) => new Date(date).toLocaleDateString()}
                            formatter={(value, name) => [
                              name === 'score' ? value.toFixed(1) : value.toLocaleString(),
                              name === 'score' ? 'SIR Score' : 
                              name === 'volume' ? 'Volume ($)' :
                              name === 'transactions' ? 'Transactions' : 'Active Users'
                            ]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#3B82F6" 
                            strokeWidth={2}
                            dot={false}
                            name="score"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Market Correlation */}
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Market Cap vs SIR Score Correlation</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={marketCorrelationData}>
                    <CartesianGrid />
                    <XAxis 
                      type="number" 
                      dataKey="marketCap" 
                      name="Market Cap (B)" 
                      scale="log"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(value) => `$${value.toFixed(1)}B`}
                      ticks={[2, 5, 10, 20, 50, 100, 200, 500]}
                    />
                    <YAxis type="number" dataKey="sirScore" name="SIR Score" domain={[55, 95]} />
                    <Tooltip 
                      formatter={(value, name, props) => {
                        if (name === 'sirScore') {
                          return [value.toFixed(1), 'SIR Score'];
                        } else if (name === 'marketCap') {
                          return [`$${value.toFixed(1)}B`, 'Market Cap'];
                        }
                        return [value, name];
                      }}
                      labelFormatter={(value, payload) => {
                        if (payload && payload[0] && payload[0].payload) {
                          return payload[0].payload.name;
                        }
                        return '';
                      }}
                    />
                    <Scatter dataKey="sirScore" fill="#3B82F6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trend Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Momentum Leaders</h3>
                <div className="space-y-3">
                  {trendAnalysis.slice(0, 5).map((network, index) => (
                    <div key={network.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <NetworkLogo network={network} size="text-lg" />
                        <div>
                          <span className="font-medium">{network.name}</span>
                          <div className="text-sm text-gray-600">Momentum: +{network.momentum.toFixed(1)}%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{network.adjustedScore}</div>
                        <div className="text-xs text-green-600">↗ {network.growthRate.toFixed(2)}%/day</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ecosystem Maturity</h3>
                <div className="space-y-4">
                  {rankedNetworks
                    .map((network) => {
                      // Get developer data if available
                      const devData = developerData?.[network.id];
                      
                      // Calculate AI-focused ecosystem maturity score with proper metrics
                      const aiEcosystemScore = Math.round(
                        // Developer tools (15%) - SDKs, APIs, frameworks for AI development (reduced weight)
                        (network.developerActivity * 0.15) + 
                        // Developers (15%) - Active AI developer community size (reduced weight)
                        (Math.min((devData?.activeDevelopers || network.communitySize) / 100, 100) * 0.15) + 
                        // Live AI integrations (10%) - Number of live AI services/protocols (reduced weight)
                        (Math.min(network.partnerships * 3, 100) * 0.1) + // Using partnerships as proxy for AI integrations
                        // Deployed agents (10%) - Number of active AI agents on network (reduced weight)
                        (Math.min((devData?.repositories || network.githubStars) / 100, 100) * 0.1) + // Using repositories as proxy for deployed agents
                        // Ecosystem age (10%) - Years since founding (but penalize old non-AI networks)
                        (network.id === 'ethereum' || network.id === 'polygon' || network.id === 'bsc' ? 
                          Math.min((2024 - network.founded) * 1, 50) : // Cap older networks at 50 points
                          (2024 - network.founded) * 2) + 
                        // AI-Focus Bonus (40%) - Much higher weight for networks specifically designed for AI
                        (network.id === 'sei' ? 100 : 
                         network.id === 'base' ? 95 :
                         network.id === 'sui' ? 90 :
                         network.id === 'solana' ? 70 :
                         network.id === 'arbitrum' || network.id === 'optimism' ? 30 :
                         network.id === 'polygon' || network.id === 'bsc' ? 20 :
                         network.id === 'ethereum' ? 40 : 50) * 0.4
                      );
                      
                      return {
                        ...network,
                        aiEcosystemScore
                      };
                    })
                    .sort((a, b) => b.aiEcosystemScore - a.aiEcosystemScore) // Sort by maturity score
                    .map((network) => {
                      const devData = developerData?.[network.id];
                      
                      return (
                        <div key={network.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <NetworkLogo network={network} size="text-lg" />
                              <div>
                                <span className="font-medium">{network.name}</span>
                                <div className="text-sm text-gray-600">AI Ecosystem Maturity</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">{network.aiEcosystemScore}</div>
                              <div className="text-xs text-gray-500">/ 100</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Developer Tools:</span>
                              <span className="font-medium">{network.developerActivity}/100</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Active Developers:</span>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{devData?.activeDevelopers || network.communitySize}</span>
                                {devData?.dataQuality?.activeDevelopers === 'live' && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Live AI Integrations:</span>
                              <span className="font-medium">{network.partnerships}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Repositories:</span>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{devData?.repositories || network.githubStars}</span>
                                {devData?.dataQuality?.repositories === 'live' && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ecosystem Age:</span>
                              <span className="font-medium">{2024 - network.founded} years</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Growth Profile:</span>
                              <span className="font-medium">{devData?.ecosystem || network.ecosystem}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-8 border">
              <div className="flex items-start gap-4 mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-3 flex-shrink-0 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Workload Simulator</h3>
                  <p className="text-gray-600 mt-1">Compare real-world performance across different blockchain networks</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Column: Configuration */}
                <div className="lg:col-span-3 space-y-6">
                  <h4 className="text-xl font-semibold text-gray-900">Simulation Configuration</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Simulation Type</label>
                    <div className="flex rounded-lg border p-1 bg-gray-100">
                      <button 
                        onClick={() => setSimulatorConfig(prev => ({ ...prev, simulationMode: 'duration' }))}
                        className={`w-1/2 py-2 rounded-md text-sm font-medium transition-all ${simulatorConfig.simulationMode === 'duration' ? 'bg-white shadow' : 'text-gray-600'}`}
                      >
                        Fixed Duration
                      </button>
                      <button 
                        onClick={() => setSimulatorConfig(prev => ({ ...prev, simulationMode: 'completion' }))}
                        className={`w-1/2 py-2 rounded-md text-sm font-medium transition-all ${simulatorConfig.simulationMode === 'completion' ? 'bg-white shadow' : 'text-gray-600'}`}
                      >
                        Time to Completion
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Workload Type</label>
                    <select
                      value={simulatorConfig.workload}
                      onChange={(e) => setSimulatorConfig(prev => ({ ...prev, workload: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      {Object.entries(workloadTypes).map(([key, value]) => (
                        <option key={key} value={key}>{value.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      {workloadTypes[simulatorConfig.workload]?.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {simulatorConfig.simulationMode === 'duration' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                        <input
                          type="number"
                          value={simulatorConfig.duration}
                          onChange={(e) => setSimulatorConfig(prev => ({ ...prev, duration: parseInt(e.target.value) || 24 }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          min="1"
                          max="168"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Intensity</label>
                      <select
                        value={simulatorConfig.intensity}
                        onChange={(e) => setSimulatorConfig(prev => ({ ...prev, intensity: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="extreme">Extreme</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Transactions</label>
                      <input
                        type="number"
                        value={simulatorConfig.transactions}
                        onChange={(e) => setSimulatorConfig(prev => ({ ...prev, transactions: parseInt(e.target.value) || 10000 }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        min="100"
                        max="1000000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Complexity</label>
                      <select
                        value={simulatorConfig.complexity}
                        onChange={(e) => setSimulatorConfig(prev => ({ ...prev, complexity: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      >
                        <option value="simple">Simple</option>
                        <option value="medium">Medium</option>
                        <option value="complex">Complex</option>
                        <option value="very_complex">Very Complex</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column: Network Comparison */}
                <div className="lg:col-span-2 space-y-6 flex flex-col">
                  <h4 className="text-xl font-semibold text-gray-900">Network Comparison</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Network 1</label>
                    <select
                      value={simulatorConfig.network1}
                      onChange={(e) => setSimulatorConfig(prev => ({ ...prev, network1: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      {rankedNetworks.map((network) => (
                        <option key={network.id} value={network.id}>
                          {network.name} ({network.tier}-Tier)
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 flex items-center gap-2">
                      <NetworkLogo network={rankedNetworks.find(n => n.id === simulatorConfig.network1)} size="text-lg" />
                      <span className="text-sm text-gray-600">
                        {rankedNetworks.find(n => n.id === simulatorConfig.network1)?.name}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Network 2</label>
                    <select
                      value={simulatorConfig.network2}
                      onChange={(e) => setSimulatorConfig(prev => ({ ...prev, network2: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      {rankedNetworks.map((network) => (
                        <option key={network.id} value={network.id}>
                          {network.name} ({network.tier}-Tier)
                        </option>
                      ))}
                    </select>
                     <div className="mt-2 flex items-center gap-2">
                      <NetworkLogo network={rankedNetworks.find(n => n.id === simulatorConfig.network2)} size="text-lg" />
                      <span className="text-sm text-gray-600">
                        {rankedNetworks.find(n => n.id === simulatorConfig.network2)?.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-grow flex items-end">
                    <button
                      onClick={runSimulation}
                      disabled={isSimulating}
                      className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 text-lg font-bold"
                    >
                      {isSimulating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Simulating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Run Simulation
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {simulationResults && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Simulation Results</h3>
                  
                  {/* Summary Bar */}
                  <div className={`rounded-xl p-6 mb-8 grid grid-cols-3 gap-6 items-center border ${
                    simulationResults.network1.metrics.performanceScore > simulationResults.network2.metrics.performanceScore ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">
                        {
                          simulatorConfig.simulationMode === 'duration'
                            ? (simulationResults.network1.metrics.performanceScore > simulationResults.network2.metrics.performanceScore ? simulationResults.network1.network.name : simulationResults.network2.network.name)
                            : (simulationResults.network1.metrics.completionTime < simulationResults.network2.metrics.completionTime ? simulationResults.network1.network.name : simulationResults.network2.network.name)
                        }
                      </div>
                      <div className="text-sm text-green-600">Winner</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">
                      {
                          simulatorConfig.simulationMode === 'duration'
                            ? Math.abs(simulationResults.network1.metrics.performanceScore - simulationResults.network2.metrics.performanceScore)
                            : formatSeconds(Math.abs(simulationResults.network1.metrics.completionTime - simulationResults.network2.metrics.completionTime))
                        }
                      </div>
                      <div className="text-sm text-gray-600">{simulatorConfig.simulationMode === 'duration' ? 'Performance Difference' : 'Time Difference'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-700">${Math.abs(simulationResults.network1.metrics.totalCost - simulationResults.network2.metrics.totalCost).toFixed(2)}</div>
                      <div className="text-sm text-purple-600">Cost Difference</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Network 1 Results */}
                    <div className="bg-white rounded-xl p-6 border shadow-sm">
                      <div className="flex items-center gap-4 mb-4">
                        <NetworkLogo network={simulationResults.network1.network} size="text-2xl" />
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{simulationResults.network1.network.name}</h4>
                          <p className="text-sm text-gray-500">Performance Score: {simulationResults.network1.metrics.performanceScore}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">{simulationResults.network1.metrics.successRate}%</div>
                          <div className="text-sm text-blue-700">Success Rate</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">{simulationResults.network1.metrics.effectiveTPS}</div>
                          <div className="text-sm text-green-700">Effective TPS</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-600">${simulationResults.network1.metrics.totalCost}</div>
                          <div className="text-sm text-purple-700">Total Cost</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg text-center">
                          {simulatorConfig.simulationMode === 'duration' ? (
                            <>
                              <div className="text-2xl font-bold text-orange-600">{simulationResults.network1.metrics.avgProcessingTime}s</div>
                              <div className="text-sm text-orange-700">Avg Processing</div>
                            </>
                          ) : (
                            <>
                              <div className="text-2xl font-bold text-orange-600">{formatSeconds(simulationResults.network1.metrics.completionTime)}</div>
                              <div className="text-sm text-orange-700">Time to Complete</div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Successful Transactions:</span>
                          <span className="font-medium">{simulationResults.network1.metrics.successfulTransactions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Failed Transactions:</span>
                          <span className="font-medium text-red-600">{simulationResults.network1.metrics.failedTransactions.toLocaleString()}</span>
                        </div>
                        {simulatorConfig.simulationMode === 'duration' &&
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cost per Hour:</span>
                            <span className="font-medium">${simulationResults.network1.metrics.costPerHour}</span>
                          </div>
                        }
                      </div>
                    </div>
                    {/* Network 2 Results */}
                    <div className="bg-white rounded-xl p-6 border shadow-sm">
                      <div className="flex items-center gap-4 mb-4">
                        <NetworkLogo network={simulationResults.network2.network} size="text-2xl" />
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{simulationResults.network2.network.name}</h4>
                          <p className="text-sm text-gray-500">Performance Score: {simulationResults.network2.metrics.performanceScore}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">{simulationResults.network2.metrics.successRate}%</div>
                          <div className="text-sm text-blue-700">Success Rate</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">{simulationResults.network2.metrics.effectiveTPS}</div>
                          <div className="text-sm text-green-700">Effective TPS</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-600">${simulationResults.network2.metrics.totalCost}</div>
                          <div className="text-sm text-purple-700">Total Cost</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg text-center">
                           {simulatorConfig.simulationMode === 'duration' ? (
                            <>
                              <div className="text-2xl font-bold text-orange-600">{simulationResults.network2.metrics.avgProcessingTime}s</div>
                              <div className="text-sm text-orange-700">Avg Processing</div>
                            </>
                          ) : (
                            <>
                              <div className="text-2xl font-bold text-orange-600">{formatSeconds(simulationResults.network2.metrics.completionTime)}</div>
                              <div className="text-sm text-orange-700">Time to Complete</div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Successful Transactions:</span>
                          <span className="font-medium">{simulationResults.network2.metrics.successfulTransactions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Failed Transactions:</span>
                          <span className="font-medium text-red-600">{simulationResults.network2.metrics.failedTransactions.toLocaleString()}</span>
                        </div>
                        {simulatorConfig.simulationMode === 'duration' &&
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cost per Hour:</span>
                            <span className="font-medium">${simulationResults.network2.metrics.costPerHour}</span>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-12 pt-8 border-t">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900">Parameter Definitions</h2>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Simulation Type</h3>
                  <p className="text-gray-600">How does the simulation mode change the results?</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li><strong>Fixed Duration:</strong> Simulates network performance over a set period (e.g., 24 hours). This mode is useful for understanding a network's endurance and cost-efficiency under sustained load. The winner is determined by a Performance Score that balances speed, success rate, and cost.</li>
                    <li><strong>Time to Completion:</strong> Simulates how long it takes for a network to process a fixed number of transactions. This mode is ideal for measuring pure speed and throughput for a specific task. The winner is the network with the fastest completion time.</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6 mb-3">Workload Types</h3>
                  <p className="text-gray-600">What are the different workload types?</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li><strong>DeFi Trading:</strong> High-frequency trading with complex smart contracts. High transaction frequency, medium transaction size, high complexity.</li>
                    <li><strong>NFT Marketplace:</strong> Mint, trade, and transfer NFTs with metadata. Medium frequency, large transaction size, medium complexity.</li>
                    <li><strong>Gaming:</strong> Real-time gaming transactions and state updates. Very high frequency, small transaction size, low complexity.</li>
                    <li><strong>Payments:</strong> Simple payment transfers and settlements. High frequency, small transaction size, low complexity.</li>
                    <li><strong>AI Agent Operations:</strong> AI agent interactions and autonomous transactions. Very high frequency, variable transaction size, high complexity.</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6 mb-3">Intensity Levels</h3>
                  <p className="text-gray-600">What does intensity measure?</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li><strong>Low (0.3x):</strong> Light network load - like a small app with occasional transactions. Reduces TPS by 70%, failure rates by 50%, costs by 30%.</li>
                    <li><strong>Medium (1.0x):</strong> Normal daily usage patterns. No multipliers applied - baseline performance.</li>
                    <li><strong>High (2.0x):</strong> Heavy load during peak hours or major events. Doubles TPS demand, increases failure rates by 50%, costs by 30%.</li>
                    <li><strong>Extreme (3.0x):</strong> Maximum stress like during network congestion or flash crashes. Triples TPS demand, doubles failure rates, increases costs by 60%.</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6 mb-3">Transaction Complexity</h3>
                  <p className="text-gray-600">How does complexity affect performance?</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li><strong>Simple (1.0x):</strong> Basic transfers, simple smart contracts. Standard gas costs, normal processing time, reduced failure rates.</li>
                    <li><strong>Medium (2.0x):</strong> Standard DeFi operations, NFT transfers. 2x gas costs, 1.5x processing time, normal failure rates.</li>
                    <li><strong>Complex (5.0x):</strong> Multi-step operations, complex DeFi protocols. 5x gas costs, 2x processing time, 30% higher failure rates.</li>
                    <li><strong>Very Complex (10.0x):</strong> Advanced AI operations, cross-chain bridges. 10x gas costs, 3x processing time, 60% higher failure rates.</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6 mb-3">Performance Metrics</h3>
                  <p className="text-gray-600">What do the simulation metrics mean?</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li><strong>Success Rate:</strong> Percentage of transactions that complete successfully. Based on network uptime and transaction complexity.</li>
                    <li><strong>Effective TPS:</strong> Actual transactions per second the network can handle under the simulated load conditions.</li>
                    <li><strong>Total Cost:</strong> Total gas fees for all transactions in the simulation period.</li>
                    <li><strong>Average Processing Time:</strong> Time it takes for a single transaction to be processed and confirmed. (Fixed Duration mode only)</li>
                    <li><strong>Time to Completion:</strong> Total time required to process all successful transactions. (Time to Completion mode only)</li>
                    <li><strong>Performance Score:</strong> Weighted combination of success rate (40%), processing speed (30%), and cost efficiency (30%). (Fixed Duration mode only)</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6 mb-3">How the Simulation Works</h3>
                  <p className="text-gray-600">What factors does the simulator consider?</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li><strong>Network Base Performance:</strong> Uses real TPS, gas prices, and uptime data from each network.</li>
                    <li><strong>Workload Characteristics:</strong> Applies workload-specific patterns (frequency, complexity, failure tolerance).</li>
                    <li><strong>Intensity Multipliers:</strong> Adjusts performance based on network stress levels.</li>
                    <li><strong>Complexity Multipliers:</strong> Modifies gas costs, processing time, and failure rates based on transaction complexity.</li>
                    <li><strong>Real-time Factors:</strong> Considers network congestion, transaction queuing, and block space competition.</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6 mb-3">Real-World Examples</h3>
                  <p className="text-gray-600">What scenarios do these settings represent?</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li><strong>Low Intensity + Simple:</strong> Small payment app, basic token transfers, simple NFT minting.</li>
                    <li><strong>High Intensity + Complex:</strong> DeFi protocol during market volatility, AI agent making rapid complex decisions.</li>
                    <li><strong>Extreme Intensity + Very Complex:</strong> Flash loan attacks, MEV bot operations, AI agents competing for opportunities.</li>
                    <li><strong>Medium Intensity + Medium Complexity:</strong> Typical NFT marketplace during a popular drop, standard DeFi yield farming.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Agent Cost Calculator</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transactions per period
                  </label>
                  <input
                    type="number"
                    value={costCalculator.transactions}
                    onChange={(e) => setCostCalculator(prev => ({ ...prev, transactions: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <select
                    value={costCalculator.frequency}
                    onChange={(e) => setCostCalculator(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complexity
                  </label>
                  <select
                    value={costCalculator.complexity}
                    onChange={(e) => setCostCalculator(prev => ({ ...prev, complexity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="simple">Simple (transfers)</option>
                    <option value="medium">Medium (smart contracts)</option>
                    <option value="complex">Complex (multi-step)</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Network</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Daily Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Annual Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Savings vs ETH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {costAnalysis.map((network) => {
                      const ethCost = costAnalysis.find(n => n.id === 'ethereum')?.annualCost || 0;
                      const savings = ((ethCost - network.annualCost) / ethCost * 100);
                      
                      return (
                        <tr key={network.id}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <NetworkLogo network={network} size="text-lg" />
                              <span className="font-medium">{network.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">${network.dailyCost.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm">${network.monthlyCost.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm font-bold">${network.annualCost.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm">
                            {network.id !== 'ethereum' && (
                              <span className={savings > 0 ? 'text-green-600' : 'text-red-600'}>
                                {savings > 0 ? '↓' : '↑'} {Math.abs(savings).toFixed(1)}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border mb-4">
              <h3 className="text-xl font-bold text-gray-900">Network Growth Predictions</h3>
              <p className="text-sm text-gray-500">6-Month Growth Forecast, Ordered by Projected Gains</p>
            </div>

            {/* Network Predictions List */}
            <div className="space-y-3">
              {[...rankedNetworks]
                .sort((a, b) => (b.prediction6m - b.adjustedScore) - (a.prediction6m - a.adjustedScore))
                .map(network => {
                  const growth = network.prediction6m - network.adjustedScore;
                  const confidence = (
                    (network.developerActivity / 100 * 0.3) +
                    (network.marketCorrelation * 0.3) +
                    (network.reliability / 100 * 0.4)
                  ) * 100;

                  const isExpanded = expandedPanels.has(network.id);

                  return (
                    <div key={network.id} className="bg-white rounded-lg border">
                      {/* Main Panel */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <NetworkLogo network={network} size="text-2xl" />
                            <div>
                              <h4 className="font-medium text-gray-900">{network.name}</h4>
                              <div className="text-sm text-gray-500">
                                Current Rank #{rankedNetworks.findIndex(n => n.id === network.id) + 1}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Current Score</div>
                              <div className="font-medium">{network.adjustedScore}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Predicted</div>
                              <div className="font-medium">{network.prediction6m}</div>
                            </div>
                            <div className="text-right min-w-[80px]">
                              <div className="text-sm text-gray-500">Growth</div>
                              <div className={`font-medium ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {growth > 0 ? '+' : ''}{growth.toFixed(1)}
                              </div>
                            </div>
                            <button 
                              onClick={() => togglePanel(network.id)} 
                              className="ml-4 p-2 hover:bg-gray-50 rounded-full"
                            >
                              <svg 
                                className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Details */}
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                            {/* AI Integration */}
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                AI Integration & Tech
                              </h5>
                              <ul className="space-y-2 text-sm text-gray-600 pl-4 border-l border-gray-200">
                                {growthAnalysisData[network.id]?.aiIntegration.map((tip, i) => (
                                  <li key={i}>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {/* Growth Drivers */}
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Growth Drivers & Market
                              </h5>
                              <ul className="space-y-2 text-sm text-gray-600 pl-4 border-l border-gray-200">
                                {growthAnalysisData[network.id]?.growthDrivers.map((tip, i) => (
                                  <li key={i}>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {/* Risk Assessment */}
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                Risk Assessment
                              </h5>
                              <ul className="space-y-2 text-sm text-gray-600 pl-4 border-l border-gray-200">
                                {growthAnalysisData[network.id]?.riskAssessment.map((tip, i) => (
                                  <li key={i}>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Confidence Score */}
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Prediction Confidence</span>
                              <span className="font-medium">{confidence.toFixed(0)}%</span>
                            </div>
                            <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  confidence > 80 ? 'bg-green-500' : 
                                  confidence > 60 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                                style={{ width: `${confidence}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Add Betting Interface */}
                          <BettingInterface network={network} prediction={network.prediction6m} />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Methodology Footer */}
            <div className="bg-white rounded-xl shadow-sm p-4 border mt-6">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Historical data</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Developer metrics</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Market correlation</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Technical indicators</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Network Alerts & Notifications</h3>
              
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'success' ? 'bg-green-50 border-green-400' :
                      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                      'bg-red-50 border-red-400'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{alert.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">Network: {alert.network}</span>
                            <span className="text-xs text-gray-500">• Just now</span>
                          </div>
                        </div>
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => {
                            // Remove alert logic would go here
                          }}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active alerts. All networks performing normally.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'network-details' && (
          <div className="space-y-6">
            {/* Network Selector Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Network Details</h2>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Select Network:</label>
                  <select
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 bg-white"
                  >
                    {rankedNetworks.map((network) => (
                      <option key={network.id} value={network.id}>
                        {network.name} ({network.tier}-Tier, #{network.adjustedRank})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {selectedNetworkData ? (
              <>
                {/* Network Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                  <div className="flex items-center gap-6 mb-6">
                    <NetworkLogo network={selectedNetworkData} size="text-4xl" />
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-3xl font-bold text-gray-900">{selectedNetworkData.name}</h2>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${tierColors[selectedNetworkData.tier].bg} ${tierColors[selectedNetworkData.tier].text}`}>
                          {selectedNetworkData.tier}-Tier
                        </span>
                        <span className="text-gray-500">#{selectedNetworkData.adjustedRank} in AI Readiness</span>
                      </div>
                      <p className="text-gray-600 text-lg">{selectedNetworkData.ecosystem} ecosystem • Founded {selectedNetworkData.founded}</p>
                      <p className="text-gray-500">Consensus: {selectedNetworkData.consensus}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-gray-900">{selectedNetworkData.adjustedScore}</div>
                      <div className="text-sm text-gray-500">SIR Score</div>
                    </div>
                  </div>

                  {/* Live Data Indicator */}
                  {selectedNetworkData.isLiveData && selectedNetworkData.lastUpdated && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-800 font-medium">Live Data Active</span>
                        <span className="text-green-600">
                          Last updated: {new Date(selectedNetworkData.lastUpdated).toLocaleTimeString()}
                        </span>
                      </div>
                      {selectedNetworkData.dataQuality && (
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                          {Object.entries(selectedNetworkData.dataQuality).map(([key, quality]) => (
                            <div key={key} className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${quality === 'live' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                              <span className="text-gray-600 capitalize">{key}:</span>
                              <span className={quality === 'live' ? 'text-green-700 font-medium' : 'text-yellow-700'}>
                                {quality}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Performance Metrics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Core Performance */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Core Performance</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-blue-600">{selectedNetworkData.tps.toLocaleString()}</div>
                          <div className="text-sm text-blue-700">TPS</div>
                          <div className="text-xs text-blue-600">transactions per second</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-green-600">{selectedNetworkData.finality}</div>
                          <div className="text-sm text-green-700">Finality</div>
                          <div className="text-xs text-green-600">to irreversible</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-purple-600">{selectedNetworkData.gasPrice}</div>
                          <div className="text-sm text-purple-700">Gas Price</div>
                          <div className="text-xs text-purple-600">per transaction</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-orange-600">{selectedNetworkData.uptime}%</div>
                          <div className="text-sm text-orange-700">Uptime</div>
                          <div className="text-xs text-orange-600">network reliability</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Data */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Market Data</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-indigo-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-indigo-600">{selectedNetworkData.marketCap}</div>
                          <div className="text-sm text-indigo-700">Market Cap</div>
                          <div className="text-xs text-indigo-600">total value</div>
                        </div>
                        <div className="bg-teal-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-teal-600">{selectedNetworkData.volume24h}</div>
                          <div className="text-sm text-teal-700">24h Volume</div>
                          <div className="text-xs text-teal-600">trading activity</div>
                        </div>
                        <div className="bg-pink-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-pink-600">{formatChange(selectedNetworkData.change24h)}</div>
                          <div className="text-sm text-pink-700">24h Change</div>
                          <div className="text-xs text-pink-600">price movement</div>
                        </div>
                        <div className="bg-cyan-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-cyan-600">{selectedNetworkData.prediction6m}</div>
                          <div className="text-sm text-cyan-700">6M Prediction</div>
                          <div className="text-xs text-cyan-600">forecasted score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* SIR Score Breakdown */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">SIR Score Breakdown</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'speed', label: 'Speed', color: '#3B82F6' },
                        { key: 'cost', label: 'Cost', color: '#10B981' },
                        { key: 'reliability', label: 'Reliability', color: '#8B5CF6' },
                        { key: 'devExp', label: 'Dev Experience', color: '#F59E0B' },
                        { key: 'liquidity', label: 'Liquidity', color: '#6366F1' },
                        { key: 'security', label: 'Security', color: '#EF4444' },
                        { key: 'parallel', label: 'Parallel', color: '#14B8A6' },
                        { key: 'payments', label: 'Payments', color: '#EC4899' }
                      ].map(({ key, label, color }) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full"
                                style={{ 
                                  width: `${selectedNetworkData[key]}%`,
                                  backgroundColor: color
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-8 text-right">
                              {selectedNetworkData[key]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Network Statistics */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Network Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Developer Activity</span>
                        <span className="font-medium">{selectedNetworkData.developerActivity}/100</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Community Size</span>
                        <span className="font-medium">{selectedNetworkData.communitySize.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Partnerships</span>
                        <span className="font-medium">{selectedNetworkData.partnerships}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">GitHub Stars</span>
                        <span className="font-medium">{selectedNetworkData.githubStars.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Market Correlation</span>
                        <span className="font-medium">{(selectedNetworkData.marketCorrelation * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Founded</span>
                        <span className="font-medium">{selectedNetworkData.founded}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Trends */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Trends</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">24h Change</span>
                        <div className="flex items-center gap-1">
                          {formatChange(selectedNetworkData.change24h)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">7d Change</span>
                        <div className="flex items-center gap-1">
                          {formatChange(selectedNetworkData.change7d)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">30d Change</span>
                        <div className="flex items-center gap-1">
                          {formatChange(selectedNetworkData.change30d)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">6M Prediction</span>
                        <span className="font-medium text-blue-600">{selectedNetworkData.prediction6m}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Current Rank</span>
                        <span className="font-medium">#{selectedNetworkData.adjustedRank}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Profile Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Profile</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={getDimensionData(selectedNetworkData)}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" className="text-xs" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" />
                        <Radar 
                          name={selectedNetworkData.name} 
                          dataKey="value" 
                          stroke={tierColors[selectedNetworkData.tier].accent}
                          fill={tierColors[selectedNetworkData.tier].accent}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Historical Performance */}
                {historicalData[selectedNetwork] && (
                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Historical Performance (1 Year)</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData[selectedNetwork]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          />
                          <YAxis 
                            domain={[50, 100]} 
                            ticks={[50, 60, 70, 80, 90, 100]}
                            tickFormatter={(value) => `${value}`}
                          />
                          <Tooltip 
                            labelFormatter={(date) => new Date(date).toLocaleDateString()}
                            formatter={(value, name) => [
                              name === 'score' ? value.toFixed(1) : value.toLocaleString(),
                              name === 'score' ? 'SIR Score' : 
                              name === 'volume' ? 'Volume ($)' :
                              name === 'transactions' ? 'Transactions' : 'Active Users'
                            ]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#3B82F6" 
                            strokeWidth={2}
                            dot={false}
                            name="score"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 border text-center">
                <Info className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Network Selected</h3>
                <p className="text-gray-600">Use the dropdown above to select a network and view its detailed information</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SIRDashboard;
