
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Activity, Shield, Wifi, Globe, Lock, PlayCircle, Target, Database, UserPlus, Volume2, VolumeX } from 'lucide-react';
import ParticleNetwork from './components/ParticleNetwork';
import HologramCore from './components/HologramCore';
import DigitalOverlay from './components/DigitalOverlay';
import InfoModal from './components/InfoModal';
import DetailModal from './components/DetailModal';
import RecruitmentModal from './components/RecruitmentModal';
import AgencyModules from './components/AgencyModules';
import { SystemStatus, AnimationMode, AgencyModule } from './types';
import { playClick, playHover, playScanSFX, playAlertSFX, toggleAmbientLoop } from './utils/soundEffects';

const App: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>(SystemStatus.IDLE);
  const [overlayMode, setOverlayMode] = useState<AnimationMode>(AnimationMode.NONE);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<AgencyModule | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Toggle ambient audio
  const handleToggleAudio = () => {
      const newState = !audioEnabled;
      setAudioEnabled(newState);
      toggleAmbientLoop(newState);
      playClick();
  };

  const triggerOverlay = (mode: AnimationMode, duration: number = 2000) => {
    setOverlayMode(mode);
    setTimeout(() => {
      setOverlayMode(AnimationMode.NONE);
    }, duration);
  };

  const handleCoreClick = () => {
    // If audio isn't enabled yet, enable it on first core interaction
    if (!audioEnabled) {
        setAudioEnabled(true);
        toggleAmbientLoop(true);
    }

    playClick();
    playScanSFX();
    
    // Trigger random digital animation sequence
    const randomModes = [AnimationMode.BINARY, AnimationMode.CODE, AnimationMode.LOGS, AnimationMode.PROCESS];
    const randomEffect = randomModes[Math.floor(Math.random() * randomModes.length)];
    
    // Start visual sequence
    setStatus(SystemStatus.SCANNING);
    triggerOverlay(randomEffect, 3000);

    // Reset status after animation
    setTimeout(() => {
      setStatus(SystemStatus.SECURE);
      setTimeout(() => setStatus(SystemStatus.IDLE), 2000);
    }, 3000);
  };

  const handleFooterAction = (action: string) => {
    playClick();
    switch (action) {
        case 'FORENSICS':
            setStatus(SystemStatus.ANALYZING);
            playScanSFX();
            triggerOverlay(AnimationMode.FORENSICS, 3000);
            setTimeout(() => setStatus(SystemStatus.SECURE), 3000);
            break;
        case 'CYBERDEFENSE':
            setStatus(SystemStatus.WARNING);
            playAlertSFX();
            triggerOverlay(AnimationMode.DEFENSE, 3000);
            setTimeout(() => setStatus(SystemStatus.SECURE), 3000);
            break;
        case 'NETWORK':
            setStatus(SystemStatus.SCANNING);
            playScanSFX();
            triggerOverlay(AnimationMode.NETWORK, 3000);
            setTimeout(() => setStatus(SystemStatus.SECURE), 3000);
            break;
        case 'RESOURCES':
            setStatus(SystemStatus.ANALYZING);
            playScanSFX();
            triggerOverlay(AnimationMode.RESOURCES, 3000);
            setTimeout(() => setStatus(SystemStatus.SECURE), 3000);
            break;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white selection:bg-cyber-cyan selection:text-black bg-cyber-dark">
      {/* Background Effects */}
      <ParticleNetwork />
      
      {/* Optimized Background Gradient (Replaces Heavy SVG Noise) */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark/50 via-cyber-dark/80 to-cyber-dark pointer-events-none" />
      
      {/* Lightweight Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}>
      </div>

      {/* Digital Overlays (Animations) */}
      <DigitalOverlay mode={overlayMode} />

      {/* Floating Interactive Modules */}
      <AgencyModules onSelectModule={setSelectedModule} />

      {/* Modals */}
      <AnimatePresence>
         {isInfoOpen && <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />}
         {isRecruitmentOpen && <RecruitmentModal isOpen={isRecruitmentOpen} onClose={() => setIsRecruitmentOpen(false)} />}
         {selectedModule && <DetailModal module={selectedModule} onClose={() => setSelectedModule(null)} />}
      </AnimatePresence>

      {/* Scanning Line Effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="w-full h-1 bg-cyber-cyan/30 blur-sm animate-scan opacity-20"></div>
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col h-screen p-6 md:p-10 pointer-events-none">
        
        {/* Top Header */}
        <header className="flex justify-between items-start pointer-events-auto">
          <div className="flex flex-col">
             <div 
                className="flex items-center space-x-4 cursor-pointer group"
                onClick={() => { playClick(); setIsInfoOpen(true); }}
                onMouseEnter={() => playHover()}
             >
                <Shield className="w-12 h-12 text-cyber-cyan transition-transform duration-300 group-hover:rotate-12" strokeWidth={1.5} />
                <div>
                    <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-cyber-cyan to-cyber-primary drop-shadow-[0_0_10px_rgba(0,243,255,0.5)] transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(0,243,255,0.8)]">
                    ANFSI
                    </h1>
                    <p className="text-xs md:text-sm text-cyber-primary tracking-[0.3em] uppercase opacity-80 pl-1 group-hover:text-cyber-cyan transition-colors">
                    Agence du Numérique des Forces de Sécurité
                    </p>
                </div>
             </div>
          </div>

          {/* Right Header Area */}
          <div className="flex flex-col items-end space-y-4">
             <div className="flex items-center space-x-3">
                 {/* Audio Toggle */}
                 <button 
                    onClick={handleToggleAudio}
                    className={`p-2 border rounded-sm transition-all backdrop-blur-sm ${audioEnabled ? 'bg-cyber-primary/20 border-cyber-cyan text-cyber-cyan shadow-[0_0_10px_rgba(0,243,255,0.3)]' : 'bg-black/40 border-cyber-primary/30 text-gray-500 hover:text-cyber-primary'}`}
                 >
                     {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                 </button>

                 {/* Recruitment Button */}
                 <button 
                    onClick={() => { playClick(); setIsRecruitmentOpen(true); }}
                    onMouseEnter={() => playHover()}
                    className="flex items-center space-x-2 bg-cyber-primary/20 border border-cyber-primary/50 px-4 py-2 rounded-sm hover:bg-cyber-primary/40 hover:border-cyber-cyan hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all group backdrop-blur-sm"
                 >
                    <UserPlus className="w-5 h-5 text-cyber-cyan group-hover:scale-110 transition-transform" />
                    <span className="font-display text-sm tracking-widest text-white">REJOINDRE</span>
                 </button>
             </div>

             {/* Status Indicator */}
             <div className="hidden md:flex flex-col items-end">
                <div className="flex items-center space-x-2 border border-cyber-primary/30 px-4 py-1 rounded-sm bg-black/20 backdrop-blur-sm">
                    <div className={`w-2 h-2 rounded-full ${
                        status === SystemStatus.WARNING ? 'bg-red-500 animate-ping' :
                        status === SystemStatus.IDLE ? 'bg-yellow-500 animate-pulse' : 
                        status === SystemStatus.ANALYZING ? 'bg-blue-500 animate-bounce' :
                        'bg-green-500'
                    }`}></div>
                    <span className={`font-mono text-sm ${
                        status === SystemStatus.WARNING ? 'text-red-500' : 'text-cyber-cyan'
                    }`}>{status}</span>
                </div>
                <div className="mt-2 text-right font-mono text-[10px] text-gray-500">
                    LAT: 48.8566 N <br/> LON: 2.3522 E
                </div>
             </div>
          </div>
        </header>

        {/* Central Content */}
        <main className="flex-1 flex flex-col items-center justify-center relative">
          
          <div className="pointer-events-auto">
             <HologramCore status={status} onClick={handleCoreClick} />
          </div>

          {/* Floating Data Widgets (Decoration) */}
          <div className="absolute left-4 top-1/3 hidden lg:block w-48 space-y-2 opacity-60 pointer-events-auto">
             <h3 className="text-xs text-cyber-primary border-b border-cyber-primary/30 mb-2">NETWORK TRAFFIC</h3>
             {[65, 40, 85, 30].map((val, i) => (
                 <div key={i} className="flex items-center space-x-2">
                     <span className="text-[10px] font-mono w-8">N-{i}</span>
                     <div className="h-1 bg-cyber-blue flex-1 overflow-hidden">
                        <div className="h-full bg-cyber-cyan" style={{ width: `${val}%` }}></div>
                     </div>
                 </div>
             ))}
          </div>

          <div className="absolute right-4 top-1/3 hidden lg:block w-48 space-y-4 opacity-60 text-right pointer-events-auto">
             <div className="border border-cyber-primary/20 p-2">
                <div className="flex justify-end items-center space-x-2 text-cyber-cyan mb-1">
                    <span className="text-xs font-display">ENCRYPTION</span>
                    <Lock className="w-3 h-3" />
                </div>
                <div className="font-mono text-2xl text-white">AES-256</div>
             </div>
             <div className="border border-cyber-primary/20 p-2">
                <div className="flex justify-end items-center space-x-2 text-cyber-cyan mb-1">
                    <span className="text-xs font-display">UPTIME</span>
                    <Activity className="w-3 h-3" />
                </div>
                <div className="font-mono text-xl text-white">99.99%</div>
             </div>
          </div>

        </main>

        {/* Bottom Nav / Footer */}
        <footer className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 pointer-events-auto">
            {[
                { label: 'FORENSICS', icon: Globe, action: 'FORENSICS' },
                { label: 'CYBERDEFENSE', icon: Shield, action: 'CYBERDEFENSE' },
                { label: 'NETWORK', icon: Wifi, action: 'NETWORK' },
                { label: 'RESOURCES', icon: Database, action: 'RESOURCES' }
            ].map((item, idx) => (
                <div 
                    key={idx} 
                    onClick={() => handleFooterAction(item.action)}
                    onMouseEnter={() => playHover()}
                    className="glass-panel p-3 flex items-center space-x-3 cursor-pointer hover:bg-cyber-cyan/10 transition-colors group active:scale-95 duration-100"
                >
                    <item.icon className="w-5 h-5 text-cyber-primary group-hover:text-cyber-cyan transition-colors" />
                    <span className="font-display text-sm tracking-widest">{item.label}</span>
                </div>
            ))}
        </footer>

      </div>
    </div>
  );
};

export default App;
