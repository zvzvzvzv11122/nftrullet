import React, { useState } from 'react';

interface AddFundsModalProps {
  onClose: () => void;
  onConfirmDeposit: (amount: number) => void;
  currentBalance: number;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({ onClose, onConfirmDeposit, currentBalance }) => {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }
    // Optional: Add a maximum deposit limit check here if needed
    setError(null);
    onConfirmDeposit(numericAmount);
  };

  const quickAmounts = [5, 10, 25, 50, 100];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[1000]" role="dialog" aria-modal="true" aria-labelledby="add-funds-modal-title">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 id="add-funds-modal-title" className="text-2xl font-semibold text-slate-100">Add Funds to Your Balance</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors text-3xl leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-slate-400 mb-1">Current Balance: <span className="font-semibold text-sky-400">{currentBalance.toFixed(2)} TON</span></p>
        <p className="text-xs text-slate-500 mb-4">You will be prompted to confirm the transaction in your TON wallet.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="deposit-amount" className="block text-sm font-medium text-slate-300 mb-1">Amount to Deposit (TON)</label>
            <input
              type="text"
              id="deposit-amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="e.g., 10"
              className="w-full bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 px-3 py-2 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
              required
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>

          <div className="mb-6">
            <p className="text-xs text-slate-400 mb-1.5">Quick amounts:</p>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map(qa => (
                <button
                  key={qa}
                  type="button"
                  onClick={() => { setAmount(qa.toString()); setError(null); }}
                  className="bg-slate-600 hover:bg-slate-500 text-slate-200 font-medium py-1.5 px-3 rounded-md text-sm transition-colors"
                >
                  {qa} TON
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              Confirm Deposit
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
