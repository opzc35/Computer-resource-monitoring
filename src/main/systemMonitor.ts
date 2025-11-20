import * as si from 'systeminformation';

export class SystemMonitor {
  private lastNetworkStats: { rx: number; tx: number; timestamp: number } | null = null;

  async getCPUUsage(): Promise<{ usage: number; temperature?: number }> {
    const load = await si.currentLoad();
    let temperature: number | undefined;

    try {
      const temp = await si.cpuTemperature();
      temperature = temp.main || temp.cores?.[0];
    } catch (error) {
      // Temperature monitoring might not be available on all systems
    }

    return {
      usage: Math.round(load.currentLoad),
      temperature
    };
  }

  async getMemoryUsage(): Promise<{ used: number; total: number; percentage: number }> {
    const mem = await si.mem();
    return {
      used: mem.used,
      total: mem.total,
      percentage: Math.round((mem.used / mem.total) * 100)
    };
  }

  async getNetworkUsage(): Promise<{ upload: number; download: number }> {
    const stats = await si.networkStats();
    const current = stats[0]; // Get default interface

    if (!this.lastNetworkStats) {
      this.lastNetworkStats = {
        rx: current.rx_bytes,
        tx: current.tx_bytes,
        timestamp: Date.now()
      };
      return { upload: 0, download: 0 };
    }

    const timeDiff = (Date.now() - this.lastNetworkStats.timestamp) / 1000; // seconds
    const upload = Math.round((current.tx_bytes - this.lastNetworkStats.tx) / timeDiff);
    const download = Math.round((current.rx_bytes - this.lastNetworkStats.rx) / timeDiff);

    this.lastNetworkStats = {
      rx: current.rx_bytes,
      tx: current.tx_bytes,
      timestamp: Date.now()
    };

    return { upload, download };
  }

  async getGPUUsage(): Promise<{ usage: number; temperature?: number; memory?: { used: number; total: number } } | null> {
    try {
      const graphics = await si.graphics();
      const gpu = graphics.controllers[0];

      if (!gpu) return null;

      return {
        usage: gpu.utilizationGpu || 0,
        temperature: gpu.temperatureGpu,
        memory: gpu.vram && gpu.vramDynamic ? {
          used: gpu.memoryUsed || 0,
          total: gpu.vram
        } : undefined
      };
    } catch (error) {
      return null;
    }
  }

  async getProcesses(): Promise<Array<{ name: string; pid: number; cpu: number; memory: number }>> {
    const processes = await si.processes();

    return processes.list
      .map(p => ({
        name: p.name,
        pid: p.pid,
        cpu: p.cpu,
        memory: p.mem
      }))
      .sort((a, b) => b.cpu - a.cpu)
      .slice(0, 20); // Top 20 processes
  }

  async getAllStats(includeGpu: boolean = false, includeProcesses: boolean = false) {
    const [cpu, memory, network, gpu, processes] = await Promise.all([
      this.getCPUUsage(),
      this.getMemoryUsage(),
      this.getNetworkUsage(),
      includeGpu ? this.getGPUUsage() : Promise.resolve(null),
      includeProcesses ? this.getProcesses() : Promise.resolve([])
    ]);

    return {
      cpu,
      memory,
      network,
      gpu: gpu || undefined,
      processes: processes.length > 0 ? processes : undefined
    };
  }
}
