import React, { useState } from 'react';
import type { InventoryNFTItem, UserCrashBetRecord, UserCaseOpeningRecord, UserSoldItemRecord, UserWithdrawalRequest } from '../types';
import { NftItemCard } from './NftItemCard'; // Assuming NftItemCard is in the same directory
import { UserWithdrawalRequestStatus } from '../types';

interface UserProfileProps {
  inventory: InventoryNFTItem[];
  onSellNft: (instanceId: string) => void;
  userCrashBetHistory: UserCrashBetRecord[];
  userCaseOpeningHistory: UserCaseOpeningRecord[];
  userSoldItemsHistory: UserSoldItemRecord[];
  userWithdrawalRequests: UserWithdrawalRequest[];
  onOpenWithdrawModal: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  inventory, onSellNft, userCrashBetHistory, userCaseOpeningHistory,
  userSoldItemsHistory, userWithdrawalRequests, onOpenWithdrawModal
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'crash' | 'cases' | 'sales' | 'withdrawals'>('inventory');

  const renderInventory = () => (
    <>
      <h3 className="text-2xl font-semibold text-slate-100 mb-6">My Inventory</h3>
      {inventory.length === 0 ? (
        <p className="text-slate-400 text-center py-8">Your inventory is empty. Open some gift boxes to find cool NFTs!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {inventory.map(item => (
            <NftItemCard
              key={item.instanceId}
              nft={item}
              showSellButton={true}
              onSell={() => onSellNft(item.instanceId)}
            />
          ))}
        </div>
      )}
    </>
  );

  const renderHistoryTable = (title: string, data: any[], columns: { header: string; accessor: (row: any) => React.ReactNode }[]) => (
    <>
      <h3 className="text-2xl font-semibold text-slate-100 mb-6">{title}</h3>
      {data.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No records found.</p>
      ) : (
        <div className="overflow-x-auto bg-slate-800 rounded-lg shadow">
          <table className="min-w-full text-sm text-left text-slate-300">
            <thead className="bg-slate-700/50 text-xs text-slate-400 uppercase tracking-wider">
              <tr>
                {columns.map(col => <th key={col.header} scope="col" className="px-6 py-3">{col.header}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {data.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-slate-700/30 transition-colors">
                  {columns.map(col => <td key={col.header} className="px-6 py-4 whitespace-nowrap">{col.accessor(row)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  const crashHistoryColumns = [
    { header: 'Date', accessor: (row: UserCrashBetRecord) => new Date(row.timestamp).toLocaleString() },
    { header: 'Bet (TON)', accessor: (row: UserCrashBetRecord) => row.betAmount.toFixed(2) },
    { header: 'Outcome', accessor: (row: UserCrashBetRecord) => <span className={`${row.outcome === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>{row.outcome}</span> },
    { header: 'Cashed At', accessor: (row: UserCrashBetRecord) => row.cashOutMultiplier ? `${row.cashOutMultiplier.toFixed(2)}x` : '-' },
    { header: 'Crashed At', accessor: (row: UserCrashBetRecord) => `${row.crashPoint.toFixed(2)}x` },
    { header: 'Profit (TON)', accessor: (row: UserCrashBetRecord) => <span className={`${row.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{row.profit.toFixed(2)}</span> },
  ];

  const caseHistoryColumns = [
    { header: 'Date', accessor: (row: UserCaseOpeningRecord) => new Date(row.timestamp).toLocaleString() },
    { header: 'Case', accessor: (row: UserCaseOpeningRecord) => row.caseName },
    { header: 'Price (TON)', accessor: (row: UserCaseOpeningRecord) => row.casePriceTon.toFixed(2) },
    { header: 'Won NFT', accessor: (row: UserCaseOpeningRecord) => (
      <div className="flex items-center">
        <img src={row.wonNftImageUrl} alt={row.wonNftName} className="w-8 h-8 object-contain mr-2 rounded-sm"/>
        <span className="truncate max-w-[100px]" title={row.wonNftName}>{row.wonNftName}</span>
      </div>
    )},
    { header: 'Rarity', accessor: (row: UserCaseOpeningRecord) => row.wonNftRarity },
  ];

  const salesHistoryColumns = [
    { header: 'Date', accessor: (row: UserSoldItemRecord) => new Date(row.timestamp).toLocaleString() },
    { header: 'Item', accessor: (row: UserSoldItemRecord) => (
      <div className="flex items-center">
        <img src={row.itemImageUrl} alt={row.itemName} className="w-8 h-8 object-contain mr-2 rounded-sm"/>
        <span className="truncate max-w-[100px]" title={row.itemName}>{row.itemName}</span>
      </div>
    )},
    { header: 'Rarity', accessor: (row: UserSoldItemRecord) => row.itemRarity },
    { header: 'Sold For (TON)', accessor: (row: UserSoldItemRecord) => <span className="text-green-400">{row.soldForPriceTon.toFixed(2)}</span> },
  ];

  const withdrawalHistoryColumns = [
    { header: 'Date', accessor: (row: UserWithdrawalRequest) => new Date(row.timestamp).toLocaleString() },
    { header: 'Amount (TON)', accessor: (row: UserWithdrawalRequest) => row.amount.toFixed(2) },
    { header: 'Recipient Address', accessor: (row: UserWithdrawalRequest) => (
        <span title={row.recipientAddress} className="font-mono text-xs">
            {`${row.recipientAddress.substring(0, 6)}...${row.recipientAddress.substring(row.recipientAddress.length - 4)}`}
        </span>
    )},
    { header: 'Status', accessor: (row: UserWithdrawalRequest) => (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
        row.status === UserWithdrawalRequestStatus.PENDING ? 'bg-yellow-500/20 text-yellow-400' :
        row.status === UserWithdrawalRequestStatus.COMPLETED ? 'bg-green-500/20 text-green-400' :
        row.status === UserWithdrawalRequestStatus.REJECTED ? 'bg-red-500/20 text-red-400' : 'bg-slate-600 text-slate-300'
      }`}>
        {row.status}
      </span>
    )},
  ];


  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-4 sm:mb-0">My Profile</h2>
        <button
          onClick={onOpenWithdrawModal}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
        >
          Request Withdrawal
        </button>
      </div>

      <div className="mb-6 sm:mb-8 border-b border-slate-700">
        <nav className="flex flex-wrap -mb-px space-x-1 sm:space-x-4" aria-label="Tabs">
          {(['inventory', 'crash', 'cases', 'sales', 'withdrawals'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-3 px-2 sm:px-4 border-b-2 font-medium text-sm transition-colors duration-150
                ${activeTab === tab
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                } focus:outline-none`}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} History
            </button>
          ))}
        </nav>
      </div>

      <div>
        {activeTab === 'inventory' && renderInventory()}
        {activeTab === 'crash' && renderHistoryTable('Crash Game History', userCrashBetHistory, crashHistoryColumns)}
        {activeTab === 'cases' && renderHistoryTable('Gift Box Openings', userCaseOpeningHistory, caseHistoryColumns)}
        {activeTab === 'sales' && renderHistoryTable('Item Sales History', userSoldItemsHistory, salesHistoryColumns)}
        {activeTab === 'withdrawals' && renderHistoryTable('Withdrawal Requests', userWithdrawalRequests, withdrawalHistoryColumns)}
      </div>
    </div>
  );
};
