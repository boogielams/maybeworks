import { useState, useEffect } from 'react';

// Static BSC data - no API calls to avoid CORS errors
export const fetchBSCData = async () => {
  // Return static data that matches the current score
  return {
    price: 315.50,
    marketCap: '$46.5B',
    volume24h: '$1.8B',
    change24h: 0.8,
    change7d: -2.1,
    change30d: 5.2,
    tps: 300,
    finality: 3.0,
    gasPrice: '$0.000005',
    uptime: 99.9,
    totalTransactions: 3500000000000,
    activeAddresses: 3500000,
    totalValueLocked: 4500000000,
    validatorCount: 21,
    averageBlockTime: 3.0,
    successRate: 99.9,
    networkLoad: 78.5,
    feeRevenue: 45000000,
    stakingRewards: 4.5,
    governanceParticipation: 25.2,
    developerActivity: 78,
    communitySize: 150000,
    partnerships: 85,
    githubStars: 12000,
    ecosystemProjects: 650,
    totalSupply: 168000000,
    circulatingSupply: 155000000,
    stakingRatio: 25.2,
    inflationRate: 3.5,
    maxSupply: 168000000,
    burnRate: 0.1,
    treasuryBalance: 250000000,
    protocolRevenue: 85000000,
    validatorRewards: 45000000,
    networkSecurity: 85,
    decentralizationScore: 45,
    energyEfficiency: 75,
    regulatoryCompliance: 70,
    institutionalAdoption: 85,
    retailAdoption: 92,
    defiTvl: 4500000000,
    nftVolume: 350000000,
    gamingActivity: 280000000,
    socialMetrics: {
      twitterFollowers: 2500000,
      discordMembers: 650000,
      telegramMembers: 450000,
      redditSubscribers: 180000,
      youtubeSubscribers: 150000,
      githubContributors: 7800,
      developerGrowth: 6.8,
      communityGrowth: 5.2,
      engagementRate: 4.8,
      sentimentScore: 6.2
    },
    technicalMetrics: {
      blockHeight: 350000000,
      epochNumber: 650,
      slotLeader: "0x1234567890abcdef1234567890abcdef12345678",
      currentEpochProgress: 68.5,
      averageSlotTime: 3.0,
      missedSlots: 0.005,
      validatorPerformance: 99.9,
      networkLatency: 65,
      dataAvailability: 99.9,
      crossChainBridges: 18,
      oracleIntegrations: 15,
      privacyFeatures: 3,
      scalabilityMetrics: {
        horizontalScaling: 65,
        verticalScaling: 75,
        shardingReadiness: 60,
        parallelProcessing: 0,
        stateCompression: 55
      }
    },
    marketMetrics: {
      dominance: 2.8,
      correlation: 0.95,
      volatility: 0.58,
      beta: 0.9,
      sharpeRatio: 1.8,
      maxDrawdown: -38.5,
      recoveryTime: 140,
      institutionalHoldings: 45.2,
      retailHoldings: 54.8,
      longTermHolders: 62.8,
      shortTermTraders: 37.2,
      whaleConcentration: 55.1,
      exchangeReserves: 25.3,
      defiLocked: 35.2,
      stakingLocked: 25.2,
      circulatingVelocity: 0.88,
      realizedCap: 42000000000,
      mvrvRatio: 1.11,
      sopr: 1.03,
      nvtRatio: 38.5,
      pnlRatio: 1.02
    },
    ecosystemMetrics: {
      totalProjects: 650,
      activeProjects: 580,
      newProjects: 45,
      defiProtocols: 180,
      nftMarketplaces: 25,
      gamingPlatforms: 35,
      infrastructureTools: 120,
      developerTools: 95,
      analyticsPlatforms: 35,
      walletIntegrations: 55,
      exchangeListings: 150,
      institutionalProducts: 20,
      regulatoryCompliance: 70,
      insuranceCoverage: 75,
      auditCoverage: 80,
      bugBountyPrograms: 15,
      governanceProposals: 45,
      communityVotes: 120000,
      treasuryAllocation: 250000000,
      grantPrograms: 8,
      acceleratorPrograms: 6,
      educationalResources: 22,
      documentationQuality: 85,
      developerSupport: 78,
      communityModeration: 75,
      contentCreation: 1200,
      eventParticipation: 82,
      partnershipAnnouncements: 18,
      integrationAnnouncements: 32,
      upgradeFrequency: 10,
      featureReleases: 42,
      securityUpdates: 8,
      performanceImprovements: 12,
      userExperience: 88,
      accessibility: 85,
      mobileSupport: 90,
      crossPlatformCompatibility: 85,
      apiStability: 88,
      backwardCompatibility: 85,
      migrationTools: 78,
      developerOnboarding: 82,
      communityOnboarding: 85,
      institutionalOnboarding: 85,
      regulatoryOnboarding: 65,
      geographicDistribution: {
        northAmerica: 25.2,
        europe: 22.8,
        asia: 45.1,
        southAmerica: 4.2,
        africa: 1.8,
        oceania: 0.9
      },
      demographicDistribution: {
        developers: 22.1,
        traders: 28.5,
        investors: 35.2,
        enthusiasts: 10.8,
        institutions: 3.4
      }
    }
  };
};

// Simple hook for React components
export const useBSCData = (refreshInterval = 30000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const bscData = await fetchBSCData();
        setData(bscData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data, loading, error };
}; 