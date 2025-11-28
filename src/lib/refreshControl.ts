// src/lib/refreshControl.ts

const REFRESH_COOLDOWN = 2000; // 2 seconds between refreshes
let lastRefreshTime = 0;

export const canRefresh = (): boolean => {
  const now = Date.now();
  const timeSinceLastRefresh = now - lastRefreshTime;
  
  if (timeSinceLastRefresh < REFRESH_COOLDOWN) {
    console.warn(`Please wait ${Math.ceil((REFRESH_COOLDOWN - timeSinceLastRefresh) / 1000)}s before refreshing again`);
    return false;
  }
  
  lastRefreshTime = now;
  return true;
};

export const resetRefreshTimer = () => {
  lastRefreshTime = 0;
};

export const getTimeUntilNextRefresh = (): number => {
  const now = Date.now();
  const timeSinceLastRefresh = now - lastRefreshTime;
  const remaining = REFRESH_COOLDOWN - timeSinceLastRefresh;
  return remaining > 0 ? remaining : 0;
};
