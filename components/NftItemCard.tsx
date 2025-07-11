import React from 'react';
import type { NFTItem, Rarity } from '../types'; // Assuming types.ts is in the root

interface NftItemCardProps {
  nft: NFTItem;
  showSellButton?: boolean;
  onSell?: (nftId: string) => void; // Assuming selling by NFT ID, adjust if using instance ID
}

const rarityColorMap: Record<Rarity, string> = {
  [Rarity.COMMON]: 'border-slate-500',
  [Rarity.UNCOMMON]: 'border-green-500',
  [Rarity.RARE]: 'border-blue-500',
  [Rarity.EPIC]: 'border-purple-500',
  [Rarity.LEGENDARY]: 'border-orange-500',
  [Rarity.MYTHIC]: 'border-red-600',
};

const rarityTextColorMap: Record<Rarity, string> = {
  [Rarity.COMMON]: 'text-slate-400',
  [Rarity.UNCOMMON]: 'text-green-400',
  [Rarity.RARE]: 'text-blue-400',
  [Rarity.EPIC]: 'text-purple-400',
  [Rarity.LEGENDARY]: 'text-orange-400',
  [Rarity.MYTHIC]: 'text-red-500',
};

export const NftItemCard: React.FC<NftItemCardProps> = ({ nft, showSellButton, onSell }) => {
  return (
    <div className={`bg-slate-700/50 p-4 rounded-lg shadow-md border-2 ${rarityColorMap[nft.rarity]} text-center w-full max-w-xs mx-auto`}>
      <img src={nft.imageUrl} alt={nft.name} className="w-full h-40 object-contain mx-auto mb-3 rounded" />
      <h4 className="text-lg font-semibold text-slate-100 truncate" title={nft.name}>{nft.name}</h4>
      <p className={`text-sm font-medium ${rarityTextColorMap[nft.rarity]} mb-1`}>{nft.rarity}</p>
      {typeof nft.sellPriceTon === 'number' && (
        <p className="text-xs text-slate-300 mb-3">Est. Value: {nft.sellPriceTon.toFixed(2)} TON</p>
      )}
      {showSellButton && onSell && typeof nft.sellPriceTon === 'number' && nft.sellPriceTon > 0 && (
        <button
          onClick={() => onSell(nft.id)} // Adjust if selling by instanceId
          className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-3 rounded-md text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Sell for {nft.sellPriceTon.toFixed(2)} TON
        </button>
      )}
    </div>
  );
};
