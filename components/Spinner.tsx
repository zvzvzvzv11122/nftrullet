import React, { useEffect, useRef, useState } from 'react';
import type { NFTItem } from '../types'; // Assuming types.ts is in the root

interface SpinnerProps {
  items: NFTItem[];
  winningItem: NFTItem;
  onSpinEnd: () => void;
}

export const Spinner: React.FC<SpinnerProps> = ({ items, winningItem, onSpinEnd }) => {
  const spinnerRef = useRef<HTMLDivElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (items.length === 0 || !winningItem) return;

    setIsSpinning(true);
    const spinnerElement = spinnerRef.current;
    if (!spinnerElement) return;

    // Find the target item index (center of the visible part of the spinner)
    // This usually involves some calculation based on item width and container width
    // For this placeholder, we'll assume a fixed number of items visible.
    const itemWidth = 160; // width of item + margin (150 + 10)
    const targetIndex = items.findIndex(item => item.id === winningItem.id && item.name === winningItem.name); // A simple find, might need more robust for duplicates

    // Calculate the offset to center the winning item
    // The calculation might need adjustment based on exact styling and layout
    // For a placeholder, let's try to center it.
    // Offset = (total width of items before target) - (half container width) + (half item width)
    // A simpler approach for now:
    const offset = (targetIndex * itemWidth) - (spinnerElement.offsetWidth / 2) + (itemWidth / 2);

    // Animation using CSS transitions
    spinnerElement.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
    spinnerElement.style.transform = `translateX(-${offset}px)`;

    const spinTimeout = setTimeout(() => {
      setIsSpinning(false);
      onSpinEnd();
    }, 5200); // Slightly longer than transition

    return () => clearTimeout(spinTimeout);

  }, [items, winningItem, onSpinEnd]);

  if (items.length === 0) {
    return <div className="text-slate-400">Preparing spinner...</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto overflow-hidden my-8 relative h-48 flex items-center">
      {/* Marker for the winning position */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-sky-500 transform -translate-x-1/2 z-10 rounded-full"></div>
      <div
        ref={spinnerRef}
        className="flex transition-transform duration-5000 ease-out"
        style={{ transform: 'translateX(0px)' }} // Initial position
      >
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex-shrink-0 w-[150px] h-[150px] mx-1.5 p-2.5 bg-slate-700 rounded-lg flex flex-col items-center justify-center border-2 border-slate-600">
            <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-contain mb-1.5" />
            <p className="text-xs text-slate-200 truncate w-full text-center" title={item.name}>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
