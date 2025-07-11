import React, { useState } from 'react';
import { TON_ADDRESS_REGEX } from '../constants'; // Assuming constants.ts is in the root

interface WithdrawModalProps {
  onClose: () => void;
  onConfirmWithdrawal: (amount: number, recipientAddress: string) => void;
  currentBalance: number;
  connectedUserWalletAddress: string;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  onClose, onConfirmWithdrawal, currentBalance, connectedUserWalletAddress
}) => {
  const [amount, setAmount] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [useConnectedWallet, setUseConnectedWallet] = useState<boolean>(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(e.target.value);
    setError(null);
    if (useConnectedWallet && e.target.value !== connectedUserWalletAddress) {
      setUseConnectedWallet(false); // Uncheck if user manually changes address
    }
  };

  const handleUseConnectedWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseConnectedWallet(e.target.checked);
    if (e.target.checked) {
      setRecipientAddress(connectedUserWalletAddress);
    } else {
      // Optionally clear address or leave as is for user to edit
      // setRecipientAddress('');
    }
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }
    if (numericAmount > currentBalance) {
      setError("Withdrawal amount cannot exceed your current balance.");
      return;
    }
    if (!TON_ADDRESS_REGEX.test(recipientAddress)) {
      setError("Invalid recipient TON address format.");
      return;
    }

    setError(null);
    onConfirmWithdrawal(numericAmount, recipientAddress);
  };

  const quickWithdrawPercentages = [0.25, 0.50, 0.75, 1.00]; // 25%, 50%, 75%, Max

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[1000]" role="dialog" aria-modal="true" aria-labelledby="withdraw-modal-title">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-lg w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 id="withdraw-modal-title" className="text-2xl font-semibold text-slate-100">Request Withdrawal</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors text-3xl leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-slate-400 mb-1">Current Balance: <span className="font-semibold text-sky-400">{currentBalance.toFixed(2)} TON</span></p>
        <p className="text-xs text-slate-500 mb-4">Withdrawals are processed manually. Please allow some time for review. Ensure the recipient address is correct.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="withdraw-amount" className="block text-sm font-medium text-slate-300 mb-1">Amount to Withdraw (TON)</label>
            <input
              type="text"
              id="withdraw-amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder={`Max: ${currentBalance.toFixed(2)}`}
              className="w-full bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 px-3 py-2 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
              required
            />
             <div className="flex flex-wrap gap-2 mt-2">
              {quickWithdrawPercentages.map(percentage => (
                <button
                  key={percentage}
                  type="button"
                  onClick={() => { setAmount((currentBalance * percentage).toFixed(2)); setError(null); }}
                  className="bg-slate-600 hover:bg-slate-500 text-slate-200 font-medium py-1 px-2.5 rounded-md text-xs transition-colors"
                >
                  {percentage * 100}%
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="recipient-address" className="block text-sm font-medium text-slate-300 mb-1">Recipient TON Address</label>
            <input
              type="text"
              id="recipient-address"
              value={recipientAddress}
              onChange={handleAddressChange}
              placeholder="Enter TON wallet address (e.g., UQ...)"
              className="w-full bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 px-3 py-2 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
              required
            />
             <div className="mt-2">
              <label htmlFor="use-connected-wallet" className="flex items-center text-xs text-slate-400">
                <input
                  type="checkbox"
                  id="use-connected-wallet"
                  checked={useConnectedWallet}
                  onChange={handleUseConnectedWalletChange}
                  className="h-3.5 w-3.5 rounded border-slate-500 bg-slate-700 text-sky-500 focus:ring-sky-500 mr-1.5"
                />
                Use my connected wallet address: <span className="font-mono text-sky-400 ml-1 truncate" title={connectedUserWalletAddress}>{`${connectedUserWalletAddress.substring(0,6)}...${connectedUserWalletAddress.substring(connectedUserWalletAddress.length-4)}`}</span>
              </label>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs mb-3 -mt-2">{error}</p>}

          <div className="flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              Submit Withdrawal Request
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-slate-600 hover:bg-slate-500 text-slate-200 font-semibold py-2.5 px-6 rounded-lg transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
