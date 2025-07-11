import React, { useEffect, useRef } from 'react';
import type { CrashRound, CrashDataPoint } from '../types';
import { CrashGameState } from '../types';

interface CrashGameViewProps {
    gameState: CrashGameState;
    currentMultiplier: number;
    countdown: number; // Time in ms for current phase (betting, starting, crashed)
    betAmountInput: string;
    onBetAmountInputChange: (value: string) => void;
    autoCashoutAtInput: string;
    onAutoCashoutAtInputChange: (value: string) => void;
    onPlaceBet: () => void;
    onCashOut: () => void;
    crashHistory: CrashRound[];
    userBetInCurrentRound: number | null; // null if no bet, or the amount bet
    userCashedOutAt: number | null; // null if not cashed out, or multiplier at cashout
    userAutoCashoutTarget: number | null;
    balance: number; // User's current TON balance
    maxBet: number; // Max bet user can place (usually their balance)
    errorMessage: string | null;
    phaseTimeTotal: number; // Total time for the current phase, for progress bar
    roundDataPoints: CrashDataPoint[]; // For the graph
}

const MultiplierDisplay: React.FC<{ multiplier: number, gameState: CrashGameState, userCashedOutAt: number | null }> = ({ multiplier, gameState, userCashedOutAt }) => {
    let colorClass = 'text-slate-100'; // Default/Running
    if (gameState === CrashGameState.CRASHED) {
        colorClass = 'text-red-500';
    } else if (userCashedOutAt) {
        colorClass = 'text-green-400';
    } else if (gameState === CrashGameState.BETTING || gameState === CrashGameState.IDLE || gameState === CrashGameState.STARTING_ROUND) {
        colorClass = 'text-slate-400';
    }

    return (
        <div className={`text-5xl sm:text-7xl md:text-8xl font-bold my-4 sm:my-8 transition-colors duration-200 ${colorClass}`}>
            {userCashedOutAt ? userCashedOutAt.toFixed(2) : multiplier.toFixed(2)}x
        </div>
    );
};

const CrashGraph: React.FC<{ dataPoints: CrashDataPoint[], currentMultiplier: number, gameState: CrashGameState }> = ({ dataPoints, currentMultiplier, gameState }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const parent = canvas.parentElement;
        if (!parent) return;

        // Resize canvas to fit parent, consider devicePixelRatio for sharpness
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        ctx.scale(dpr, dpr);
        const { width, height } = parent.getBoundingClientRect(); // Use parent's client dimensions for drawing logic

        // Clear canvas
        ctx.fillStyle = '#1e293b'; // slate-800
        ctx.fillRect(0, 0, width, height);

        if (dataPoints.length < 2 && gameState !== CrashGameState.RUNNING && gameState !== CrashGameState.CRASHED) {
             // Draw "Waiting for next round" or similar
            ctx.fillStyle = 'rgba(148, 163, 184, 0.7)'; // slate-400 with opacity
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(gameState === CrashGameState.BETTING ? 'Place your bets!' : 'Waiting for next round...', width / 2, height / 2);
            return;
        }

        const relevantDataPoints = dataPoints.slice(-1000); // Limit points for performance

        const startTime = relevantDataPoints.length > 0 ? relevantDataPoints[0].time : Date.now();
        const endTime = Date.now(); //relevantDataPoints.length > 0 ? relevantDataPoints[relevantDataPoints.length - 1].time : Date.now();
        const timeRange = Math.max(5000, endTime - startTime); // Minimum 5s window

        let maxMultiplier = 1.25; // Start with a minimum y-axis
        relevantDataPoints.forEach(p => { if (p.multiplier > maxMultiplier) maxMultiplier = p.multiplier; });
        if(currentMultiplier > maxMultiplier) maxMultiplier = currentMultiplier;
        maxMultiplier = Math.ceil(maxMultiplier / 0.5) * 0.5; // Round up to nearest 0.5 for cleaner axis

        const padding = { top: 20, right: 20, bottom: 30, left: 40 };
        const plotWidth = width - padding.left - padding.right;
        const plotHeight = height - padding.top - padding.bottom;

        // Draw axes (simple lines)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.5)'; // slate-600
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, height - padding.bottom); // Y-axis
        ctx.moveTo(padding.left, height - padding.bottom);
        ctx.lineTo(width - padding.right, height - padding.bottom); // X-axis
        ctx.stroke();

        // Draw Y-axis labels (multipliers)
        const numYLabels = 5;
        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)'; // slate-400
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        for (let i = 0; i <= numYLabels; i++) {
            const val = (maxMultiplier / numYLabels) * i;
            const y = height - padding.bottom - (val / maxMultiplier) * plotHeight;
            if (y < padding.top) continue; // Don't draw out of bounds
            ctx.fillText(val.toFixed(val < 5 ? 2 : 1) + 'x', padding.left - 5, y + 3);
        }

        // Draw X-axis labels (time - simplified)
        // For simplicity, just show "Time" label
        ctx.textAlign = 'center';
        ctx.fillText('Time', padding.left + plotWidth / 2, height - padding.bottom + 15);


        // Plot the graph line
        if (relevantDataPoints.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = gameState === CrashGameState.CRASHED ? '#ef4444' : '#38bdf8'; // red-500 or sky-400
            ctx.lineWidth = 2.5;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            for (let i = 0; i < relevantDataPoints.length; i++) {
                const point = relevantDataPoints[i];
                const x = padding.left + ((point.time - startTime) / timeRange) * plotWidth;
                const y = height - padding.bottom - ((point.multiplier -1) / (maxMultiplier -1)) * plotHeight; // Start y-axis from 1x

                if (i === 0) {
                    ctx.moveTo(x, Math.max(padding.top, Math.min(y, height - padding.bottom)));
                } else {
                    ctx.lineTo(x, Math.max(padding.top, Math.min(y, height - padding.bottom)));
                }
            }
            ctx.stroke();
        }

    }, [dataPoints, currentMultiplier, gameState, canvasRef?.current?.parentElement?.clientWidth, canvasRef?.current?.parentElement?.clientHeight]); // Re-render on data change or resize

    return (
        <div className="w-full h-48 sm:h-64 md:h-80 bg-slate-800 rounded-lg shadow-inner relative overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full"></canvas>
        </div>
    );
};


const CrashHistoryDisplay: React.FC<{ history: CrashRound[] }> = ({ history }) => {
  if (history.length === 0) {
    return <div className="text-slate-500 text-xs text-center py-2">No crash history yet.</div>;
  }
  return (
    <div className="flex space-x-2 overflow-x-auto py-2 px-1 no-scrollbar">
      {history.map(round => (
        <span
          key={round.id}
          className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap
            ${round.crashPoint < 1.01 ? 'bg-red-500/80 text-white' :
              round.crashPoint < 2 ? 'bg-yellow-500/30 text-yellow-300' :
              round.crashPoint < 5 ? 'bg-sky-500/30 text-sky-300' :
              'bg-purple-500/30 text-purple-300'
            }`}
          title={`Crashed at ${round.crashPoint.toFixed(2)}x on ${new Date(round.timestamp).toLocaleTimeString()}`}
        >
          {round.crashPoint.toFixed(2)}x
        </span>
      ))}
    </div>
  );
};


export const CrashGameView: React.FC<CrashGameViewProps> = ({
    gameState, currentMultiplier, countdown, betAmountInput, onBetAmountInputChange,
    autoCashoutAtInput, onAutoCashoutAtInputChange, onPlaceBet, onCashOut, crashHistory,
    userBetInCurrentRound, userCashedOutAt, userAutoCashoutTarget, balance, maxBet, errorMessage,
    phaseTimeTotal, roundDataPoints
}) => {

    const bettingDisabled = gameState !== CrashGameState.BETTING || !!userBetInCurrentRound;
    const cashOutDisabled = gameState !== CrashGameState.RUNNING || !userBetInCurrentRound || !!userCashedOutAt;
    const quickBetAmounts = [1, 5, 10, 25, 50].filter(a => a <= maxBet);
    const countdownPercent = phaseTimeTotal > 0 ? Math.max(0, (countdown / phaseTimeTotal) * 100) : 0;

    const getPhaseMessage = () => {
        switch (gameState) {
            case CrashGameState.IDLE: return `Next round starts in ${(countdown / 1000).toFixed(1)}s`;
            case CrashGameState.BETTING: return `Place bets! ${(countdown / 1000).toFixed(1)}s remaining`;
            case CrashGameState.STARTING_ROUND: return `Round starting in ${(countdown / 1000).toFixed(1)}s...`;
            case CrashGameState.RUNNING: return userCashedOutAt ? `Cashed out at ${userCashedOutAt.toFixed(2)}x!` : (userBetInCurrentRound ? "Good luck!" : "Running...");
            case CrashGameState.CRASHED: return `CRASHED @ ${currentMultiplier.toFixed(2)}x! Next round in ${(countdown / 1000).toFixed(1)}s`;
            default: return "";
        }
    };

    const progressBarColor = () => {
        if (gameState === CrashGameState.BETTING) return 'bg-sky-500';
        if (gameState === CrashGameState.STARTING_ROUND) return 'bg-yellow-500';
        if (gameState === CrashGameState.CRASHED || gameState === CrashGameState.IDLE) return 'bg-slate-600';
        return 'bg-green-500'; // Running (though no bar for running)
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-3 sm:p-4 bg-slate-800/50 rounded-xl shadow-2xl">
            <CrashHistoryDisplay history={crashHistory} />

            <div className="my-4 sm:my-6 relative w-full h-48 sm:h-64 md:h-80 bg-slate-800 rounded-lg shadow-inner flex items-center justify-center">
                <CrashGraph dataPoints={roundDataPoints} currentMultiplier={currentMultiplier} gameState={gameState} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <MultiplierDisplay multiplier={currentMultiplier} gameState={gameState} userCashedOutAt={userCashedOutAt} />
                </div>
            </div>

            {(gameState === CrashGameState.IDLE || gameState === CrashGameState.BETTING || gameState === CrashGameState.STARTING_ROUND || gameState === CrashGameState.CRASHED) && phaseTimeTotal > 0 && (
                 <div className="w-full bg-slate-700 rounded-full h-2.5 mb-3 sm:mb-5 overflow-hidden">
                    <div
                        className={`h-2.5 rounded-full transition-all duration-100 ease-linear ${progressBarColor()}`}
                        style={{ width: `${countdownPercent}%` }}
                    ></div>
                </div>
            )}
            <p className="text-center text-sm text-slate-300 mb-3 sm:mb-5 h-5">{getPhaseMessage()}</p>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Bet Amount Input */}
                <div className="space-y-2">
                    <label htmlFor="betAmount" className="block text-xs sm:text-sm font-medium text-slate-300">Bet Amount (TON)</label>
                    <input
                        type="number"
                        id="betAmount"
                        value={betAmountInput}
                        onChange={(e) => onBetAmountInputChange(e.target.value)}
                        placeholder={`Balance: ${balance.toFixed(2)}`}
                        disabled={bettingDisabled}
                        className="w-full bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    {!bettingDisabled && quickBetAmounts.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {quickBetAmounts.map(qVal => (
                                <button key={`bet-${qVal}`} onClick={() => onBetAmountInputChange(qVal.toString())} className="bg-slate-600 hover:bg-slate-500 text-slate-200 text-xs px-2 py-1 rounded-md transition-colors">
                                    {qVal}
                                </button>
                            ))}
                             <button onClick={() => onBetAmountInputChange(maxBet.toFixed(2))} className="bg-slate-600 hover:bg-slate-500 text-slate-200 text-xs px-2 py-1 rounded-md transition-colors">
                                Max
                            </button>
                        </div>
                    )}
                </div>

                {/* Auto Cashout Input */}
                 <div className="space-y-2">
                    <label htmlFor="autoCashoutAt" className="block text-xs sm:text-sm font-medium text-slate-300">Auto Cashout At (e.g., 2.5x)</label>
                    <input
                        type="number"
                        id="autoCashoutAt"
                        value={autoCashoutAtInput}
                        onChange={(e) => onAutoCashoutAtInputChange(e.target.value)}
                        placeholder="Optional, e.g., 2.0"
                        disabled={bettingDisabled}
                        className="w-full bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                     {!bettingDisabled && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {[1.5, 2, 3, 5, 10].map(qVal => (
                                <button key={`cashout-${qVal}`} onClick={() => onAutoCashoutAtInputChange(qVal.toString())} className="bg-slate-600 hover:bg-slate-500 text-slate-200 text-xs px-2 py-1 rounded-md transition-colors">
                                    {qVal}x
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {errorMessage && <p className="text-red-400 text-xs sm:text-sm text-center mt-3 sm:mt-4 h-4">{errorMessage}</p>}

            <div className="mt-4 sm:mt-6">
                {gameState === CrashGameState.BETTING ? (
                    <button
                        onClick={onPlaceBet}
                        disabled={bettingDisabled || !betAmountInput || parseFloat(betAmountInput) <=0 || parseFloat(betAmountInput) > balance}
                        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 sm:py-3.5 text-base sm:text-lg rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {userBetInCurrentRound ? `Bet Placed: ${userBetInCurrentRound.toFixed(2)} TON` : 'Place Bet'}
                        {userAutoCashoutTarget && ` (Auto @ ${userAutoCashoutTarget.toFixed(2)}x)`}
                    </button>
                ) : (
                    <button
                        onClick={onCashOut}
                        disabled={cashOutDisabled}
                        className={`w-full text-white font-semibold py-3 sm:py-3.5 text-base sm:text-lg rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2
                            ${userCashedOutAt
                                ? 'bg-green-500 cursor-not-allowed opacity-80'
                                : 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed'
                            }`}
                    >
                        {userCashedOutAt
                            ? `Cashed Out @ ${userCashedOutAt.toFixed(2)}x`
                            : (userBetInCurrentRound ? `Cash Out (${(userBetInCurrentRound * currentMultiplier).toFixed(2)} TON)` : (gameState === CrashGameState.CRASHED ? 'Crashed' : 'Waiting for Bet'))
                        }
                    </button>
                )}
            </div>
            {userBetInCurrentRound && !userCashedOutAt && gameState === CrashGameState.RUNNING && (
                 <p className="text-center text-xs text-slate-400 mt-2">Your bet: {userBetInCurrentRound.toFixed(2)} TON. Potential Winnings: <span className="text-green-400 font-semibold">{(userBetInCurrentRound * currentMultiplier).toFixed(2)} TON</span></p>
            )}
             {userBetInCurrentRound && userCashedOutAt && (
                 <p className="text-center text-xs text-green-400 mt-2">You won <span className="font-semibold">{(userBetInCurrentRound * userCashedOutAt).toFixed(2)} TON</span>!</p>
            )}
            {userBetInCurrentRound && !userCashedOutAt && gameState === CrashGameState.CRASHED && (
                 <p className="text-center text-xs text-red-400 mt-2">Oh no! Your bet of {userBetInCurrentRound.toFixed(2)} TON was lost.</p>
            )}


        </div>
    );
};
