import express from 'express';
import { fileMonitor } from '../services/fileMonitor.js';
import { query, findAll } from '../db/init.js';

const router = express.Router();

router.post('/start', async (req, res) => {
  const { path, options } = req.body;
  
  if (!path) {
    return res.status(400).json({ error: 'Path is required' });
  }

  try {
    const monitorId = await fileMonitor.startMonitoring(path, options);
    res.json({ 
      success: true, 
      monitorId,
      message: `Started monitoring ${path}` 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/stop/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await fileMonitor.stopMonitoring(parseInt(id));
    res.json({ 
      success: true,
      message: 'Monitor stopped' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/active', (req, res) => {
  try {
    const monitors = fileMonitor.getActiveMonitors();
    res.json(monitors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/list', async (req, res) => {
  try {
    const result = query('file_monitors').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/stats', async (req, res) => {
  const { id } = req.params;
  
  try {
    const stats = await fileMonitor.getMonitorStats(parseInt(id));
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/events', async (req, res) => {
  const { id } = req.params;
  const limit = parseInt(req.query.limit) || 50;
  
  try {
    const result = findAll('monitor_events', e => e.monitor_id === parseInt(id))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
