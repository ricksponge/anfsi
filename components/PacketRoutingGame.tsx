import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Play, RotateCcw, Lock, Cpu, ArrowRight } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 6;
const BASE_TIME = 15;

interface PacketRoutingGameProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fix for framer-motion type mismatch
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

const PacketRoutingGame: React.FC<PacketRoutingGameProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BASE_TIME);
  const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState<Point>({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 });
  const [obstacles, setObstacles] = useState<Point[]>([]);
  const [path, setPath] = useState<Point[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs for touch handling
  const gridRef = useRef<HTMLDivElement>(null);

  // Generate a new level
  const generateLevel = useCallback((currentScore: number) => {
    // 1. Determine Start and End points (edges preferably)
    const newStart = { x: 0, y: Math.floor(Math.random() * GRID_SIZE) };
    let newEnd = { x: GRID_SIZE - 1, y: Math.floor(Math.random() * GRID_SIZE) };
    
    // Ensure end is far enough
    while (Math.abs(newEnd.x - newStart.x) + Math.abs(newEnd.y - newStart.y) < 4) {
         newEnd = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    }

    setStartPoint(newStart);
    setEndPoint(newEnd);
    setPath([newStart]);

    // 2. Generate Obstacles
    // Density increases slightly with score, max 30% coverage
    const obstacleCount = Math.min(Math.floor(GRID_SIZE * GRID_SIZE * 0.15) + Math.floor(currentScore / 2), 12);
    const newObstacles: Point[] = [];

    while (newObstacles.length < obstacleCount) {
      const obs = { 
        x: Math.floor(Math.random() * GRID_SIZE), 
        y: Math.floor(Math.random() * GRID_SIZE) 
      };

      // Check collision with start, end, or existing obstacles
      const isStart = obs.x === newStart.x && obs.y === newStart.y;
      const isEnd = obs.x === newEnd.x && obs.y === newEnd.y;
      const exists = newObstacles.some(o => o.x === obs.x && o.y === obs.y);

      // Simple reachability heuristic: don't block immediate neighbors of start/end
      const isBlockStart = Math.abs(obs.x - newStart.x) + Math.abs(obs.y - newStart.y) === 1;
      const isBlockEnd = Math.abs(obs.x - newEnd.x) + Math.abs(obs.y - newEnd.y) === 1;

      if (!isStart && !isEnd && !exists && !isBlockStart && !isBlockEnd) {
        newObstacles.push(obs);
      }
    }
    setObstacles(newObstacles);

    // 3. Reset Timer based on difficulty
    // Time gets shorter as score goes up, minimum 3 seconds
    const newTime = Math.max(3, BASE_TIME - (currentScore * 0.8));
    setTimeLeft(newTime);
  }, []);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    generateLevel(0);
  };

  // Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && !gameOver) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            setGameOver(true);
            setIsPlaying(false);
            return 0;
          }
          return parseFloat((prev - 0.1).toFixed(1));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  // Input Handlers
  const handleStartDrag = (x: number, y: number) => {
    if (!isPlaying || gameOver) return;
    if (x === startPoint.x && y === startPoint.y) {
      setIsDragging(true);
      setPath([{ x, y }]);
    }
  };

  const handleMoveDrag = (x: number, y: number) => {
    if (!isDragging || !isPlaying || gameOver) return;

    const lastPoint = path[path.length - 1];
    
    // Check if new point is valid
    // 1. Is neighbor?
    const isNeighbor = Math.abs(x - lastPoint.x) + Math.abs(y - lastPoint.y) === 1;
    // 2. Is obstacle?
    const isObstacle = obstacles.some(o => o.x === x && o.y === y);
    // 3. Is already in path? (Backtracking allowed by slicing, but here we prevent loops)
    const isInPath = path.some(p => p.x === x && p.y === y);

    // If it's the previous point, allow "backing up"
    if (path.length > 1 && path[path.length - 2].x === x && path[path.length - 2].y === y) {
        setPath(prev => prev.slice(0, -1));
        return;
    }

    if (isNeighbor && !isObstacle && !isInPath) {
      const newPath = [...path, { x, y }];
      setPath(newPath);

      // Check Win Condition
      if (x === endPoint.x && y === endPoint.y) {
        handleLevelComplete();
      }
    }
  };

  const handleEndDrag = () => {
    setIsDragging(false);
    // If not at end, maybe clear path or keep it? 
    // Let's reset path if incomplete to encourage clean execution
    const lastPoint = path[path.length - 1];
    if (lastPoint.x !== endPoint.x || lastPoint.y !== endPoint.y) {
        setPath([startPoint]);
    }
  };

  const handleLevelComplete = () => {
    setIsDragging(false);
    const newScore = score + 1;
    setScore(newScore);
    generateLevel(newScore);
  };

  // Touch support helper to map coordinates to grid cells
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scroll
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.hasAttribute('data-grid-x')) {
        const x = parseInt(element.getAttribute('data-grid-x') || '0');
        const y = parseInt(element.getAttribute('data-grid-y') || '0');
        handleMoveDrag(x, y);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <MotionDiv
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-cyber-dark border border-cyber-primary/50 shadow-[0_0_50px_rgba(0,102,255,0.3)] rounded-xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 bg-cyber-blue/80 border-b border-cyber-primary/30 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyber-cyan animate-pulse" />
            <span className="font-display font-bold tracking-widest text-white">PACKET ROUTING</span>
          </div>
          <button onClick={onClose} className="text-cyber-primary hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Game Stats */}
        <div className="flex justify-between items-center px-6 py-3 bg-black/40 border-b border-cyber-primary/20">
            <div className="flex flex-col">
                <span className="text-[10px] text-cyber-primary font-mono uppercase">Secure Connections</span>
                <span className="text-2xl font-display text-cyber-cyan">{score}</span>
            </div>
            <div className="flex flex-col items-end w-32">
                 <div className="flex justify-between w-full text-[10px] text-cyber-primary font-mono mb-1">
                    <span>TTL</span>
                    <span>{timeLeft}s</span>
                 </div>
                 <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                        className={`h-full ${timeLeft < 3 ? 'bg-red-500' : 'bg-cyber-primary'}`}
                        animate={{ width: `${(timeLeft / BASE_TIME) * 100}%` }}
                        transition={{ ease: "linear", duration: 0.1 }}
                    />
                 </div>
            </div>
        </div>

        {/* Game Area */}
        <div className="p-6 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(0,102,255,0.1)_0%,_transparent_70%)]">
            
            {!isPlaying && !gameOver && (
                 <div className="absolute z-10 text-center">
                    <h3 className="text-xl font-display text-white mb-4">INITIALIZE ROUTING PROTOCOL</h3>
                    <MotionButton 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startGame}
                        className="bg-cyber-primary hover:bg-cyber-cyan text-black font-bold py-3 px-8 rounded-sm shadow-[0_0_20px_rgba(0,243,255,0.5)] flex items-center space-x-2 mx-auto"
                    >
                        <Play className="w-5 h-5" />
                        <span>START SEQUENCE</span>
                    </MotionButton>
                 </div>
            )}

            {gameOver && (
                <div className="absolute z-10 text-center bg-black/80 p-8 rounded-lg border border-red-500/50 backdrop-blur-sm">
                    <h3 className="text-2xl font-display text-red-500 mb-2">CONNECTION LOST</h3>
                    <p className="text-gray-400 font-mono text-sm mb-6">PACKETS ROUTED: {score}</p>
                    <MotionButton 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startGame}
                        className="bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-8 rounded-sm shadow-[0_0_20px_rgba(255,0,0,0.5)] flex items-center space-x-2 mx-auto"
                    >
                        <RotateCcw className="w-5 h-5" />
                        <span>RETRY HANDSHAKE</span>
                    </MotionButton>
                </div>
            )}

            <div 
                ref={gridRef}
                className={`grid gap-1 relative ${!isPlaying ? 'blur-sm opacity-50' : ''}`}
                style={{ 
                    gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                    touchAction: 'none' // Crucial for drag
                }}
                onMouseLeave={handleEndDrag}
                onMouseUp={handleEndDrag}
                onTouchEnd={handleEndDrag}
                onTouchMove={handleTouchMove}
            >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                    const x = i % GRID_SIZE;
                    const y = Math.floor(i / GRID_SIZE);
                    
                    const isStart = startPoint.x === x && startPoint.y === y;
                    const isEnd = endPoint.x === x && endPoint.y === y;
                    const isObstacle = obstacles.some(o => o.x === x && o.y === y);
                    const isPath = path.some(p => p.x === x && p.y === y);
                    
                    return (
                        <div
                            key={i}
                            data-grid-x={x}
                            data-grid-y={y}
                            onMouseDown={() => handleStartDrag(x, y)}
                            onMouseEnter={() => handleMoveDrag(x, y)}
                            className={`
                                w-10 h-10 md:w-12 md:h-12 rounded-sm border flex items-center justify-center transition-all duration-200 select-none
                                ${isStart ? 'border-green-400 bg-green-500/20 shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 
                                  isEnd ? 'border-cyber-cyan bg-cyber-cyan/20 animate-pulse' :
                                  isObstacle ? 'border-red-500/50 bg-red-900/20' : 
                                  isPath ? 'border-cyber-primary bg-cyber-primary/40 shadow-[0_0_10px_rgba(0,102,255,0.6)]' :
                                  'border-cyber-primary/10 bg-black/20 hover:bg-white/5'}
                            `}
                        >
                            {isStart && <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />}
                            {isEnd && <Lock className="w-4 h-4 text-cyber-cyan" />}
                            {isObstacle && <X className="w-4 h-4 text-red-500 opacity-70" />}
                            {isPath && !isStart && !isEnd && <div className="w-2 h-2 bg-cyber-primary rounded-full" />}
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-6 text-center text-xs font-mono text-gray-500">
                <p>STATUS: {isPlaying ? 'ROUTING IN PROGRESS...' : 'WAITING FOR INPUT'}</p>
                <p className="mt-1 opacity-50">DRAG CURSOR FROM START TO PORT 443</p>
            </div>

        </div>
      </MotionDiv>
    </div>
  );
};

export default PacketRoutingGame;