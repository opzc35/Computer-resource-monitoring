import React, { useEffect, useState } from 'react';
import { MonitorSettings, DEFAULT_SETTINGS } from '../../shared/types';
import './SettingsWindow.css';

const SettingsWindow: React.FC = () => {
  const [settings, setSettings] = useState<MonitorSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    window.electronAPI.getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const success = await window.electronAPI.saveSettings(settings);
      if (success) {
        setSaveMessage('设置已保存');
        setTimeout(() => setSaveMessage(''), 2000);
      } else {
        setSaveMessage('保存失败');
      }
    } catch (error) {
      setSaveMessage('保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    window.electronAPI.closeWindow();
  };

  return (
    <div className="settings-window">
      <div className="settings-header">
        <h1 className="settings-title">设置</h1>
        <button className="close-btn" onClick={handleClose}>
          ✕
        </button>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2 className="section-title">显示选项</h2>

          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.showGpu}
                onChange={(e) =>
                  setSettings({ ...settings, showGpu: e.target.checked })
                }
              />
              <span>显示GPU使用情况</span>
            </label>
            <p className="setting-description">在监视器窗口中显示GPU使用率和显存</p>
          </div>

          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.showTemperature}
                onChange={(e) =>
                  setSettings({ ...settings, showTemperature: e.target.checked })
                }
              />
              <span>显示温度信息</span>
            </label>
            <p className="setting-description">显示CPU和GPU的温度（如果可用）</p>
          </div>

          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.showProcesses}
                onChange={(e) =>
                  setSettings({ ...settings, showProcesses: e.target.checked })
                }
              />
              <span>显示进程列表</span>
            </label>
            <p className="setting-description">显示占用资源最多的进程</p>
          </div>
        </div>

        {settings.showProcesses && (
          <div className="settings-section">
            <h2 className="section-title">进程显示设置</h2>

            <div className="setting-item">
              <label className="setting-label-block">
                <span>排序方式</span>
              </label>
              <select
                className="setting-select"
                value={settings.processFilter}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    processFilter: e.target.value as 'cpu' | 'memory' | 'network' | 'gpu'
                  })
                }
              >
                <option value="cpu">CPU占用</option>
                <option value="memory">内存占用</option>
                <option value="network">网络占用</option>
                <option value="gpu">GPU占用</option>
              </select>
            </div>

            <div className="setting-item">
              <label className="setting-label-block">
                <span>显示进程数量: {settings.processCount}</span>
              </label>
              <input
                type="range"
                className="setting-slider"
                min="3"
                max="10"
                value={settings.processCount}
                onChange={(e) =>
                  setSettings({ ...settings, processCount: parseInt(e.target.value) })
                }
              />
              <p className="setting-description">显示占用最多的进程数量</p>
            </div>
          </div>
        )}

        <div className="settings-section">
          <h2 className="section-title">性能设置</h2>

          <div className="setting-item">
            <label className="setting-label-block">
              <span>刷新间隔: {settings.refreshInterval / 1000}秒</span>
            </label>
            <input
              type="range"
              className="setting-slider"
              min="500"
              max="5000"
              step="500"
              value={settings.refreshInterval}
              onChange={(e) =>
                setSettings({ ...settings, refreshInterval: parseInt(e.target.value) })
              }
            />
            <p className="setting-description">更新系统资源信息的时间间隔</p>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-title">外观设置</h2>

          <div className="setting-item">
            <label className="setting-label-block">
              <span>窗口透明度: {Math.round(settings.opacity * 100)}%</span>
            </label>
            <input
              type="range"
              className="setting-slider"
              min="0.3"
              max="1"
              step="0.05"
              value={settings.opacity}
              onChange={(e) =>
                setSettings({ ...settings, opacity: parseFloat(e.target.value) })
              }
            />
            <p className="setting-description">调整监视器窗口的透明度</p>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        {saveMessage && (
          <span className={`save-message ${saveMessage.includes('失败') ? 'error' : 'success'}`}>
            {saveMessage}
          </span>
        )}
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? '保存中...' : '保存设置'}
        </button>
        <button className="btn btn-secondary" onClick={handleClose}>
          关闭
        </button>
      </div>
    </div>
  );
};

export default SettingsWindow;
