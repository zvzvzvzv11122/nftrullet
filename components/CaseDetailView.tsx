import React from 'react';
import type { Case, NFTItem } from '../types'; // Assuming types.ts is in the root
import { NFT_ITEMS } from '../constants'; // Assuming constants.ts is in the root
import { NftItemCard } from './NftItemCard'; // Assuming NftItemCard is in the same directory

interface CaseDetailViewProps {
  caseData: Case;
  onOpenCase: (caseData: Case) => void;
  onBack: () => void;
  balance: number; // User's current TON balance
  isOpening: boolean; // To disable button while another case is opening
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({ caseData, onOpenCase, onBack, balance, isOpening }) => {
  const caseItems = caseData.lootTable
    .map(loot => {
      const item = NFT_ITEMS.find(nft => nft.id === loot.nftId);
      return item ? { ...item, weight: loot.weight } : null;
    })
    .filter(item => item !== null) as (NFTItem & { weight: number })[];

  // Optional: Calculate total weight for probability display, though not strictly needed for just listing
  const totalWeight = caseItems.reduce((sum, item) => sum + item.weight, 0);

  const canAfford = balance >= caseData.priceTon;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <button
        onClick={onBack}
        className="mb-6 text-sm text-sky-400 hover:text-sky-300 transition-colors flex items-center group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 transform transition-transform group-hover:-translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back to Gift Boxes
      </button>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* Left Side: Case Image and Open Button */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="bg-slate-800 p-4 rounded-lg shadow-lg text-center sticky top-6">
            <img src={caseData.imageUrl} alt={caseData.name} className="w-full h-auto object-contain mx-auto mb-4 rounded max-h-60" />
            <h2 className="text-2xl font-semibold text-slate-100 mb-2">{caseData.name}</h2>
            <p className="text-sky-400 font-bold text-xl mb-1">{caseData.priceTon.toFixed(2)} TON</p>
            <p className="text-xs text-slate-400 mb-4">Your balance: {balance.toFixed(2)} TON</p>

            <button
              onClick={() => onOpenCase(caseData)}
              disabled={isOpening || !canAfford}
              className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-150
                ${isOpening ? 'opacity-50 cursor-not-allowed' : ''}
                ${!canAfford ? 'opacity-50 cursor-not-allowed bg-red-700 hover:bg-red-700' : ''}
                focus:outline-none focus:ring-2 focus:ring-green-400`}
            >
              {isOpening ? 'Opening...' : (canAfford ? 'Open Gift Box' : 'Insufficient TON')}
            </button>
            {!canAfford && !isOpening && (
                <p className="text-red-400 text-xs mt-2">You need { (caseData.priceTon - balance).toFixed(2) } more TON.</p>
            )}
          </div>
        </div>

        {/* Right Side: Contained Items */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <h3 className="text-xl font-semibold text-slate-100 mb-1">Contains one of the following:</h3>
          <p className="text-xs text-slate-400 mb-5">Item chances are based on their rarity and assigned weight.</p>

          {caseItems.length === 0 ? (
            <p className="text-slate-400">No items found in this gift box (this might be an error).</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {caseItems.sort((a,b) => b.weight - a.weight) /* Optional: sort by weight or rarity */
                .map(item => (
                <div key={item.id} className="relative">
                    <NftItemCard nft={item} />
                    {/* Optional: Display probability if desired */}
                    {/* <p className="text-center text-xs text-slate-500 mt-1">~{((item.weight / totalWeight) * 100).toFixed(1)}% chance</p> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
