import React from 'react';

interface BulbProps {
  on: boolean;
  broken: boolean;
  onClick: () => void;
  brightness: number; // 0.0 to 1.0
}

const Bulb: React.FC<BulbProps> = ({ on, broken, onClick, brightness }) => {
  const bulbBaseClasses = 'relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer';
  const bulbSocketClasses = 'absolute -bottom-2 w-8 h-4 bg-gray-600 rounded-b-md border-2 border-gray-500 z-10';
  const filamentClasses = 'w-1 h-6 transition-colors duration-300';

  const isLit = on && !broken;

  // Dynamic styles for variable brightness
  const bulbStyle = isLit
    ? {
        backgroundColor: `rgba(253, 224, 71, ${brightness * 0.5 + 0.1})`, // Base color with some opacity
        boxShadow: `0 0 ${brightness * 20}px ${brightness * 5}px rgba(253, 224, 71, ${brightness * 0.7})`,
      }
    : {};
  
  const baseBulbColor = broken ? 'bg-gray-800' : 'bg-gray-700';
  const filamentColor = isLit ? 'bg-yellow-100' : 'bg-gray-500';

  return (
    <div className="flex flex-col items-center" onClick={onClick} title={broken ? "Lâmpada Queimada (Clique para consertar)" : "Lâmpada Funcional (Clique para queimar)"}>
      <div className={`${bulbBaseClasses} ${baseBulbColor}`} style={bulbStyle}>
        {broken ? (
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 17.657l-1.414-1.414m-1.414 1.414l-1.414-1.414m1.414-1.414l-1.414-1.414m-4.243 4.243l-1.414-1.414m1.414 1.414L9.172 17.657m1.414-1.414l-1.414-1.414M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z" />
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5V3m0 18v-2m-7.071-2.929l-1.414-1.414M5.636 5.636L4.222 4.222m15.556 15.556l-1.414-1.414M18.364 5.636l-1.414 1.414" />
           </svg>
        ) : (
          <div className={`${filamentClasses} ${filamentColor}`}></div>
        )}
        <div className={bulbSocketClasses} />
      </div>
    </div>
  );
};

export default Bulb;