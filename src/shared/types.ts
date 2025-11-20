export interface SystemStats {
  cpu: {
    usage: number;
    temperature?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    upload: number;   // bytes per second
    download: number; // bytes per second
  };
  gpu?: {
    usage: number;
    temperature?: number;
    memory?: {
      used: number;
      total: number;
    };
  };
  processes?: ProcessInfo[];
}

export interface ProcessInfo {
  name: string;
  pid: number;
  cpu: number;
  memory: number;
}

export interface MonitorSettings {
  showGpu: boolean;
  showTemperature: boolean;
  showProcesses: boolean;
  processFilter: 'cpu' | 'memory' | 'network' | 'gpu';
  processCount: number;
  refreshInterval: number; // milliseconds
  position?: {
    x: number;
    y: number;
  };
  opacity: number;
}

export const DEFAULT_SETTINGS: MonitorSettings = {
  showGpu: false,
  showTemperature: false,
  showProcesses: false,
  processFilter: 'cpu',
  processCount: 5,
  refreshInterval: 1000,
  opacity: 0.9
};
