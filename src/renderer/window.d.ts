import { SystemStats, MonitorSettings } from '../shared/types';

export interface ElectronAPI {
  onSystemStats: (callback: (stats: SystemStats) => void) => void;
  getSettings: () => Promise<MonitorSettings>;
  saveSettings: (settings: MonitorSettings) => Promise<boolean>;
  openSettings: () => Promise<void>;
  closeWindow: () => Promise<void>;
  minimizeWindow: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
