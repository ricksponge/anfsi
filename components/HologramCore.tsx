
import React from 'react';
import { motion } from 'framer-motion';
import { SystemStatus } from '../types';

interface HologramCoreProps {
  status: SystemStatus;
  onClick: () => void;
}

// Fix for framer-motion type mismatch issues
const MotionDiv = motion.div as any;

const HologramCore: React.FC<HologramCoreProps> = ({ status, onClick }) => {
  const isScanning = status === SystemStatus.SCANNING || status === SystemStatus.ANALYZING;

  return (
    <div className="relative flex items-center justify-center w-96 h-96 cursor-pointer group" onClick={onClick}>
      {/* Outer Glow Ring - CSS Animation */}
      <div className="absolute inset-0 rounded-full border border-cyber-primary/30 border-dashed animate-spin-custom"></div>
      
      {/* Middle Rotating Hexagon - CSS Animation */}
      <div className="absolute w-72 h-72 flex items-center justify-center animate-spin-reverse">
        <svg viewBox="0 0 100 100" className="w-full h-full text-cyber-cyan opacity-40">
           <polygon points="50 1, 95 25, 95 75, 50 99, 5 75, 5 25" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Inner Rotating Hexagon - Mixed CSS/Framer */}
      <MotionDiv
        animate={{ scale: isScanning ? [1, 1.1, 1] : 1 }}
        transition={{ scale: { duration: 1, repeat: Infinity } }}
        className="absolute w-56 h-56 flex items-center justify-center animate-spin-inner"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-cyber-primary opacity-60">
           <polygon points="50 5, 90 27, 90 73, 50 95, 10 73, 10 27" fill="none" stroke="currentColor" strokeWidth="1" />
           <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.2" />
           <line x1="10" y1="27" x2="90" y2="73" stroke="currentColor" strokeWidth="0.2" />
           <line x1="90" y1="27" x2="10" y2="73" stroke="currentColor" strokeWidth="0.2" />
        </svg>
      </MotionDiv>

      {/* Core "Gem" */}
      <div
        className={`relative z-10 w-24 h-24 bg-cyber-blue/80 backdrop-blur-md rounded-full border-2 border-cyber-cyan shadow-[0_0_30px_rgba(0,243,255,0.6)] flex items-center justify-center transition-all duration-500 group-hover:scale-110 will-change-transform ${isScanning ? 'shadow-[0_0_60px_rgba(0,243,255,0.9)] bg-cyber-cyan/20' : ''}`}
      >
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={`w-12 h-12 text-white transition-all duration-300 ${isScanning ? 'opacity-100' : 'opacity-80'}`}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
        </svg>
      </div>

      {/* Floating Particles/Nodes */}
      <div className="absolute w-full h-full pointer-events-none">
         {[...Array(6)].map((_, i) => (
             <MotionDiv
                key={i}
                className="absolute w-2 h-2 bg-cyber-cyan rounded-full shadow-[0_0_10px_#00f3ff] will-change-transform"
                style={{ top: '50%', left: '50%' }}
                animate={{
                    x: Math.cos(i * 60 * (Math.PI / 180)) * 140,
                    y: Math.sin(i * 60 * (Math.PI / 180)) * 140,
                    opacity: [0.4, 1, 0.4]
                }}
                transition={{
                    opacity: { duration: 2, repeat: Infinity, delay: i * 0.2 },
                    // Set x/y as constant since we don't need to animate position continuously, just set it once
                    x: { duration: 0 },
                    y: { duration: 0 }
                }}
             />
         ))}
      </div>
      
      <div className="absolute -bottom-16 text-center">
        <p className="text-cyber-cyan font-display tracking-[0.2em] text-sm animate-pulse">
            {isScanning ? "SYSTEM ACCESS..." : "TOUCH TO INITIALIZE"}
        </p>
      </div>
    </div>
  );
};

export default HologramCore;
