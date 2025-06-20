import { useState, useEffect } from 'react';

// Static developer data - no API calls to avoid CORS errors
export const fetchDeveloperData = async (networkId) => {
  // Return static data that matches realistic developer activity
  const developerData = {
    ethereum: {
      activeDevelopers: 8500,
      repositories: 8386,
      monthlyCommits: 45000,
      ecosystem: 'Dominant',
      githubStars: 25000,
      contributors: 15000,
      forks: 12500,
      issues: 8500,
      pullRequests: 6500,
      languages: {
        solidity: 45,
        javascript: 25,
        typescript: 20,
        python: 5,
        go: 3,
        rust: 2
      }
    },
    solana: {
      activeDevelopers: 3200,
      repositories: 8045,
      monthlyCommits: 28000,
      ecosystem: 'Mature',
      githubStars: 12500,
      contributors: 8500,
      forks: 6500,
      issues: 4200,
      pullRequests: 3200,
      languages: {
        rust: 60,
        javascript: 20,
        typescript: 15,
        python: 3,
        go: 2
      }
    },
    base: {
      activeDevelopers: 1200,
      repositories: 4000,
      monthlyCommits: 15000,
      ecosystem: 'Growing',
      githubStars: 8900,
      contributors: 1200,
      forks: 2800,
      issues: 1800,
      pullRequests: 1200,
      languages: {
        solidity: 50,
        javascript: 25,
        typescript: 20,
        python: 3,
        go: 2
      }
    },
    sei: {
      activeDevelopers: 450,
      repositories: 850,
      monthlyCommits: 8000,
      ecosystem: 'Emerging',
      githubStars: 1250,
      contributors: 850,
      forks: 650,
      issues: 450,
      pullRequests: 350,
      languages: {
        rust: 70,
        javascript: 15,
        typescript: 10,
        python: 3,
        go: 2
      }
    },
    sui: {
      activeDevelopers: 680,
      repositories: 1200,
      monthlyCommits: 12000,
      ecosystem: 'Emerging',
      githubStars: 2100,
      contributors: 650,
      forks: 850,
      issues: 520,
      pullRequests: 420,
      languages: {
        rust: 65,
        javascript: 20,
        typescript: 10,
        python: 3,
        go: 2
      }
    },
    polygon: {
      activeDevelopers: 2100,
      repositories: 3200,
      monthlyCommits: 18000,
      ecosystem: 'Mature',
      githubStars: 8500,
      contributors: 5200,
      forks: 4200,
      issues: 2800,
      pullRequests: 2200,
      languages: {
        solidity: 45,
        javascript: 25,
        typescript: 20,
        python: 5,
        go: 3,
        rust: 2
      }
    },
    arbitrum: {
      activeDevelopers: 1800,
      repositories: 2800,
      monthlyCommits: 16000,
      ecosystem: 'Mature',
      githubStars: 7200,
      contributors: 4500,
      forks: 3800,
      issues: 2500,
      pullRequests: 1900,
      languages: {
        solidity: 50,
        javascript: 25,
        typescript: 20,
        python: 3,
        go: 2
      }
    },
    optimism: {
      activeDevelopers: 1600,
      repositories: 2400,
      monthlyCommits: 14000,
      ecosystem: 'Mature',
      githubStars: 6800,
      contributors: 4200,
      forks: 3500,
      issues: 2300,
      pullRequests: 1800,
      languages: {
        solidity: 50,
        javascript: 25,
        typescript: 20,
        python: 3,
        go: 2
      }
    },
    avalanche: {
      activeDevelopers: 1200,
      repositories: 1800,
      monthlyCommits: 10000,
      ecosystem: 'Mature',
      githubStars: 5200,
      contributors: 3200,
      forks: 2800,
      issues: 1800,
      pullRequests: 1400,
      languages: {
        javascript: 40,
        typescript: 30,
        go: 20,
        python: 5,
        solidity: 3,
        rust: 2
      }
    },
    bsc: {
      activeDevelopers: 2800,
      repositories: 4200,
      monthlyCommits: 22000,
      ecosystem: 'Mature',
      githubStars: 12000,
      contributors: 7800,
      forks: 5800,
      issues: 3800,
      pullRequests: 2900,
      languages: {
        solidity: 45,
        javascript: 25,
        typescript: 20,
        python: 5,
        go: 3,
        rust: 2
      }
    }
  };

  const data = developerData[networkId];
  if (!data) {
    throw new Error(`No developer data available for ${networkId}`);
  }

  return {
    lastUpdated: new Date().toISOString(),
    dataQuality: {
      activeDevelopers: 'estimated',
      repositories: 'estimated',
      monthlyCommits: 'estimated',
      ecosystem: 'static'
    },
    ...data,
    isLiveData: false
  };
};

// Hook to get developer data for all networks
export const fetchAllDeveloperData = async () => {
  const networkIds = ['ethereum', 'solana', 'base', 'sei', 'sui', 'polygon', 'arbitrum', 'optimism', 'avalanche', 'bsc'];
  
  const allData = {};
  
  for (const networkId of networkIds) {
    try {
      allData[networkId] = await fetchDeveloperData(networkId);
    } catch (error) {
      console.error(`Error fetching developer data for ${networkId}:`, error);
    }
  }
  
  return allData;
};

// Simple hook for React components
export const useAllDeveloperData = (refreshInterval = 300000) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allData = await fetchAllDeveloperData();
        setData(allData);
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