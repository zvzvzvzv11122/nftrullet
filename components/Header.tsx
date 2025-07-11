import React from 'react';

interface HeaderProps {
  balance: number | null;
  onShowProfile: () => void;
  onShowCases: () => void;
  onShowCrashGame: () => void;
  currentView: 'cases' | 'profile' | 'crash';
  onOpenAddFundsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  balance,
  onShowProfile,
  onShowCases,
  onShowCrashGame,
  currentView,
  onOpenAddFundsModal,
}) => {
  return (
    <header className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 px-2">
      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-400">NFT Gift Boxes</h1>
      </div>

      <nav className="flex flex-wrap justify-center sm:justify-end items-center space-x-2 sm:space-x-3 md:space-x-4 mb-4 sm:mb-0">
        <button
          onClick={onShowCases}
          className={`px-3 py-2 text-sm sm:text-base font-medium rounded-md transition-colors duration-150 ${
            currentView === 'cases' ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-slate-100'
          }`}
        >
          Gift Boxes
        </button>
        <button
          onClick={onShowCrashGame}
          className={`px-3 py-2 text-sm sm:text-base font-medium rounded-md transition-colors duration-150 ${
            currentView === 'crash' ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-slate-100'
          }`}
        >
          Crash Game
        </button>
        <button
          onClick={onShowProfile}
          className={`px-3 py-2 text-sm sm:text-base font-medium rounded-md transition-colors duration-150 ${
            currentView === 'profile' ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-slate-100'
          }`}
        >
          Profile
        </button>
      </nav>

      <div className="flex items-center space-x-3">
        {balance !== null && (
          <div className="text-sm sm:text-base bg-slate-700/50 text-sky-300 font-semibold px-3 py-2 rounded-lg">
            Balance: {balance.toFixed(2)} TON
          </div>
        )}
         <button
            onClick={onOpenAddFundsModal}
            className="px-3 py-2 text-sm sm:text-base bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
           + Add TON
        </button>
        {/* Placeholder for TonConnectButton - Assuming it's added globally or elsewhere */}
        {/* <TonConnectButton /> */}
      </div>
    </header>
  );
};
