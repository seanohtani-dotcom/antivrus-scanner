import express from 'express';
import os from 'os';
import { query, count } from '../db/init.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const uptime = process.uptime();
    const memory = process.memoryUsage();
    
    res.json({
      status: 'healthy',
      uptime,
      memory: {
        used: Math.round(memory.heapUsed / 1024 / 1024),
        total: Math.round(memory.heapTotal / 1024 / 1024)
      },
      system: {
        platform: os.platform(),
        cpus: os.cpus().length,
        totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024),
        freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024)
      },
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const scans = count('scan_history');
    const threats = count('threat_signatures');
    const quarantined = count('quarantine', q => q.restored === 0);
    
    res.json({
      totalScans: scans,
      knownThreats: threats,
      quarantinedFiles: quarantined
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
