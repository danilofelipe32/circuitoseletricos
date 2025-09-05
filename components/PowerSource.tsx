
import React from 'react';

const PowerSource: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 border-2 border-gray-600 rounded-lg p-2 w-20 h-24 shadow-md">
      <div className="text-2xl font-bold text-red-500">+</div>
      <div className="w-10 h-10 border-l-4 border-r-4 border-gray-500 flex flex-col justify-around my-1">
        <div className="h-0.5 w-full bg-gray-600"></div>
        <div className="h-0.5 w-full bg-gray-600"></div>
      </div>
      <div className="text-2xl font-bold text-blue-500">-</div>
    </div>
  );
};

export default PowerSource;
