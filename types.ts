

export enum Rarity {
  COMMON = "Common",
  UNCOMMON = "Uncommon",
  RARE = "Rare",
  EPIC = "Epic",
  LEGENDARY = "Legendary",
  MYTHIC = "Mythic"
}

export interface NFTItem {
  id: string;
  name: string;
  imageUrl: string;
  rarity: Rarity;
  rarityColor: string; // Tailwind color class e.g., text-green-400
  description: string;
  sellPriceTon?: number; // Price for which the user can sell this NFT
}

export interface CaseLoot {
  nftId: string;
  weight: number; // Higher weight means higher chance
}

export interface Case {
  id: string;
  name: string;
  priceTon: number;
  imageUrl: string;
  lootTable: CaseLoot[];
  description: string;
}

// Type for the actual NFT object won, not just the ID.
export type ChosenNFT = NFTItem;

// Type for NFT items in the user's inventory, with a unique instance ID
export interface InventoryNFTItem extends NFTItem {
  instanceId: string;
}

// Crash Game Types
export enum CrashGameState {
  IDLE = "IDLE", // Initial state, or between rounds after CRASHED_DISPLAY
  BETTING = "BETTING", // Players can place bets
  STARTING_ROUND = "STARTING_ROUND", // Brief countdown before multiplier starts
  RUNNING = "RUNNING", // Multiplier is increasing
  CRASHED = "CRASHED", // Multiplier has crashed, showing final value
}

export interface CrashGamePhaseTimings {
  IDLE_DURATION: number; // ms, time before betting starts
  BETTING_DURATION: number; // ms, time players have to bet
  STARTING_ROUND_DURATION: number; // ms, "Starting in..."
  CRASHED_DISPLAY_DURATION: number; // ms, how long to show "CRASHED @ X.XXx"
  MULTIPLIER_INCREMENT_INTERVAL: number; // ms, how often to update multiplier
}

export interface CrashRound {
  id: string; // Unique ID for the round
  crashPoint: number; // The multiplier at which this round crashed
  timestamp: number; // When the round ended
}

export interface CrashDataPoint {
  time: number; // Timestamp or relative time
  multiplier: number;
}

// User's Crash Bet History
export enum UserCrashBetOutcome {
  WIN = "WIN",
  LOSS = "LOSS"
}

export interface UserCrashBetRecord {
  id: string;
  timestamp: number;
  betAmount: number;
  outcome: UserCrashBetOutcome;
  cashOutMultiplier?: number; // Multiplier at which user cashed out (if WIN)
  crashPoint: number; // The multiplier at which the game round crashed
  profit: number; // Positive for win, negative for loss
}

// User's Case Opening History
export interface UserCaseOpeningRecord {
  id: string;
  timestamp: number;
  caseName: string;
  casePriceTon: number; // Added case price
  wonNftName: string;
  wonNftImageUrl: string;
  wonNftRarity: Rarity;
}

// User's Sold Items History
export interface UserSoldItemRecord {
  id: string;
  timestamp: number;
  itemName: string;
  itemImageUrl: string;
  itemRarity: Rarity;
  soldForPriceTon: number;
}

// User Withdrawal Requests
export enum UserWithdrawalRequestStatus {
    PENDING = "Pending",
    PROCESSED = "Processed", // For potential future use if status tracking is expanded
    REJECTED = "Rejected"   // For potential future use
}

export interface UserWithdrawalRequest {
    id: string;
    timestamp: number;
    amount: number;
    recipientAddress: string;
    status: UserWithdrawalRequestStatus;
}