
import React from 'react';
import { motion } from 'framer-motion';
import { X, Layers } from 'lucide-react';
import { AgencyModule } from '../types';
import { playClick } from '../utils/soundEffects';

interface DetailModalProps {
  module: AgencyModule | null;
  onClose: () => void;
}

// Fix for framer-motion type mismatch issues
const MotionDiv = motion.div as any;

const DetailModal: React.FC<DetailModalProps> = ({ module, onClose }) => {
  if (!module) return null;

  const Icon = module.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <MotionDiv
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-2xl bg-cyber-dark border border-cyber-primary shadow-[0_0_50px_rgba(0,102,255,0.2)] rounded-lg flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyber-primary/30 bg-cyber-blue/50">
           <div className="flex items-center space-x-3 text-cyber-cyan">
              <Layers className="w-5 h-5" />
              <h2 className="font-display tracking-widest text-sm md:text-base">MODULE_DETAILS // {module.id}</h2>
           </div>
           <button onClick={() => { playClick(); onClose(); }} className="text-cyber-primary hover:text-cyber-cyan transition-colors">
              <X className="w-6 h-6" />
           </button>
        </div>

        {/* Content */}
        <div className="p-8 font-sans">
            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6 mb-6">
                <div className="w-20 h-20 shrink-0 bg-cyber-primary/10 rounded-full flex items-center justify-center border-2 border-cyber-cyan/50 shadow-[0_0_20px_rgba(0,243,255,0.2)] mb-4 md:mb-0">
                    <Icon className="w-10 h-10 text-cyber-cyan" strokeWidth={1.5} />
                </div>
                <div className="text-center md:text-left">
                     <h3 className="text-2xl text-white font-bold mb-2 font-display">{module.title}</h3>
                     <div className="h-1 w-20 bg-cyber-primary/50 mx-auto md:mx-0 rounded-full"></div>
                </div>
            </div>

            <div className="bg-cyber-blue/20 p-6 rounded-md border-l-4 border-cyber-primary">
                <p className="text-gray-300 leading-relaxed text-lg">
                    {module.description}
                </p>
            </div>
        </div>
        
        {/* Footer decoration */}
        <div className="p-2 border-t border-cyber-primary/30 bg-black/40 text-[10px] font-mono text-cyber-primary/50 flex justify-between uppercase">
           <span>System ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
           <span>Status: ONLINE</span>
        </div>
      </MotionDiv>
    </div>
  );
};

export default DetailModal;
