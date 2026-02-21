import chokidar from 'chokidar';
import { scanFile } from './scanner.js';
import { insert, update, findAll } from '../db/init.js';

class FileMonitor {
  constructor() {
    this.watchers = new Map();
    this.activeMonitors = new Map();
  }

  async startMonitoring(path, options = {}) {
    if (this.watchers.has(path)) {
      throw new Error('Path is already being monitored');
    }

    const monitorId = await this.createMonitorRecord(path, options);
    
    const watcher = chokidar.watch(path, {
      ignored: options.ignored || /(^|[\/\\])\../,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
      }
    });

    const handleFileEvent = async (filePath, event) => {
      console.log(`File ${event}: ${filePath}`);
      
      try {
        const result = await scanFile(filePath, (update) => {
          this.broadcastUpdate(monitorId, { ...update, event });
        });

        await this.logMonitorEvent(monitorId, filePath, event, result);

        if (result.threatsFound > 0) {
          this.broadcastAlert(monitorId, {
            type: 'threat_detected',
            path: filePath,
            event,
            threats: result.threats
          });
        }
      } catch (error) {
        console.error(`Error scanning ${filePath}:`, error);
        await this.logMonitorEvent(monitorId, filePath, event, { 
          status: 'error', 
          error: error.message 
        });
      }
    };

    watcher
      .on('add', (path) => handleFileEvent(path, 'created'))
      .on('change', (path) => handleFileEvent(path, 'modified'))
      .on('unlink', (path) => this.logMonitorEvent(monitorId, path, 'deleted', { status: 'deleted' }))
      .on('error', (error) => console.error('Watcher error:', error));

    this.watchers.set(path, watcher);
    this.activeMonitors.set(monitorId, { path, watcher, options });

    await this.updateMonitorStatus(monitorId, 'active');

    return monitorId;
  }

  async stopMonitoring(monitorId) {
    const monitor = this.activeMonitors.get(monitorId);
    if (!monitor) {
      throw new Error('Monitor not found');
    }

    await monitor.watcher.close();
    this.watchers.delete(monitor.path);
    this.activeMonitors.delete(monitorId);

    await this.updateMonitorStatus(monitorId, 'stopped');
  }

  async createMonitorRecord(path, options) {
    const result = insert('file_monitors', {
      path,
      status: 'starting',
      options: JSON.stringify(options)
    });
    return result.lastInsertRowid;
  }

  async updateMonitorStatus(monitorId, status) {
    update('file_monitors', monitorId, { status });
  }

  async logMonitorEvent(monitorId, filePath, event, result) {
    insert('monitor_events', {
      monitor_id: monitorId,
      file_path: filePath,
      event_type: event,
      scan_result: JSON.stringify(result)
    });
  }

  broadcastUpdate(monitorId, update) {
    if (this.wsServer) {
      this.wsServer.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: 'monitor_update',
            monitorId,
            data: update
          }));
        }
      });
    }
  }

  broadcastAlert(monitorId, alert) {
    if (this.wsServer) {
      this.wsServer.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: 'monitor_alert',
            monitorId,
            data: alert
          }));
        }
      });
    }
  }

  setWebSocketServer(wss) {
    this.wsServer = wss;
  }

  getActiveMonitors() {
    return Array.from(this.activeMonitors.entries()).map(([id, monitor]) => ({
      id,
      path: monitor.path,
      options: monitor.options
    }));
  }

  async getMonitorStats(monitorId) {
    const events = findAll('monitor_events', e => e.monitor_id === monitorId);
    return {
      total_events: events.length,
      files_created: events.filter(e => e.event_type === 'created').length,
      files_modified: events.filter(e => e.event_type === 'modified').length,
      files_deleted: events.filter(e => e.event_type === 'deleted').length,
      threats_detected: events.filter(e => {
        try {
          const result = JSON.parse(e.scan_result);
          return result.threatsFound > 0;
        } catch {
          return false;
        }
      }).length
    };
  }
}

export const fileMonitor = new FileMonitor();
