
import React from 'react';
import { motion } from 'framer-motion';
import { Radio, ShieldCheck, ScanSearch, LayoutDashboard, Lightbulb, Briefcase } from 'lucide-react';
import { AgencyModule } from '../types';
import { playClick, playHover } from '../utils/soundEffects';

interface AgencyModulesProps {
  onSelectModule: (module: AgencyModule) => void;
}

// Fix for framer-motion type mismatch
const MotionDiv = motion.div as any;

export const MODULES_DATA: AgencyModule[] = [
  {
    id: 'COMMS',
    title: 'Communications tactiques et maîtrise de l’environnement électromagnétique',
    description: 'Ce pôle conçoit et maintient les moyens de communication tactiques des forces de sécurité. Il gère l’environnement électromagnétique, la résilience radio et les technologies critiques pour les opérations.',
    icon: Radio
  },
  {
    id: 'SEC_ARCH',
    title: 'Architecture et sécurité du système d’information',
    description: 'Ce pôle définit l’architecture du système d’information, assure la cybersécurité, protège les données sensibles et garantit la cohérence technique de l’ensemble du SI des forces.',
    icon: ShieldCheck
  },
  {
    id: 'INVESTIGATION',
    title: 'Appui à l’investigation',
    description: 'Ce pôle développe les outils numériques d’enquête, facilite l’analyse technique et soutient les investigations judiciaires et opérationnelles avec des solutions adaptées et fiables.',
    icon: ScanSearch
  },
  {
    id: 'COMMAND',
    title: 'Applications d’appui au commandement',
    description: 'Ce pôle pilote les applications dédiées à la gestion opérationnelle, l’aide à la décision et la coordination des moyens engagés lors des missions et situations de crise.',
    icon: LayoutDashboard
  },
  {
    id: 'INNOVATION',
    title: 'Proximité numérique et appui à l’innovation',
    description: 'Ce pôle accompagne les unités dans leurs usages numériques, favorise l’expérimentation et accélère la transformation digitale via des solutions innovantes et adaptées au terrain.',
    icon: Lightbulb
  },
  {
    id: 'OPS_SUPPORT',
    title: 'Supports opérationnels',
    description: 'Ce pôle regroupe la logistique, l’administration, les finances, la gestion interne et l’ensemble des moyens garantissant la continuité opérationnelle de l’agence.',
    icon: Briefcase
  }
];

const AgencyModules: React.FC<AgencyModulesProps> = ({ onSelectModule }) => {
  // Generate semi-random initial positions to spread them out
  // We avoid the absolute center where the core is located
  const positions = [
    { top: '15%', left: '15%' },
    { top: '20%', right: '15%' },
    { top: '50%', left: '8%' },
    { top: '55%', right: '8%' },
    { bottom: '20%', left: '20%' },
    { bottom: '25%', right: '20%' },
  ];

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {MODULES_DATA.map((module, index) => {
        const Icon = module.icon;
        const initialPos = positions[index % positions.length];
        
        return (
          <MotionDiv
            key={module.id}
            initial={initialPos}
            animate={{
              y: [0, -15, 0, 15, 0],
              x: [0, 10, 0, -10, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5
            }}
            whileHover={{ scale: 1.1, zIndex: 50 }}
            className="absolute pointer-events-auto cursor-pointer will-change-transform"
            onClick={() => { playClick(); onSelectModule(module); }}
            onMouseEnter={() => playHover()}
          >
            <div className="relative group">
               {/* Button Body */}
               <div className="w-16 h-16 md:w-20 md:h-20 bg-cyber-blue/80 backdrop-blur-md border border-cyber-primary/40 rounded-2xl shadow-[0_0_15px_rgba(0,102,255,0.2)] flex items-center justify-center transition-all duration-300 group-hover:bg-cyber-primary/20 group-hover:border-cyber-cyan group-hover:shadow-[0_0_25px_rgba(0,243,255,0.4)]">
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-cyber-primary group-hover:text-cyber-cyan transition-colors" strokeWidth={1.5} />
               </div>

               {/* Hover Label */}
               <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
                  <div className="bg-black/80 text-cyber-cyan text-xs font-display px-3 py-1 border border-cyber-cyan/30 rounded-full tracking-wider shadow-lg">
                      {module.title.split(' ').slice(0, 3).join(' ')}...
                  </div>
               </div>
               
               {/* Connecting Line Decoration (Optional visual flare) */}
               <div className="absolute inset-0 border border-transparent group-hover:border-cyber-cyan/20 rounded-2xl animate-pulse-fast -z-10 scale-110"></div>
            </div>
          </MotionDiv>
        );
      })}
    </div>
  );
};

export default AgencyModules;
