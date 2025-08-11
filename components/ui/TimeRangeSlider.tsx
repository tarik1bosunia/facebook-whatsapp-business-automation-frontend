import React from 'react';

interface TimeRangeSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  disabled?: boolean;
}

const TimeRangeSlider: React.FC<TimeRangeSliderProps> = ({ value, onChange, disabled }) => {
  const min = 0;
  const max = 48; // 30-minute intervals in 24 hours

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseInt(e.target.value, 10);
    const newRange: [number, number] = [...value];
    newRange[index] = newValue;

    if (newRange[0] > newRange[1]) {
      if (index === 0) {
        newRange[1] = newRange[0];
      } else {
        newRange[0] = newRange[1];
      }
    }

    onChange(newRange);
  };

  const formatTime = (val: number) => {
    const hours = Math.floor(val / 2);
    const minutes = (val % 2) * 30;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-4">
      <span>{formatTime(value[0])}</span>
      <div className="relative w-full">
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => handleChange(e, 0)}
          disabled={disabled}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => handleChange(e, 1)}
          disabled={disabled}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <span>{formatTime(value[1])}</span>
    </div>
  );
};

export default TimeRangeSlider;