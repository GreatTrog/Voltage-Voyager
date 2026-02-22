
import React, { useState, useEffect } from 'react';
import { Zap, Power, Plus, Minus, Info, RefreshCcw } from 'lucide-react';
import { CircuitState } from '../types';

interface Props {
  onVoltageChange?: (v: number) => void;
}

const CircuitSimulator: React.FC<Props> = ({ onVoltageChange }) => {
  const [state, setState] = useState<CircuitState>({
    batteries: 1,
    isOpen: false,
    voltage: 1.5,
  });
  const [isExploded, setIsExploded] = useState(false);
  const [showBoom, setShowBoom] = useState(false);

  useEffect(() => {
    const newVoltage = state.batteries * 1.5;
    if (onVoltageChange) onVoltageChange(newVoltage);

    // If 5 batteries and switch is ON, the bulb explodes!
    if (state.batteries >= 5 && state.isOpen && !isExploded) {
      setIsExploded(true);
      setShowBoom(true);
      setTimeout(() => setShowBoom(false), 1500);
    }
  }, [state.batteries, state.isOpen]);

  const toggleSwitch = () => setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  const addBattery = () => setState(prev => ({ ...prev, batteries: Math.min(prev.batteries + 1, 5) }));
  const removeBattery = () => setState(prev => ({ ...prev, batteries: Math.max(prev.batteries - 1, 0) }));
  
  const resetBulb = () => {
    setIsExploded(false);
    setShowBoom(false);
    setState(prev => ({ ...prev, batteries: 1 }));
  };

  // Voltage calculation
  const currentVoltage = state.batteries * 1.5;
  
  // Speed of electrons based on voltage and switch state
  // If exploded or no batteries, no flow.
  const canFlow = state.isOpen && state.batteries > 0 && !isExploded;
  const flowSpeed = canFlow ? (0.5 + currentVoltage) : 0;
  const bulbBrightness = canFlow ? (state.batteries * 0.2) : 0;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-yellow-200 relative overflow-hidden">
      {/* Explosion Particles Overlay */}
      {showBoom && (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="relative w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute bg-yellow-400 rounded-full animate-ping"
                style={{
                  width: Math.random() * 20 + 10 + 'px',
                  height: Math.random() * 20 + 10 + 'px',
                  left: (65 + (Math.random() - 0.5) * 20) + '%',
                  top: (40 + (Math.random() - 0.5) * 20) + '%',
                  animationDelay: Math.random() * 0.5 + 's',
                  animationDuration: '0.8s'
                }}
              />
            ))}
            <div className="absolute left-[65%] top-[40%] -translate-x-1/2 -translate-y-1/2 text-6xl font-black text-red-600 animate-bounce">
              BOOM!
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <Zap className="text-yellow-400 fill-yellow-400" />
          The Push Simulator
        </h3>
        <div className="flex items-center gap-4 bg-blue-50 px-4 py-2 rounded-full">
          <span className="font-semibold text-blue-800">Total Voltage: {currentVoltage.toFixed(1)}V</span>
        </div>
      </div>

      <div className="relative w-full aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-4 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          {/* Wire Path */}
          <path
            id="circuit-path"
            d="M 100,50 L 300,50 L 300,250 L 100,250 Z"
            fill="none"
            stroke={isExploded ? "#64748b" : "#475569"}
            strokeWidth="8"
            strokeLinejoin="round"
          />
          
          {/* Electrons (Flowing dots) */}
          {flowSpeed > 0 && (
            <path
              d="M 100,50 L 300,50 L 300,250 L 100,250 Z"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeLinejoin="round"
              className="electron-flow"
              style={{ animationDuration: `${5 / flowSpeed}s` }}
            />
          )}

          {/* Battery Area */}
          <g transform="translate(80, 80)">
             {state.batteries > 0 && [...Array(state.batteries)].map((_, i) => (
                <g key={i} transform={`translate(0, ${i * 35})`}>
                  <rect x="0" y="0" width="40" height="30" rx="4" fill="#ef4444" />
                  <rect x="15" y="-5" width="10" height="5" rx="1" fill="#991b1b" />
                  <text x="20" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">1.5V</text>
                </g>
             ))}
          </g>

          {/* Bulb Area */}
          <g transform="translate(270, 120)">
            {/* Glow Effect */}
            {bulbBrightness > 0 && (
               <circle cx="30" cy="30" r={20 + (state.batteries * 8)} fill="yellow" opacity={bulbBrightness} />
            )}
            
            {/* Bulb Glass */}
            <circle 
              cx="30" 
              cy="30" 
              r="25" 
              fill={isExploded ? "#475569" : (bulbBrightness > 0 ? "#fef08a" : "#e2e8f0")} 
              stroke="#475569" 
              strokeWidth="3" 
            />
            
            {/* Cracks if exploded */}
            {isExploded && (
              <g stroke="#94a3b8" strokeWidth="2">
                <line x1="15" y1="15" x2="45" y2="45" />
                <line x1="45" y1="15" x2="15" y2="45" />
                <line x1="30" y1="5" x2="30" y2="55" />
              </g>
            )}

            <path d="M 20,45 L 40,45" stroke="#475569" strokeWidth="4" />
            <path 
              d="M 22,20 Q 30,10 38,20" 
              fill="none" 
              stroke={isExploded ? "#1e293b" : (bulbBrightness > 0 ? "#ca8a04" : "#94a3b8")} 
              strokeWidth="2" 
            />
          </g>

          {/* Switch */}
          <g transform="translate(180, 240)">
            <line x1="0" y1="10" x2="40" y2="10" stroke="#475569" strokeWidth="8" />
            <line 
              x1="0" y1="10" 
              x2="40" 
              y2={state.isOpen ? "10" : "-20"} 
              stroke="#ef4444" 
              strokeWidth="6" 
              className="transition-all duration-300"
            />
          </g>
        </svg>

        {/* Dynamic Labels */}
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur p-2 rounded-lg text-xs font-bold text-slate-600 shadow-sm border border-slate-200">
          {isExploded 
            ? "OH NO! THE BULB BLOWN!" 
            : (state.batteries > 0 ? "The battery is PUSHING the electrons!" : "No push without a battery!")}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Control Panel</label>
          <div className="flex items-center gap-4">
            <button 
              onClick={removeBattery}
              disabled={state.batteries <= 0}
              className="p-3 rounded-2xl bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 transition-colors"
            >
              <Minus size={24} />
            </button>
            <div className="flex-1 text-center py-3 bg-slate-100 rounded-2xl font-bold text-slate-800">
              {state.batteries} {state.batteries === 1 ? 'Battery' : 'Batteries'}
            </div>
            <button 
              onClick={addBattery}
              disabled={state.batteries >= 5}
              className="p-3 rounded-2xl bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-50 transition-colors"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Main Switch</label>
          {isExploded ? (
            <button 
              onClick={resetBulb}
              className="w-full flex items-center justify-center gap-3 p-3 rounded-2xl font-bold transition-all shadow-md bg-blue-600 text-white hover:bg-blue-700"
            >
              <RefreshCcw size={24} />
              REPLACE BLOWN BULB
            </button>
          ) : (
            <button 
              onClick={toggleSwitch}
              className={`w-full flex items-center justify-center gap-3 p-3 rounded-2xl font-bold transition-all shadow-md ${
                state.isOpen 
                ? 'bg-yellow-400 text-yellow-900 ring-4 ring-yellow-200' 
                : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
              }`}
            >
              <Power size={24} />
              {state.isOpen ? 'CIRCUIT ON' : 'CIRCUIT OFF'}
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-2xl flex gap-4 items-start border border-blue-100">
        <div className="p-2 bg-blue-100 rounded-full text-blue-600 shrink-0">
          <Info size={20} />
        </div>
        <div className="text-sm text-blue-800 italic">
          <strong>Observation:</strong> {isExploded 
            ? "Oops! 7.5V was way too much push for that little bulb. It couldn't handle the pressure and exploded! Use fewer batteries next time."
            : (state.isOpen 
                ? (state.batteries > 0 
                    ? `With ${state.batteries} batteries, the voltage is ${currentVoltage.toFixed(1)}V. Notice the brightness!`
                    : "The circuit is ON, but there's no battery to provide the 'push' (voltage).")
                : "The circuit is incomplete. Turn on the switch to start the flow!")
          }
        </div>
      </div>
    </div>
  );
};

export default CircuitSimulator;
