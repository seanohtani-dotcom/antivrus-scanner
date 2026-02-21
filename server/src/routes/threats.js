import express from 'express';
import { query, insert, findById } from '../db/init.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = query('threat_signatures').sort((a, b) => {
      const order = { critical: 4, high: 3, medium: 2, low: 1 };
      return (order[b.severity] || 0) - (order[a.severity] || 0);
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { name, signature, severity } = req.body;
  
  try {
    const result = insert('threat_signatures', { name, signature, severity });
    res.json(result.record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/quarantine', async (req, res) => {
  try {
    const result = query('quarantine')
      .filter(q => q.restored === 0)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
