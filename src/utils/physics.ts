// Utility functions for physics calculations
// Ported from stock_physics.py

export interface StockData {
  ticker: string;
  price: number;
  change_pct: number;
  week_change: number;
  month_change: number;
  volume: number;
  market_cap: number;
  operating_margin: number;
  revenue_growth: number;
  rule_of_40: number;
  pe_ratio: number;
  beta: number;
  volatility: number;
  debt_to_equity: number;
  sector: string;
}

export interface BubbleProperties extends StockData {
  color: string;
  glowColor: string;
  size: number;
  glow: number;
  opacity: number;
  pulse_speed: number;
  elasticity: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

/**
 * Normalize value from one range to another
 */
export function normalize(
  value: number,
  min_val: number,
  max_val: number,
  target_min: number = 0,
  target_max: number = 1
): number {
  if (max_val === min_val) return target_min;
  const normalized = (value - min_val) / (max_val - min_val);
  return target_min + normalized * (target_max - target_min);
}

/**
 * Map stock performance to intuitive color
 * Blue (falling) → Yellow → Orange → Red (rising)
 */
export function getStockColor(change_pct: number, rule_of_40: number = 0): string {
  // Base hue from price change
  let hue: number;
  if (change_pct >= 3) {
    hue = 0; // Red for strong gains
  } else if (change_pct >= 1) {
    hue = 30; // Orange for moderate gains
  } else if (change_pct >= 0) {
    hue = 50; // Yellow for small gains
  } else if (change_pct >= -1) {
    hue = 180; // Cyan for small losses
  } else if (change_pct >= -3) {
    hue = 200; // Light blue for moderate losses
  } else {
    hue = 220; // Deep blue for strong losses
  }

  // Saturation from Rule of 40 (higher score = more vivid)
  const saturation = Math.min(100, Math.max(40, 50 + Math.abs(rule_of_40) / 2));

  // Lightness - make it visible on dark background
  const lightness = 60;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Calculate glow intensity based on Rule of 40 score
 * Higher score = brighter glow (better value)
 */
export function getGlowIntensity(rule_of_40: number): number {
  if (rule_of_40 >= 80) {
    return 1.0; // Maximum glow
  } else if (rule_of_40 >= 40) {
    return 0.5 + (rule_of_40 - 40) / 80; // 0.5 to 1.0
  } else if (rule_of_40 >= 0) {
    return 0.2 + (rule_of_40 / 40) * 0.3; // 0.2 to 0.5
  } else {
    return 0.1; // Minimal glow for negative scores
  }
}

/**
 * Calculate glow color based on Rule of 40
 * High score = Gold/White glow
 * Low score = Base color glow
 */
export function getGlowColor(rule_of_40: number, base_color: string): string {
  if (rule_of_40 >= 60) {
    return '#ffd700'; // Gold for high performers
  } else if (rule_of_40 >= 40) {
    return '#ffffff'; // White for good performers
  } else {
    return base_color; // Base color for others
  }
}

/**
 * Calculate bubble size from market cap
 * Uses logarithmic scale to handle wide range of market caps
 */
export function getBubbleSize(market_cap: number, all_market_caps: number[]): number {
  if (market_cap <= 0) return 0.5;

  // Use log scale for better visualization
  const log_cap = Math.log10(market_cap + 1);
  const min_log = Math.log10(Math.min(...all_market_caps) + 1);
  const max_log = Math.log10(Math.max(...all_market_caps) + 1);

  // Map to size range: 0.5 to 3.0 (Three.js units)
  const size = normalize(log_cap, min_log, max_log, 0.5, 3.0);
  return size;
}

/**
 * Calculate pulse animation speed based on trading volume
 * Higher volume = faster pulse
 */
export function getPulseSpeed(volume: number, all_volumes: number[]): number {
  if (!all_volumes.length || volume <= 0) return 1.0;

  // Normalize volume to 0.5 - 3.0 range (animation speed multiplier)
  const normalized = normalize(volume, Math.min(...all_volumes), Math.max(...all_volumes), 0.5, 3.0);
  return normalized;
}

/**
 * Calculate opacity based on debt levels
 * Higher debt = more transparent (ghostly)
 */
export function getOpacity(debt_to_equity: number): number {
  if (debt_to_equity <= 0) {
    return 1.0; // Fully opaque
  } else if (debt_to_equity <= 50) {
    return 1.0; // Healthy debt
  } else if (debt_to_equity <= 150) {
    return 0.9 - ((debt_to_equity - 50) / 100) * 0.3; // 0.9 to 0.6
  } else {
    return Math.max(0.4, 0.6 - ((debt_to_equity - 150) / 200) * 0.2); // 0.6 to 0.4
  }
}

/**
 * Calculate velocity vector based on growth and momentum
 */
export function getVelocityVector(
  revenue_growth: number,
  momentum: number
): { vx: number; vy: number; vz: number } {
  // Revenue growth determines speed
  const speed = Math.abs(revenue_growth) / 20; // Scale down for reasonable movement

  // Positive growth = upward/rightward, negative = downward/leftward
  const angle = revenue_growth >= 0 ? 45 : -135; // degrees
  const angle_rad = (angle * Math.PI) / 180;

  let vx = speed * Math.cos(angle_rad);
  let vy = speed * Math.sin(angle_rad);

  // Add momentum component
  vy += momentum / 100;

  return { vx, vy, vz: 0 };
}

/**
 * Calculate bounce/elasticity from volatility
 * Higher volatility = more bouncy
 */
export function getElasticity(volatility: number): number {
  if (volatility <= 0) return 0.5;

  const elasticity = Math.min(1.0, 0.3 + volatility / 100);
  return elasticity;
}

/**
 * Calculate all visual properties for stock bubbles
 */
export function calculateBubbleProperties(stocks: StockData[]): BubbleProperties[] {
  const all_caps = stocks.map((s) => s.market_cap);
  const all_volumes = stocks.map((s) => s.volume);

  return stocks.map((stock) => {
    const velocity = getVelocityVector(stock.revenue_growth, stock.month_change);

    return {
      ...stock,
      color: getStockColor(stock.change_pct, stock.rule_of_40),
      glowColor: getGlowColor(stock.rule_of_40, getStockColor(stock.change_pct, stock.rule_of_40)),
      size: getBubbleSize(stock.market_cap, all_caps),
      glow: getGlowIntensity(stock.rule_of_40),
      opacity: getOpacity(stock.debt_to_equity),
      pulse_speed: getPulseSpeed(stock.volume, all_volumes),
      elasticity: getElasticity(stock.volatility),
      x: (Math.random() - 0.5) * 40, // Random initial positions
      y: (Math.random() - 0.5) * 40,
      z: (Math.random() - 0.5) * 40,
      vx: velocity.vx,
      vy: velocity.vy,
      vz: velocity.vz,
    };
  });
}
