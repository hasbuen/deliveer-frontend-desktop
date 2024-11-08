import React from 'react';

interface ToggleProps {
  type: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeColor?: string;
  inactiveColor?: string;
}

const Toggle: React.FC<ToggleProps> = ({ type, checked, onChange, activeColor, inactiveColor }) => {
  return (
    <label className="flex items-center space-x-2 p-2 cursor-pointer">
      <div className="relative inline-block w-16 h-4">
        <input
          type={type}
          checked={checked}
          onChange={onChange}
          className="hidden"
        />
        <div
          className={`w-10 h-5 rounded-full cursor-pointer transition-colors duration-300 
            ${checked ? activeColor : inactiveColor}`}
        >
          <div
            className={`w-5 h-5 bg-gray-500 rounded-full shadow-md transform transition-transform duration-300 
              ${checked ? 'translate-x-5' : 'translate-x-0'}`}
          ></div>
        </div>
      </div>
    </label>
  );
};

export default Toggle;