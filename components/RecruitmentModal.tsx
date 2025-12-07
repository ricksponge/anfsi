
import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Users, Laptop, Coffee, ExternalLink, Briefcase, CheckCircle } from 'lucide-react';
import { playClick } from '../utils/soundEffects';

interface RecruitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fix for framer-motion type mismatch issues
const MotionDiv = motion.div as any;
const MotionA = motion.a as any;

const RecruitmentModal: React.FC<RecruitmentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <MotionDiv
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl bg-cyber-dark border border-cyber-primary shadow-[0_0_50px_rgba(0,102,255,0.2)] rounded-lg flex flex-col overflow-hidden max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyber-primary/30 bg-cyber-blue/50">
           <div className="flex items-center space-x-3 text-white">
              <Briefcase className="w-6 h-6 text-cyber-cyan" />
              <h2 className="font-display font-bold text-xl tracking-wide">RECRUTEMENT ANFSI</h2>
           </div>
           <button onClick={() => { playClick(); onClose(); }} className="text-cyber-primary hover:text-cyber-cyan transition-colors">
              <X className="w-6 h-6" />
           </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto scrollbar-hide">
            
            <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Rejoindre l’ANFSI</h3>
                <p className="text-cyber-cyan text-lg">Contribuez à la transformation numérique des forces de sécurité intérieure</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-cyber-blue/30 p-4 rounded-lg border border-cyber-primary/20 flex flex-col items-center text-center hover:bg-cyber-primary/10 transition-colors">
                    <MapPin className="w-8 h-8 text-cyber-primary mb-2" />
                    <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Localisation</span>
                    <span className="font-semibold text-white">Issy-les-Moulineaux (92)</span>
                </div>
                <div className="bg-cyber-blue/30 p-4 rounded-lg border border-cyber-primary/20 flex flex-col items-center text-center hover:bg-cyber-primary/10 transition-colors">
                    <Users className="w-8 h-8 text-cyber-primary mb-2" />
                    <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Effectifs</span>
                    <span className="font-semibold text-white">250 - 1 000 collaborateurs</span>
                </div>
                <div className="bg-cyber-blue/30 p-4 rounded-lg border border-cyber-primary/20 flex flex-col items-center text-center hover:bg-cyber-primary/10 transition-colors">
                    <Laptop className="w-8 h-8 text-cyber-primary mb-2" />
                    <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Télétravail</span>
                    <span className="font-semibold text-white">Partiel possible</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-cyber-blue/10 p-5 rounded-lg border border-cyber-primary/10">
                    <h4 className="flex items-center space-x-2 text-cyber-cyan font-display mb-4 border-b border-cyber-primary/30 pb-2">
                        <Coffee className="w-5 h-5" />
                        <span>ATOUTS & AVANTAGES</span>
                    </h4>
                    <ul className="space-y-3">
                        {[
                            "Environnement de travail moderne et convivial",
                            "Cafétéria, brasserie, salle de sport",
                            "Services internes & accompagnement par experts",
                            "Perspectives d’évolution",
                            "Prise en charge transports 75%",
                            "Billetterie et avantages divers"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start space-x-2 text-gray-300">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-1 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-cyber-blue/10 p-5 rounded-lg border border-cyber-primary/10">
                    <h4 className="flex items-center space-x-2 text-cyber-cyan font-display mb-4 border-b border-cyber-primary/30 pb-2">
                        <Laptop className="w-5 h-5" />
                        <span>DOMAINES CLÉS</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "Cybersécurité", 
                            "Communications tactiques", 
                            "Lutte anti-drones", 
                            "Systèmes d'information", 
                            "Investigation numérique", 
                            "Innovation",
                            "Transformation digitale"
                        ].map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-cyber-primary/10 border border-cyber-primary/40 rounded-full text-sm text-cyber-cyan hover:bg-cyber-primary/30 transition-colors cursor-default">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-6 pb-4">
                <MotionA 
                    href="https://www.hellowork.com/fr-fr/entreprises/anfsi-137344.html" 
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClick()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-3 bg-gradient-to-r from-blue-700 to-cyber-primary px-8 py-4 rounded-full font-bold text-white shadow-[0_0_20px_rgba(0,102,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] border border-cyber-cyan/50 transition-all hover:brightness-110"
                >
                    <span className="tracking-wide">VOIR LES OFFRES SUR HELLOWORK</span>
                    <ExternalLink className="w-5 h-5" />
                </MotionA>
            </div>

        </div>
      </MotionDiv>
    </div>
  );
};

export default RecruitmentModal;
