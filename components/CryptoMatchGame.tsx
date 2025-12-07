
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, RotateCcw, Shield, Key, Hash, Lock, FileKey, Cpu, Database, Server, Wifi, Eye, EyeOff } from 'lucide-react';

interface Card {
  id: string;
  icon: any;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface CryptoMatchGameProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fix for framer-motion type mismatch
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

const ICONS = [
  { icon: Key, label: 'AES-256' },
  { icon: Hash, label: 'SHA-512' },
  { icon: Shield, label: 'TLS-1.3' },
  { icon: FileKey, label: 'RSA-2048' },
  { icon: Lock, label: 'SSH-KEY' },
  { icon: Database, label: 'SQL-DB' },
  { icon: Server, label: 'VPN-TUN' },
  { icon: Cpu, label: 'CORE-I9' },
];

const CryptoMatchGame: React.FC<CryptoMatchGameProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // Store indices
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(1);
  const [bestScore, setBestScore] = useState(0);

  // Initialize or Reset Game Level
  const generateGrid = () => {
    const newCards: Card[] = [];
    const pairs = [...ICONS]; // Use all 8 pairs for 4x4 grid
    
    // Create pairs
    pairs.forEach((item, index) => {
      const card1 = { id: `pair-${index}-a`, icon: item.icon, label: item.label, isFlipped: false, isMatched: false };
      const card2 = { id: `pair-${index}-b`, icon: item.icon, label: item.label, isFlipped: false, isMatched: false };
      newCards.push(card1, card2);
    });

    // Shuffle
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }

    setCards(newCards);
  };

  const startGame = () => {
    setScore(0);
    setCombo(1);
    setTimeLeft(30);
    setGameOver(false);
    setIsPlaying(true);
    setFlippedCards([]);
    generateGrid();
  };

  // Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && !gameOver) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            setGameOver(true);
            setIsPlaying(false);
            if (score > bestScore) setBestScore(score);
            return 0;
          }
          return parseFloat((prev - 0.1).toFixed(1));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, score, bestScore]);

  // Check for Match
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.label === secondCard.label) {
        // Match Found
        setCards(prev => prev.map((card, index) => 
          index === firstIndex || index === secondIndex ? { ...card, isMatched: true } : card
        ));
        setFlippedCards([]);
        setScore(prev => prev + (100 * combo));
        setCombo(prev => Math.min(prev + 1, 5)); // Cap combo at 5x
        setTimeLeft(prev => Math.min(prev + 2, 45)); // Cap max time
        
        // Check if level complete
        const allMatched = cards.every((c, i) => 
            (i === firstIndex || i === secondIndex) ? true : c.isMatched
        );
        
        if (allMatched && cards.length > 0) {
            setTimeout(() => {
                generateGrid();
                setTimeLeft(prev => prev + 5); // Level clear bonus
            }, 500);
        }

      } else {
        // Mismatch
        setTimeout(() => {
          setCards(prev => prev.map((card, index) => 
            index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card
          ));
          setFlippedCards([]);
          setCombo(1); // Reset combo
        }, 800);
      }
    }
  }, [flippedCards, cards, combo]);

  const handleCardClick = (index: number) => {
    if (!isPlaying || gameOver) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedCards.length >= 2) return;

    setCards(prev => prev.map((card, i) => 
      i === index ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, index]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <MotionDiv
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-cyber-dark border border-cyber-primary/50 shadow-[0_0_50px_rgba(0,102,255,0.3)] rounded-xl overflow-hidden flex flex-col h-[80vh] md:h-auto"
      >
        {/* Header */}
        <div className="p-4 bg-cyber-blue/80 border-b border-cyber-primary/30 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-cyber-cyan animate-pulse" />
            <span className="font-display font-bold tracking-widest text-white">CRYPTO-MATCH PROTOCOL</span>
          </div>
          <button onClick={onClose} className="text-cyber-primary hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex justify-between items-center px-6 py-3 bg-black/40 border-b border-cyber-primary/20 shrink-0">
            <div>
                <span className="text-[10px] text-cyber-primary font-mono uppercase">DECRYPTED DATA</span>
                <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-display text-cyber-cyan">{score}</span>
                    {combo > 1 && <span className="text-xs text-yellow-400 font-mono animate-bounce">x{combo} CHAIN!</span>}
                </div>
            </div>
            <div className="flex flex-col items-end w-32">
                 <div className="flex justify-between w-full text-[10px] text-cyber-primary font-mono mb-1">
                    <span>TIME LIMIT</span>
                    <span>{timeLeft}s</span>
                 </div>
                 <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                        className={`h-full ${timeLeft < 5 ? 'bg-red-500' : 'bg-cyber-primary'}`}
                        animate={{ width: `${(timeLeft / 30) * 100}%` }}
                        transition={{ ease: "linear", duration: 0.1 }}
                    />
                 </div>
            </div>
        </div>

        {/* Game Grid Area */}
        <div className="relative flex-1 p-4 md:p-6 bg-[radial-gradient(circle_at_center,_rgba(0,102,255,0.05)_0%,_transparent_70%)] overflow-y-auto">
            
            {!isPlaying && !gameOver && (
                 <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                    <h3 className="text-xl font-display text-white mb-2">INITIATE DECRYPTION</h3>
                    <p className="text-cyber-primary text-xs font-mono mb-6">MATCH SYMBOLS TO UNLOCK SECURE DATA</p>
                    <MotionButton 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startGame}
                        className="bg-cyber-primary hover:bg-cyber-cyan text-black font-bold py-3 px-8 rounded-sm shadow-[0_0_20px_rgba(0,243,255,0.5)] flex items-center space-x-2"
                    >
                        <Play className="w-5 h-5" />
                        <span>START SEQUENCE</span>
                    </MotionButton>
                 </div>
            )}

            {gameOver && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm border border-red-500/30 m-4 rounded-lg">
                    <h3 className="text-2xl font-display text-red-500 mb-2">SESSION EXPIRED</h3>
                    <p className="text-gray-400 font-mono text-sm mb-2">DATA RECOVERED: {score}</p>
                    {score >= bestScore && score > 0 && <p className="text-yellow-400 text-xs mb-6">NEW RECORD!</p>}
                    <MotionButton 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startGame}
                        className="bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-8 rounded-sm shadow-[0_0_20px_rgba(255,0,0,0.5)] flex items-center space-x-2"
                    >
                        <RotateCcw className="w-5 h-5" />
                        <span>RETRY DECRYPTION</span>
                    </MotionButton>
                </div>
            )}

            <div className={`grid grid-cols-4 gap-2 md:gap-3 h-full max-h-[500px] mx-auto max-w-[400px] ${!isPlaying ? 'opacity-30' : ''}`}>
                {cards.map((card, index) => (
                    <MotionDiv
                        key={card.id}
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => handleCardClick(index)}
                        className="relative aspect-square cursor-pointer"
                        style={{ perspective: 1000 }}
                    >
                        {/* Card Back (Face Down) */}
                        <div 
                            className={`absolute inset-0 w-full h-full bg-cyber-blue/40 border border-cyber-primary/30 rounded-md flex items-center justify-center backface-hidden transition-all duration-300 ${!card.isFlipped && !card.isMatched ? 'hover:bg-cyber-primary/20 hover:border-cyber-cyan/50 hover:shadow-[0_0_10px_rgba(0,243,255,0.3)]' : ''}`}
                            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                        >
                            <Shield className="w-6 h-6 text-cyber-primary/50" />
                        </div>

                        {/* Card Front (Face Up) */}
                        <div 
                            className={`absolute inset-0 w-full h-full bg-cyber-dark border rounded-md flex flex-col items-center justify-center backface-hidden 
                                ${card.isMatched 
                                    ? 'border-green-400 bg-green-900/20 shadow-[0_0_15px_rgba(74,222,128,0.4)]' 
                                    : 'border-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_15px_rgba(0,243,255,0.2)]'}`}
                            style={{ 
                                transform: 'rotateY(180deg)', 
                                backfaceVisibility: 'hidden', 
                                WebkitBackfaceVisibility: 'hidden' 
                            }}
                        >
                            <card.icon className={`w-8 h-8 mb-1 ${card.isMatched ? 'text-green-400' : 'text-cyber-cyan'}`} />
                            <span className={`text-[8px] md:text-[10px] font-mono ${card.isMatched ? 'text-green-300' : 'text-cyber-primary'}`}>{card.label}</span>
                        </div>
                    </MotionDiv>
                ))}
            </div>

        </div>
      </MotionDiv>
    </div>
  );
};

export default CryptoMatchGame;
