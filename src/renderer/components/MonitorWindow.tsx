import React, { useEffect, useState } from 'react';
import { SystemStats, MonitorSettings } from '../../shared/types';
import './MonitorWindow.css';

const MonitorWindow: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [settings, setSettings] = useState<MonitorSettings | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Load settings
    window.electronAPI.getSettings().then(setSettings);

    // Listen for system stats updates
    window.electronAPI.onSystemStats((newStats) => {
      setStats(newStats);
    });
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatMemory = (bytes: number): string => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    window.electronAPI.openSettings();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!stats || !settings) {
    return (
      <div className="monitor-window loading">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className={`monitor-window ${isDragging ? 'dragging' : ''}`}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ opacity: settings.opacity }}
    >
      <div className="monitor-header">
        <div className="monitor-title">资源监视器</div>
        <div className="monitor-actions">
          <button
            className="action-btn settings-btn"
            onClick={(e) => {
              e.stopPropagation();
              window.electronAPI.openSettings();
            }}
            title="设置"
          >
            ⚙️
          </button>
        </div>
      </div>

      <div className="monitor-content">
        {/* CPU */}
        <div className="stat-item">
          <div className="stat-header">
            <span className="stat-label">CPU</span>
            <span className="stat-value">{stats.cpu.usage}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill cpu"
              style={{ width: `${stats.cpu.usage}%` }}
            />
          </div>
          {settings.showTemperature && stats.cpu.temperature && (
            <div className="stat-extra">温度: {stats.cpu.temperature}°C</div>
          )}
        </div>

        {/* Memory */}
        <div className="stat-item">
          <div className="stat-header">
            <span className="stat-label">内存</span>
            <span className="stat-value">{stats.memory.percentage}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill memory"
              style={{ width: `${stats.memory.percentage}%` }}
            />
          </div>
          <div className="stat-extra">
            {formatMemory(stats.memory.used)} / {formatMemory(stats.memory.total)}
          </div>
        </div>

        {/* Network */}
        <div className="stat-item">
          <div className="stat-header">
            <span className="stat-label">网络</span>
          </div>
          <div className="network-stats">
            <div className="network-item">
              <span className="network-label">↑ 上传:</span>
              <span className="network-value">{formatBytes(stats.network.upload)}</span>
            </div>
            <div className="network-item">
              <span className="network-label">↓ 下载:</span>
              <span className="network-value">{formatBytes(stats.network.download)}</span>
            </div>
          </div>
        </div>

        {/* GPU */}
        {settings.showGpu && stats.gpu && (
          <div className="stat-item">
            <div className="stat-header">
              <span className="stat-label">GPU</span>
              <span className="stat-value">{stats.gpu.usage}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill gpu"
                style={{ width: `${stats.gpu.usage}%` }}
              />
            </div>
            {stats.gpu.memory && (
              <div className="stat-extra">
                显存: {formatMemory(stats.gpu.memory.used)} / {formatMemory(stats.gpu.memory.total)}
              </div>
            )}
            {settings.showTemperature && stats.gpu.temperature && (
              <div className="stat-extra">温度: {stats.gpu.temperature}°C</div>
            )}
          </div>
        )}

        {/* Processes */}
        {settings.showProcesses && stats.processes && stats.processes.length > 0 && (
          <div className="stat-item processes">
            <div className="stat-header">
              <span className="stat-label">
                占用最高 ({settings.processFilter === 'cpu' ? 'CPU' : '内存'})
              </span>
            </div>
            <div className="process-list">
              {stats.processes
                .sort((a, b) => {
                  if (settings.processFilter === 'cpu') {
                    return b.cpu - a.cpu;
                  }
                  return b.memory - a.memory;
                })
                .slice(0, settings.processCount)
                .map((process, index) => (
                  <div key={`${process.pid}-${index}`} className="process-item">
                    <span className="process-name">{process.name}</span>
                    <span className="process-value">
                      {settings.processFilter === 'cpu'
                        ? `${process.cpu.toFixed(1)}%`
                        : `${process.memory.toFixed(1)}%`}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitorWindow;
