import React, { useState, useEffect, useCallback } from 'react';
import Circuit from './components/Circuit';
import InfoModal from './components/InfoModal'; // Import the new component
import { Bulb } from './types';

const MIN_BULBS = 1;
const MAX_BULBS = 5;
const BULB_RESISTANCE = 3.0;

const App: React.FC = () => {
  const [isSeriesPowerOn, setIsSeriesPowerOn] = useState<boolean>(false);
  const [isParallelPowerOn, setIsParallelPowerOn] = useState<boolean>(false);
  const [bulbCount, setBulbCount] = useState<number>(3);
  const [sourceVoltage, setSourceVoltage] = useState<number>(12.0);
  const [seriesBulbs, setSeriesBulbs] = useState<Bulb[]>([]);
  const [parallelBulbs, setParallelBulbs] = useState<Bulb[]>([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false); // State for the modal
  
  const generateInitialBulbs = useCallback((count: number): Bulb[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      broken: false,
    }));
  }, []);

  useEffect(() => {
    setSeriesBulbs(generateInitialBulbs(bulbCount));
    setParallelBulbs(generateInitialBulbs(bulbCount));
  }, [bulbCount, generateInitialBulbs]);

  // --- DERIVED STATE AND PHYSICS CALCULATIONS ---
  
  // Series Circuit Logic
  const isSeriesBroken = seriesBulbs.some(b => b.broken);
  const seriesTotalResistance = seriesBulbs.length * BULB_RESISTANCE;
  const seriesCurrent = isSeriesPowerOn && !isSeriesBroken && seriesTotalResistance > 0 
    ? sourceVoltage / seriesTotalResistance 
    : 0;
  const seriesVoltage = isSeriesPowerOn && !isSeriesBroken && seriesBulbs.length > 0 ? sourceVoltage : 0;
  const seriesBulbsWithState = seriesBulbs.map(b => ({ ...b, on: seriesCurrent > 0 }));

  const seriesBulbVoltage = seriesBulbs.length > 0 ? seriesVoltage / seriesBulbs.length : 0;
  const seriesBulbBrightness = sourceVoltage > 0 ? Math.min(1, seriesBulbVoltage / sourceVoltage) : 0;

  const seriesBulbCurrent = seriesCurrent;

  // Parallel Circuit Logic
  const workingParallelBulbs = parallelBulbs.filter(b => !b.broken).length;
  const parallelTotalResistance = workingParallelBulbs > 0 
    ? BULB_RESISTANCE / workingParallelBulbs 
    : Infinity;
  const parallelTotalCurrent = isParallelPowerOn && parallelTotalResistance !== Infinity 
    ? sourceVoltage / parallelTotalResistance 
    : 0;
  const parallelVoltage = isParallelPowerOn && workingParallelBulbs > 0 ? sourceVoltage : 0;
  const parallelBulbsWithState = parallelBulbs.map(b => ({ ...b, on: isParallelPowerOn && !b.broken }));
  const parallelBulbBrightness = isParallelPowerOn && workingParallelBulbs > 0 ? 1.0 : 0;
  const parallelBulbCurrent = isParallelPowerOn ? sourceVoltage / BULB_RESISTANCE : 0;


  const handleToggleBulb = (id: number, type: 'series' | 'parallel') => {
    const setBulbs = type === 'series' ? setSeriesBulbs : setParallelBulbs;
    const bulbs = type === 'series' ? seriesBulbs : parallelBulbs;
    
    setBulbs(bulbs.map(b => b.id === id ? { ...b, broken: !b.broken } : b));
  };
  
  const handleBulbCountChange = (newCount: number) => {
    if (newCount >= MIN_BULBS && newCount <= MAX_BULBS) {
      setBulbCount(newCount);
    }
  };

  const Controls: React.FC = () => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg flex flex-col items-center gap-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-cyan-400">Painel de Controle</h2>
      
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center gap-4">
            <label htmlFor="bulb-count" className="font-medium">Lâmpadas:</label>
            <div className="flex items-center gap-2 flex-grow justify-end">
                <button onClick={() => handleBulbCountChange(bulbCount - 1)} disabled={bulbCount <= MIN_BULBS} className="w-10 h-10 bg-cyan-600 rounded-full font-bold text-xl disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-cyan-500 transition-colors">-</button>
                <span className="text-2xl font-bold w-10 text-center">{bulbCount}</span>
                <button onClick={() => handleBulbCountChange(bulbCount + 1)} disabled={bulbCount >= MAX_BULBS} className="w-10 h-10 bg-cyan-600 rounded-full font-bold text-xl disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-cyan-500 transition-colors">+</button>
            </div>
        </div>

        <div className="flex items-center gap-4 w-full">
            <label htmlFor="voltage-slider" className="font-medium whitespace-nowrap">Tensão:</label>
            <div className="flex items-center gap-3 flex-grow">
                <input
                    id="voltage-slider"
                    type="range"
                    min="1"
                    max="24"
                    step="0.5"
                    value={sourceVoltage}
                    onChange={(e) => setSourceVoltage(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    aria-label="Ajustar tensão"
                />
                <span className="font-mono text-cyan-300 w-20 text-center">{sourceVoltage.toFixed(1)} V</span>
            </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-2">Clique em uma lâmpada para simular que ela queimou.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto relative">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
            Simulador de Circuitos Elétricos
          </h1>
          <p className="mt-2 text-lg text-gray-300">Explore a diferença entre circuitos em série e em paralelo.</p>
        </header>
        
        <button 
          onClick={() => setIsInfoModalOpen(true)}
          className="absolute top-0 right-0 w-10 h-10 bg-gray-700/50 hover:bg-cyan-600/70 rounded-full flex items-center justify-center transition-colors text-cyan-300 hover:text-white"
          aria-label="Mostrar informações da simulação"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <main className="flex flex-col gap-12">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Circuit 
              type="series"
              bulbs={seriesBulbsWithState}
              powerOn={isSeriesPowerOn}
              onBulbClick={(id) => handleToggleBulb(id, 'series')}
              onSwitchToggle={() => setIsSeriesPowerOn(!isSeriesPowerOn)}
              voltage={seriesVoltage}
              current={seriesCurrent}
              bulbCurrent={seriesBulbCurrent}
              bulbBrightness={seriesBulbBrightness}
            />
            <Circuit 
              type="parallel"
              bulbs={parallelBulbsWithState}
              powerOn={isParallelPowerOn}
              onBulbClick={(id) => handleToggleBulb(id, 'parallel')}
              onSwitchToggle={() => setIsParallelPowerOn(!isParallelPowerOn)}
              voltage={parallelVoltage}
              current={parallelTotalCurrent}
              bulbCurrent={parallelBulbCurrent}
              bulbBrightness={parallelBulbBrightness}
            />
          </div>
          <div className="flex justify-center">
             <Controls />
          </div>
        </main>
        <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Desenvolvido como uma ferramenta educacional interativa.</p>
        </footer>
      </div>
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
};

export default App;
