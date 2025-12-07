
import React from 'react';
import { motion } from 'framer-motion';
import { X, Server, FileText } from 'lucide-react';
import { playClick } from '../utils/soundEffects';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fix for framer-motion type mismatch issues
const MotionDiv = motion.div as any;
const MotionP = motion.p as any;

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <MotionDiv
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-3xl max-h-[80vh] overflow-hidden bg-cyber-dark border border-cyber-primary shadow-[0_0_50px_rgba(0,102,255,0.2)] rounded-lg flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyber-primary/30 bg-cyber-blue/50">
           <div className="flex items-center space-x-3 text-cyber-cyan">
              <Server className="w-5 h-5" />
              <h2 className="font-display tracking-widest text-lg">AGENCY_MANIFEST_FILE_V1.0</h2>
           </div>
           <button onClick={() => { playClick(); onClose(); }} className="text-cyber-primary hover:text-cyber-cyan transition-colors">
              <X className="w-6 h-6" />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-gray-300 scrollbar-hide">
            <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 shrink-0 bg-cyber-primary/20 rounded-full flex items-center justify-center border border-cyber-cyan/50">
                    <FileText className="w-8 h-8 text-cyber-cyan" />
                </div>
                <div>
                     <h3 className="text-xl text-white font-bold mb-1">ANFSI</h3>
                     <p className="text-cyber-primary text-sm uppercase tracking-wider">Agence du Numérique des Forces de Sécurité Intérieure</p>
                </div>
            </div>

            <MotionP initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="leading-relaxed">
              L'agence du numérique des forces de sécurité intérieure est dirigée par <span className="text-cyber-cyan font-semibold">Marc Boget</span> (général de corps d'armée).
            </MotionP>

            <MotionP initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="leading-relaxed">
              Résolument tournée vers la production de solutions numériques au profit de la population, des policiers et des gendarmes, l'agence du numérique des forces de sécurité intérieure est chargée de concevoir, conduire les projets et sécuriser les systèmes d’information et de communication « métiers » indispensables à l’exécution des missions opérationnelles des forces de sécurité intérieure sur l’ensemble du territoire national.
            </MotionP>

            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="my-4 border-l-2 border-cyber-cyan pl-4 py-2 bg-cyber-cyan/5">
                <h4 className="text-cyber-cyan font-display text-sm mb-2">MISSIONS STRATÉGIQUES</h4>
                <p className="leading-relaxed text-sm">
                   L'agence du numérique des forces de sécurité intérieure permet aux deux forces d’assurer la maîtrise de leurs outils numériques tout en facilitant le développement d’une culture professionnelle commune et en assurant l’interopérabilité et la convergence des systèmes d’information et radios.
                </p>
            </MotionDiv>

            <MotionP initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="leading-relaxed">
              Soucieuse de la qualité du service rendu, elle a pour mission de doter les forces de sécurité intérieure de solutions sûres, résilientes et adaptées à leurs besoins, de leur fournir des matériels innovants et performants et de les assister au quotidien pour assurer leur sûreté et leur efficacité opérationnelle, au service de la population.
            </MotionP>

            <MotionP initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="leading-relaxed">
              S’inscrivant dans la gouvernance numérique ministérielle, l'agence du numérique des forces de sécurité intérieure offre aux deux forces une vision transversale sur la conduite des différents projets. En tant qu'acteur de la transformation numérique de la police et la gendarmerie, son ambition est d’imaginer et de créer les solutions de demain.
            </MotionP>
        </div>
        
        {/* Footer decoration */}
        <div className="p-2 border-t border-cyber-primary/30 bg-black/40 text-[10px] font-mono text-cyber-primary/50 text-right uppercase">
           Document Verified // End of Stream
        </div>
      </MotionDiv>
    </div>
  );
};

export default InfoModal;
