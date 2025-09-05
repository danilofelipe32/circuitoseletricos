
import React from 'react';

interface SwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

const Switch: React.FC<SwitchProps> = ({ isOn, onToggle }) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <span className="text-sm font-medium text-gray-400">Interruptor</span>
      <button
        onClick={onToggle}
        className={`relative inline-flex items-center h-8 w-16 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 ${isOn ? 'bg-green-500' : 'bg-gray-600'}`}
      >
        <span
          className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ${isOn ? 'translate-x-9' : 'translate-x-1'}`}
        />
      </button>
      <span className={`font-bold ${isOn ? 'text-green-400' : 'text-red-500'}`}>
        {isOn ? 'LIGADO' : 'DESLIGADO'}
      </span>
    </div>
  );
};

export default Switch;
