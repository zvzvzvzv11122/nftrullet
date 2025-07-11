

import { Rarity, type CrashGamePhaseTimings } from './types';
import type { NFTItem, Case } from './types';

// export const INITIAL_TON_BALANCE = 1000; // Removed: New wallets start at 0, existing load saved.

// IMPORTANT: Replace this with your actual TON wallet address where you want to receive deposits.
// This is a placeholder address. If you don't change it, funds will be sent to this example address.
export const APP_WALLET_ADDRESS = "UQBwDwHoaO4ui_VtMr7c5NiB1lKps-yBGJlORQun_bPQvV75"; 

export const TON_NANO_MULTIPLIER = 10**9; // 1 TON = 1,000,000,000 nanoTON

// Basic regex for TON address validation (starts with UQ or EQ, 48 chars long, Base64 URL characters)
// This is a simplified check. Robust validation is more complex.
export const TON_ADDRESS_REGEX = /^(UQ|EQ)[A-Za-z0-9_-]{46}$/;

export const NFT_ITEMS: NFTItem[] = [
  { 
    id: "nft1", name: "Pixelated TON Diamond", 
    imageUrl: "img/diamond_pixel.png",
    rarity: Rarity.COMMON, rarityColor: "text-slate-400",
    description: "A common, yet charming, pixel art TON diamond.",
    sellPriceTon: 2
  },
  { 
    id: "nft2", name: "Telegram Glider Sticker", 
    imageUrl: "https://picsum.photos/seed/nft2/200/200", 
    rarity: Rarity.COMMON, rarityColor: "text-slate-400",
    description: "A popular animated sticker for your collection.",
    sellPriceTon: 1
  },
  { 
    id: "nft3", name: "Uncommon TON Pouch", 
    imageUrl: "https://picsum.photos/seed/nft3/200/200", 
    rarity: Rarity.UNCOMMON, rarityColor: "text-green-400",
    description: "A slightly more valuable pouch of TON. What's inside?",
    sellPriceTon: 3
  },
  { 
    id: "nft4", name: "Animated Doge Emoji", 
    imageUrl: "https://picsum.photos/seed/nft4/200/200", 
    rarity: Rarity.UNCOMMON, rarityColor: "text-green-400",
    description: "Wow. Such animation. Much emoji.",
    sellPriceTon: 3
  },
  { 
    id: "nft5", name: "Rare TON Crystal", 
    imageUrl: "https://picsum.photos/seed/nft5/200/200", 
    rarity: Rarity.RARE, rarityColor: "text-blue-400",
    description: "A beautifully cut TON crystal, shimmering with potential.",
    sellPriceTon: 8
  },
  { 
    id: "nft6", name: "Telegram Premium Badge (3 Months)", 
    imageUrl: "https://picsum.photos/seed/nft6/200/200", 
    rarity: Rarity.RARE, rarityColor: "text-blue-400",
    description: "Unlock premium features in Telegram for 3 months!",
    sellPriceTon: 10
  },
  { 
    id: "nft7", name: "Epic TON Vault Key", 
    imageUrl: "https://picsum.photos/seed/nft7/200/200", 
    rarity: Rarity.EPIC, rarityColor: "text-purple-400",
    description: "This key unlocks a vault filled with digital wonders.",
    sellPriceTon: 20
  },
  { 
    id: "nft8", name: "Founder's Telegram Jet", 
    imageUrl: "https://picsum.photos/seed/nft8/200/200", 
    rarity: Rarity.EPIC, rarityColor: "text-purple-400",
    description: "A unique digital jet, rumored to belong to a Telegram founder.",
    sellPriceTon: 25
  },
  { 
    id: "nft9", name: "Legendary TON Sceptre", 
    imageUrl: "https://picsum.photos/seed/nft9/200/200", 
    rarity: Rarity.LEGENDARY, rarityColor: "text-amber-400",
    description: "A sceptre of immense power in the TON ecosystem.",
    sellPriceTon: 50
  },
  { 
    id: "nft10", name: "Eternal Telegram Channel", 
    imageUrl: "https://picsum.photos/seed/nft10/200/200", 
    rarity: Rarity.LEGENDARY, rarityColor: "text-amber-400",
    description: "Ownership of a conceptual eternal Telegram channel. Priceless.",
    sellPriceTon: 40
  },
  {
    id: "nft11", name: "Mythic TON Orb",
    imageUrl: "https://picsum.photos/seed/nft11/200/200",
    rarity: Rarity.MYTHIC, rarityColor: "text-red-500",
    description: "An orb of pure TON energy, pulsating with untold power.",
    sellPriceTon: 80
  },
  {
    id: "nft12", name: "Cosmic Telegram Cat",
    imageUrl: "https://picsum.photos/seed/nft12/200/200", 
    rarity: Rarity.MYTHIC, rarityColor: "text-red-500",
    description: "A cat that has seen the birth and death of Telegram servers. Knows all.",
    sellPriceTon: 100
  },
  // New Cat NFTs
  { 
    id: "catNft1", name: "Creeper Cat", 
    imageUrl: "img/cat_creeper.png", 
    rarity: Rarity.RARE, rarityColor: "text-blue-400",
    description: "A strangely familiar feline. Hssss...",
    sellPriceTon: 8
  },
  { 
    id: "catNft2", name: "Shadow Cat", 
    imageUrl: "img/cat_shadow.png", 
    rarity: Rarity.UNCOMMON, rarityColor: "text-green-400",
    description: "This cat walks in shadows, unseen and mysterious.",
    sellPriceTon: 4
  },
  { 
    id: "catNft3", name: "Galaxy Cat", 
    imageUrl: "img/cat_galaxy.png", 
    rarity: Rarity.RARE, rarityColor: "text-blue-400",
    description: "A cat shimmering with cosmic dust and stellar beauty.",
    sellPriceTon: 10
  },
  { 
    id: "catNft4", name: "Silver Cat", 
    imageUrl: "img/cat_silver.png", 
    rarity: Rarity.UNCOMMON, rarityColor: "text-green-400",
    description: "Sleek and silver, a truly cool and elegant cat.",
    sellPriceTon: 4
  },
  { 
    id: "catNft5", name: "Alien Cat", 
    imageUrl: "img/cat_alien.png", 
    rarity: Rarity.UNCOMMON, rarityColor: "text-green-400",
    description: "Its gaze pierces the ordinary. From another world?",
    sellPriceTon: 5
  },
  { 
    id: "catNft6", name: "Aqua Cat", 
    imageUrl: "img/cat_aqua.png", 
    rarity: Rarity.UNCOMMON, rarityColor: "text-green-400",
    description: "A fluid feline, cool, refreshing, and ever-changing.",
    sellPriceTon: 4
  },
  { 
    id: "catNft7", name: "Inferno Cat", 
    imageUrl: "img/cat_inferno.png", 
    rarity: Rarity.RARE, rarityColor: "text-blue-400",
    description: "This cat burns with a fiery spirit and intense gaze.",
    sellPriceTon: 9
  }
];

export const CASES: Case[] = [
  {
    id: "caseCats",
    name: "Cats NFT",
    priceTon: 15,
    imageUrl: "img/cats_nft_case.gif", 
    description: "A special case full of unique cat-themed NFTs! Each with a 12.5% drop chance.",
    lootTable: [
      { nftId: "catNft1", weight: 12.5 }, 
      { nftId: "catNft2", weight: 12.5 }, 
      { nftId: "catNft3", weight: 12.5 }, 
      { nftId: "catNft4", weight: 12.5 }, 
      { nftId: "catNft5", weight: 12.5 }, 
      { nftId: "catNft6", weight: 12.5 }, 
      { nftId: "catNft7", weight: 12.5 }, 
      { nftId: "nft1", weight: 12.5 },   
    ],
  }
];

// Crash Game Constants
export const CRASH_GAME_PHASE_TIMINGS: CrashGamePhaseTimings = {
  IDLE_DURATION: 3000, // Time before betting starts for a new round
  BETTING_DURATION: 10000, // Players have 10 seconds to bet
  STARTING_ROUND_DURATION: 3000, // "Starting in 3, 2, 1..."
  CRASHED_DISPLAY_DURATION: 5000, // Show "CRASHED @ X.XXx" for 5 seconds
  MULTIPLIER_INCREMENT_INTERVAL: 100, // Update multiplier every 100ms
};

export const CRASH_GAME_MAX_HISTORY = 10; // Show last 10 crash points (general game history)
export const USER_CRASH_BET_HISTORY_MAX_LENGTH = 20; // Show last 20 user bet records
export const USER_CASE_OPENING_HISTORY_MAX_LENGTH = 20; // Show last 20 user case opening records
export const USER_SOLD_ITEMS_HISTORY_MAX_LENGTH = 20; // Show last 20 user sold item records
export const USER_WITHDRAWAL_REQUESTS_MAX_LENGTH = 20; // Show last 20 user withdrawal requests


export const CRASH_GAME_HOUSE_EDGE_PROBABILITY = 0.01; // 1% chance of instant 1.00x crash
// Power for Math.pow(Math.random(), POWER_FOR_SKEW) in crash point generation.
// Higher value = more skewed towards lower crash points.
export const CRASH_POINT_SKEW_POWER = 2.5; 
// To prevent extremely high multipliers (e.g. 1/(1-0.99999))
// this limits the random factor `x` in `1/(1-x)` to this value.
// e.g. 0.999 gives max ~1000x. 0.99 gives max ~100x.
export const CRASH_POINT_MAX_RANDOM_FACTOR = 0.995; // Max theoretical multiplier around 200x
