type StakingPool = {
    Id: number;
    apy: number;
    lockDuration: number;
  };
  
  type UserStakingInfo = {
    claimableTokens: number;
    lastUpdate: number;
    stakingDuration: number;
    stakingPool: StakingPool;
    stakingStartDate: number;
    totalStaked: number;
    userId: string;
    walletAddress: string;
  };