export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}

export enum SystemStatus {
  IDLE = 'STANDBY',
  SCANNING = 'SCANNING',
  ANALYZING = 'ANALYZING',
  SECURE = 'SECURE',
  WARNING = 'THREAT DETECTED'
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export enum AnimationMode {
  NONE = 'NONE',
  BINARY = 'BINARY',
  CODE = 'CODE',
  LOGS = 'LOGS',
  PROCESS = 'PROCESS',
  FORENSICS = 'FORENSICS',
  DEFENSE = 'DEFENSE',
  NETWORK = 'NETWORK',
  RESOURCES = 'RESOURCES'
}

export interface AgencyModule {
  id: string;
  title: string;
  description: string;
  icon: any; // Using any for Lucide icon component type
}