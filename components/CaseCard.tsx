import React from 'react';
import type { Case } from '../types'; // Assuming types.ts is in the root

interface CaseCardProps {
  caseData: Case;
  onViewDetails: (caseData: Case) => void;
  disabled?: boolean;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseData, onViewDetails, disabled }) => {
  return (
    <div className={`bg-slate-800 p-4 rounded-lg shadow-lg text-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sky-500/30 transition-shadow'}`}>
      <img src={caseData.imageUrl} alt={caseData.name} className="w-full h-48 object-contain mx-auto mb-4 rounded" />
      <h3 className="text-xl font-semibold text-slate-100 mb-2">{caseData.name}</h3>
      <p className="text-sky-400 font-bold text-lg mb-3">{caseData.priceTon.toFixed(2)} TON</p>
      <button
        onClick={() => onViewDetails(caseData)}
        disabled={disabled}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-400"
      >
        View Details
      </button>
    </div>
  );
};
