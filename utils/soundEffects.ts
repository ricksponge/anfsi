
// Simple synthesizer for Cyber UI sounds using Web Audio API

let audioCtx: AudioContext | null = null;
let ambientNodes: AudioNode[] = [];
let ambientGain: GainNode | null = null;

const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

const createOscillator = (ctx: AudioContext, type: OscillatorType, freq: number) => {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    return osc;
};

const createGain = (ctx: AudioContext, startVol: number) => {
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(startVol, ctx.currentTime);
    return gain;
};

export const toggleAmbientLoop = (enable: boolean) => {
    const ctx = initAudio();
    if (!ctx) return;

    if (enable) {
        if (ambientNodes.length > 0) return; // Already playing

        // Master gain for ambient
        ambientGain = ctx.createGain();
        ambientGain.gain.setValueAtTime(0.05, ctx.currentTime); // Low volume
        ambientGain.connect(ctx.destination);

        // 1. Deep Drone (Sine)
        const droneOsc = ctx.createOscillator();
        droneOsc.type = 'sine';
        droneOsc.frequency.setValueAtTime(55, ctx.currentTime); // Low A
        droneOsc.connect(ambientGain);
        droneOsc.start();

        // 2. Texture (Filtered Sawtooth with LFO)
        const textureOsc = ctx.createOscillator();
        textureOsc.type = 'sawtooth';
        textureOsc.frequency.setValueAtTime(110, ctx.currentTime); 

        // Filter for texture
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, ctx.currentTime);

        // LFO for Filter modulation
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime); // Slow pulse
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(100, ctx.currentTime);
        
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        
        textureOsc.connect(filter);
        filter.connect(ambientGain);

        textureOsc.start();
        lfo.start();

        // 3. High Ethereal Whine (very subtle)
        const highOsc = ctx.createOscillator();
        highOsc.type = 'sine';
        highOsc.frequency.setValueAtTime(2000, ctx.currentTime);
        const highGain = ctx.createGain();
        highGain.gain.setValueAtTime(0.02, ctx.currentTime);
        highOsc.connect(highGain);
        highGain.connect(ambientGain);
        highOsc.start();

        ambientNodes.push(droneOsc, textureOsc, filter, lfo, lfoGain, highOsc, highGain);

    } else {
        // Stop all
        if (ambientGain) {
            // Fade out
            ambientGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            setTimeout(() => {
                ambientNodes.forEach(node => {
                    try { (node as any).stop(); } catch(e){}
                    node.disconnect();
                });
                ambientNodes = [];
                if (ambientGain) {
                    ambientGain.disconnect();
                    ambientGain = null;
                }
            }, 500);
        }
    }
};

export const playClick = () => {
    const ctx = initAudio();
    if (!ctx) return;

    // High pitched digital blip
    const osc = createOscillator(ctx, 'sine', 1200);
    const gain = createGain(ctx, 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);

    // Subtle low thud
    const osc2 = createOscillator(ctx, 'triangle', 200);
    const gain2 = createGain(ctx, 0.1);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc2.start();
    osc2.stop(ctx.currentTime + 0.1);
};

export const playHover = () => {
    const ctx = initAudio();
    if (!ctx) return;

    // Very short high frequency tick
    const osc = createOscillator(ctx, 'square', 4000);
    const gain = createGain(ctx, 0.02);
    
    // Filter to make it less harsh
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 5000;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
};

export const playScanSFX = () => {
    const ctx = initAudio();
    if (!ctx) return;

    const masterGain = createGain(ctx, 0.05);
    masterGain.connect(ctx.destination);

    // Sequence of random data chirps
    const now = ctx.currentTime;
    for (let i = 0; i < 10; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800 + Math.random() * 1000, now + i * 0.05);
        
        gain.gain.setValueAtTime(0.05, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.05);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.05);
    }
};

export const playAlertSFX = () => {
    const ctx = initAudio();
    if (!ctx) return;

    const osc = createOscillator(ctx, 'sawtooth', 400);
    const gain = createGain(ctx, 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Siren effect
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.6);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
};
