import React, { useState, useEffect, useRef } from 'react';

interface DualRangeSliderProps {
  min: number;
  max: number;
  value: { min: number; max: number };
  step?: number;
  onChange: (value: { min: number; max: number }) => void;
}

const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  min,
  max,
  value,
  step = 500000,
  onChange
}) => {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Ensure values are within bounds and properly stepped
  const normalizeValue = (val: number) => {
    const stepped = Math.round(val / step) * step;
    return Math.max(min, Math.min(max, stepped));
  };

  const handleStart = (type: 'min' | 'max') => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(type);
  };

  const getClientX = (e: MouseEvent | TouchEvent): number => {
    if ('touches' in e) {
      return e.touches[0]?.clientX || 0;
    }
    return e.clientX;
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = getClientX(e);
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = normalizeValue(min + percentage * (max - min));

    if (isDragging === 'min' && newValue <= value.max) {
      onChange({ ...value, min: newValue });
    } else if (isDragging === 'max' && newValue >= value.min) {
      onChange({ ...value, max: newValue });
    }
  };

  const handleEnd = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging) {
      // Mouse events
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      // Touch events
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, value, min, max]);

  // Calculate positions as percentages
  const minPercent = ((value.min - min) / (max - min)) * 100;
  const maxPercent = ((value.max - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      {/* Price display */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{value.min.toLocaleString('vi-VN')}₫</span>
        <span>-</span>
        <span>{value.max.toLocaleString('vi-VN')}₫</span>
      </div>

      {/* Dual range slider */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="relative h-2 bg-gray-200 rounded-lg cursor-pointer"
        >
          {/* Active range */}
          <div
            className="absolute h-2 bg-red-600 rounded-lg"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`
            }}
          />

          {/* Min thumb */}
          <div
            className="absolute w-6 h-6 bg-red-600 border-2 border-white rounded-full shadow-md cursor-pointer transform -translate-y-2 hover:scale-110 transition-transform touch-none"
            style={{ left: `${minPercent}%`, marginLeft: '-12px' }}
            onMouseDown={handleStart('min')}
            onTouchStart={handleStart('min')}
          />

          {/* Max thumb */}
          <div
            className="absolute w-6 h-6 bg-red-600 border-2 border-white rounded-full shadow-md cursor-pointer transform -translate-y-2 hover:scale-110 transition-transform touch-none"
            style={{ left: `${maxPercent}%`, marginLeft: '-12px' }}
            onMouseDown={handleStart('max')}
            onTouchStart={handleStart('max')}
          />
        </div>
      </div>

      {/* Manual input */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Từ</label>
          <input
            type="number"
            value={value.min}
            onChange={(e) => {
              const newMin = normalizeValue(parseInt(e.target.value) || min);
              if (newMin >= min && newMin <= value.max) {
                onChange({ ...value, min: newMin });
              }
            }}
            step={step}
            min={min}
            max={value.max}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
            placeholder="Giá tối thiểu"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Đến</label>
          <input
            type="number"
            value={value.max}
            onChange={(e) => {
              const newMax = normalizeValue(parseInt(e.target.value) || max);
              if (newMax <= max && newMax >= value.min) {
                onChange({ ...value, max: newMax });
              }
            }}
            step={step}
            min={value.min}
            max={max}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
            placeholder="Giá tối đa"
          />
        </div>
      </div>
    </div>
  );
};

export default DualRangeSlider;