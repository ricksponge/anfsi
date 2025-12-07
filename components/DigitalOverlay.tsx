
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimationMode } from '../types';

interface DigitalOverlayProps {
  mode: AnimationMode;
}

// Fix for framer-motion type mismatch issues
const MotionDiv = motion.div as any;
const MotionSpan = motion.span as any;
const MotionLine = motion.line as any;

const DigitalOverlay: React.FC<DigitalOverlayProps> = ({ mode }) => {
  if (mode === AnimationMode.NONE) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        
        {/* BINARY RAIN EFFECT - Reduced count */}
        {mode === AnimationMode.BINARY && (
          <MotionDiv 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex justify-between px-10"
          >
            {[...Array(8)].map((_, i) => (
              <MotionDiv
                key={i}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: '100vh', opacity: [0, 1, 0] }}
                transition={{ 
                  duration: Math.random() * 2 + 1, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: Math.random() * 2 
                }}
                className="text-cyber-cyan/30 font-mono text-xs writing-vertical-rl will-change-transform"
                style={{ writingMode: 'vertical-rl' }}
              >
                {Array.from({ length: 20 }, () => Math.round(Math.random())).join(' ')}
              </MotionDiv>
            ))}
          </MotionDiv>
        )}

        {/* CODE SCROLLING EFFECT */}
        {mode === AnimationMode.CODE && (
          <MotionDiv
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute left-10 top-20 bottom-20 w-96 bg-black/40 backdrop-blur-sm border-l-2 border-cyber-primary p-4 font-mono text-xs text-cyber-primary overflow-hidden"
          >
            <MotionDiv
              animate={{ y: [0, -500] }}
              transition={{ duration: 10, ease: "linear" }}
              className="will-change-transform"
            >
              <pre>{`
import { NeuralNet } from '@anfsi/core';
import { decrypt } from '@crypto/aes';

class TacticalSystem extends SystemBase {
  async initialize() {
    await this.connectToSecureGrid();
    console.log("Grid Verified");
    
    const threatLevel = this.scanParams();
    if (threatLevel > THRESHOLD) {
       this.activateDefenseProtocol(DEFCON_3);
    }
    
    // Decrypting local caches
    const cache = await decrypt(this.storage);
    return new Interface(cache);
  }

  detectAnomaly(packet: DataPacket) {
     return packet.headers.trace !== ORIGIN;
  }
}

// Executing main thread...
const core = new TacticalSystem();
core.initialize().then(() => {
   console.log("System Ready");
});
              `.repeat(3)}</pre>
            </MotionDiv>
          </MotionDiv>
        )}

        {/* SYSTEM LOGS EFFECT */}
        {mode === AnimationMode.LOGS && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-10 bottom-20 w-80 font-mono text-[10px] text-green-400/80"
          >
             {[...Array(6)].map((_, i) => (
               <MotionDiv
                 key={i}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="mb-1"
               >
                 <span className="text-cyber-cyan">[{new Date().toLocaleTimeString()}:{Math.floor(Math.random() * 999)}]</span> PROCESS_PID_{4000 + i} STARTED... OK
               </MotionDiv>
             ))}
          </MotionDiv>
        )}

        {/* PROCESS BARS EFFECT */}
        {mode === AnimationMode.PROCESS && (
          <MotionDiv className="absolute inset-0 flex flex-col items-center justify-center space-y-8 bg-black/20 backdrop-blur-[2px]">
            {['MEMORY', 'CPU', 'NETWORK'].map((label, i) => (
              <div key={i} className="w-1/3">
                 <div className="flex justify-between text-xs font-display text-cyber-cyan mb-1">
                    <span>{label}</span>
                    <MotionSpan
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >PROCESSING...</MotionSpan>
                 </div>
                 <div className="h-2 bg-cyber-blue/50 rounded-full overflow-hidden border border-cyber-primary/30">
                    <MotionDiv 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.5, delay: i * 0.2, ease: "easeInOut" }}
                        className="h-full bg-cyber-primary shadow-[0_0_10px_#0066ff] will-change-transform"
                    />
                 </div>
              </div>
            ))}
          </MotionDiv>
        )}

        {/* FORENSICS HEX DUMP - Reduced Count */}
        {mode === AnimationMode.FORENSICS && (
            <MotionDiv
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-cyber-dark/80"
            >
                <div className="grid grid-cols-6 gap-4 font-mono text-sm text-cyber-cyan/70 opacity-50">
                    {/* Reduced from 48 to 24 */}
                    {Array.from({ length: 24 }).map((_, i) => (
                        <MotionSpan 
                            key={i}
                            animate={{ color: ['#00f3ff', '#ffffff', '#00f3ff'] }}
                            transition={{ duration: 2, delay: Math.random() * 2, repeat: Infinity }}
                        >
                            {Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0')}
                        </MotionSpan>
                    ))}
                </div>
                <div className="absolute border-2 border-cyber-primary w-64 h-64 animate-pulse-fast rounded-full shadow-[0_0_50px_rgba(0,102,255,0.3)]"></div>
                <div className="absolute text-cyber-primary font-display text-2xl tracking-[0.5em] mt-80">ANALYZING DATA</div>
            </MotionDiv>
        )}

        {/* CYBERDEFENSE RADAR */}
        {mode === AnimationMode.DEFENSE && (
             <MotionDiv
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 flex items-center justify-center"
         >
             <div className="relative w-[500px] h-[500px] border border-red-500/30 rounded-full flex items-center justify-center">
                 <div className="absolute inset-0 border border-red-500/20 rounded-full scale-75"></div>
                 <div className="absolute inset-0 border border-red-500/20 rounded-full scale-50"></div>
                 <div className="absolute w-full h-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-spin-slow rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)' }}></div>
                 
                 {/* Blips */}
                 {[...Array(5)].map((_, i) => (
                     <MotionDiv
                        key={i}
                        className="absolute w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_red]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                        style={{ 
                            top: `${20 + Math.random() * 60}%`, 
                            left: `${20 + Math.random() * 60}%` 
                        }}
                     />
                 ))}
                 <div className="absolute top-10 text-red-500 font-display tracking-widest">THREAT SCAN ACTIVE</div>
             </div>
         </MotionDiv>
        )}

        {/* NETWORK NODES */}
        {mode === AnimationMode.NETWORK && (
             <MotionDiv className="absolute inset-0">
                 <svg className="w-full h-full">
                    {[...Array(8)].map((_, i) => (
                        <MotionLine
                            key={i}
                            x1="50%"
                            y1="50%"
                            x2={`${Math.random() * 100}%`}
                            y2={`${Math.random() * 100}%`}
                            stroke="#00f3ff"
                            strokeWidth="1"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                        />
                    ))}
                    <circle cx="50%" cy="50%" r="5" fill="#fff" />
                 </svg>
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8 text-cyber-cyan font-mono text-xs bg-black/50 px-2">PING: 2ms</div>
             </MotionDiv>
        )}

        {/* RESOURCES GRID */}
        {mode === AnimationMode.RESOURCES && (
             <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-20"
             >
                 <div className="grid grid-cols-4 gap-4 w-full max-w-2xl">
                    {[...Array(12)].map((_, i) => (
                        <MotionDiv
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1, type: 'spring' }}
                            className="h-24 border border-cyber-primary/50 bg-cyber-blue/20 rounded-sm flex flex-col items-center justify-center p-2 relative overflow-hidden group"
                        >
                             <div className="absolute inset-0 bg-cyber-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                             <div className="w-8 h-8 rounded-full border border-cyber-cyan mb-2 flex items-center justify-center">
                                <div className="w-4 h-4 bg-cyber-primary/50 rounded-full"></div>
                             </div>
                             <div className="w-full h-1 bg-cyber-primary/30 rounded-full mb-1"></div>
                             <div className="w-2/3 h-1 bg-cyber-primary/30 rounded-full"></div>
                             <span className="absolute bottom-1 right-1 text-[8px] font-mono text-cyber-cyan">DB_{i}</span>
                        </MotionDiv>
                    ))}
                 </div>
                 <div className="absolute bottom-20 font-display text-cyber-primary tracking-widest bg-black/80 px-4 py-1 border border-cyber-primary">ACCESSING SECURE DATABANKS</div>
             </MotionDiv>
        )}

      </AnimatePresence>
    </div>
  );
};

export default DigitalOverlay;
