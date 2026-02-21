import express from 'express';
import { query, insert, findById } from '../db/init.js';
import validator from 'validator';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = query('threat_signatures').sort((a, b) => {
      const order = { critical: 4, high: 3, medium: 2, low: 1 };
      return (order[b.severity] || 0) - (order[a.severity] || 0);
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch threats' });
  }
});

router.post('/', async (req, res) => {
  const { name, signature, severity } = req.body;
  
  // Validate input
  if (!name || !signature || !severity) {
    return res.status(400).json({ error: 'Name, signature, and severity are required' });
  }

  // Sanitize inputs
  const sanitizedName = validator.escape(name.trim());
  const sanitizedSignature = signature.trim();
  
  // Validate severity
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  if (!validSeverities.includes(severity)) {
    return res.status(400).json({ error: 'Invalid severity level' });
  }

  // Validate signature length
  if (sanitizedSignature.length < 3 || sanitizedSignature.length > 1000) {
    return res.status(400).json({ error: 'Signature must be between 3 and 1000 characters' });
  }
  
  try {
    const result = insert('threat_signatures', { 
      name: sanitizedName, 
      signature: sanitizedSignature, 
      severity 
    });
    res.json(result.record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add threat' });
  }
});

router.get('/quarantine', async (req, res) => {
  try {
    const result = query('quarantine')
      .filter(q => q.restored === 0)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quarantine' });
  }
});

export default router;
