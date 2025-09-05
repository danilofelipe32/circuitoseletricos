import React from 'react';
import { Bulb as BulbType, CircuitType } from '../types';
import Bulb from './Bulb';
import PowerSource from './PowerSource';
import Switch from './Switch';

interface CircuitProps {
  type: CircuitType;
  bulbs: (BulbType & { on: boolean })[]; // Combined type
  powerOn: boolean;
  onBulbClick: (id: number) => void;
  onSwitchToggle: () => void;
  voltage: number;
  current: number;
  bulbCurrent: number; // Current per bulb branch, mainly for parallel
  bulbBrightness: number;
}

interface WireProps {
  className?: string;
  isFlowing: boolean;
  current: number;
}

const Wire: React.FC<WireProps> = ({ className = '', isFlowing, current }) => {
  const baseGradient = 'linear-gradient(to bottom, #6b7280, #374151)'; // Corresponds to from-gray-500 to-gray-700
  const flowGradient = isFlowing
    ? `repeating-linear-gradient(-45deg, rgba(96, 165, 250, 0.7), rgba(96, 165, 250, 0.7) 10px, transparent 10px, transparent 20px), ${baseGradient}`
    : baseGradient;

  // Higher current = shorter duration = faster animation
  const flowDuration = isFlowing && current > 0 ? Math.max(0.2, Math.min(5, 2 / current)) : 0;

  // FIX: The default React.CSSProperties type does not include custom CSS properties (like '--flow-duration').
  // By extending the type, we inform TypeScript about this property, resolving the error.
  const style: React.CSSProperties & { '--flow-duration': string } = {
    backgroundImage: flowGradient,
    '--flow-duration': `${flowDuration}s`,
  };

  return (
    <div
      className={`shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] rounded-full bg-cover ${className} ${isFlowing ? 'animate-flow' : ''}`}
      style={style}
    />
  );
};

const CircuitStats: React.FC<{ voltage: number, current: number }> = ({ voltage, current }) => (
  <div className="absolute top-3 right-3 bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-md p-2 text-xs font-mono shadow-lg">
    <p className="text-cyan-300">Tensão: <span className="font-bold text-white">{voltage.toFixed(2)} V</span></p>
    <p className="text-cyan-300">Corrente: <span className="font-bold text-white">{current.toFixed(2)} A</span></p>
  </div>
);

const SeriesCircuit: React.FC<Omit<CircuitProps, 'type'>> = ({ bulbs, onBulbClick, onSwitchToggle, bulbBrightness, current, powerOn }) => {
  const isFlowing = current > 0.01;
  return (
    <div className="flex items-center justify-center space-x-2 w-full p-4">
      <PowerSource />
      <Wire className="h-2 flex-grow" isFlowing={isFlowing} current={current} />
      {bulbs.map((bulb, index) => (
        <React.Fragment key={bulb.id}>
          <Bulb
            on={bulb.on}
            broken={bulb.broken}
            onClick={() => onBulbClick(bulb.id)}
            brightness={bulbBrightness}
          />
          {index < bulbs.length && <Wire className="h-2 flex-grow" isFlowing={isFlowing} current={current} />}
        </React.Fragment>
      ))}
       <Switch isOn={powerOn} onToggle={onSwitchToggle} />
    </div>
  );
};

const ParallelCircuit: React.FC<Omit<CircuitProps, 'type'>> = ({ bulbs, onBulbClick, onSwitchToggle, bulbBrightness, current, bulbCurrent, powerOn }) => {
  const isTotalFlowing = current > 0.01;
  return (
    <div className="flex items-center justify-center w-full p-4">
      <PowerSource />
      <Wire className="h-2 w-8" isFlowing={isTotalFlowing} current={current} />
      <div className="flex flex-col items-center">
        <Wire className="h-2 w-full" isFlowing={isTotalFlowing} current={current} />
        <div className="flex items-center justify-around w-full py-4 space-x-8">
          {bulbs.map(bulb => {
            const isThisBulbOn = bulb.on && !bulb.broken;
            return (
              <div key={bulb.id} className="flex flex-col items-center">
                <Wire className="w-2 h-8" isFlowing={isThisBulbOn} current={bulbCurrent} />
                <Bulb
                  on={bulb.on}
                  broken={bulb.broken}
                  onClick={() => onBulbClick(bulb.id)}
                  brightness={bulb.broken ? 0 : bulbBrightness}
                />
                <Wire className="w-2 h-8" isFlowing={isThisBulbOn} current={bulbCurrent} />
              </div>
            );
          })}
        </div>
        <Wire className="h-2 w-full" isFlowing={isTotalFlowing} current={current} />
      </div>
      <Wire className="h-2 w-8" isFlowing={isTotalFlowing} current={current} />
      <Switch isOn={powerOn} onToggle={onSwitchToggle} />
    </div>
  );
};


const Circuit: React.FC<CircuitProps> = (props) => {
  const title = props.type === 'series' ? 'Circuito em Série' : 'Circuito em Paralelo';
  const description = props.type === 'series' 
    ? 'A corrente tem apenas um caminho. Se uma lâmpada queimar, o circuito se abre e todas apagam.'
    : 'A corrente se divide em múltiplos caminhos. Se uma lâmpada queimar, as outras continuam acesas.';

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg relative">
      <h2 className="text-2xl font-bold text-cyan-400 mb-2">{title}</h2>
      <p className="text-gray-400 mb-6 h-12">{description}</p>
      <div className="min-h-[16rem] flex items-center justify-center bg-gray-900/50 rounded-lg p-4">
        {props.type === 'series' ? <SeriesCircuit {...props} /> : <ParallelCircuit {...props} />}
      </div>
      <CircuitStats voltage={props.voltage} current={props.current} />
    </div>
  );
};

export default Circuit;