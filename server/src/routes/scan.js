import express from 'express';
import { scanFile, scanDirectory } from '../services/scanner.js';
import { insert, update, query } from '../db/init.js';

const router = express.Router();

router.post('/file', async (req, res) => {
  const { path } = req.body;
  const wss = req.app.get('wss');
  
  try {
    const scanId = createScanRecord(path);
    const result = await scanFile(path, (update) => {
      broadcast(wss, { type: 'scan_update', data: update });
    });
    
    updateScanRecord(scanId, result);
    res.json({ success: true, scanId, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/upload', async (req, res) => {
  const wss = req.app.get('wss');
  
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadedFile = req.files.file;
    const tempPath = uploadedFile.tempFilePath || uploadedFile.path;
    
    const scanId = createScanRecord(uploadedFile.name);
    const result = await scanFile(tempPath, (update) => {
      broadcast(wss, { type: 'scan_update', data: update });
    });
    
    updateScanRecord(scanId, result);
    res.json({ success: true, scanId, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/directory', async (req, res) => {
  const { path } = req.body;
  const wss = req.app.get('wss');
  
  try {
    const scanId = createScanRecord(path);
    const result = await scanDirectory(path, (update) => {
      broadcast(wss, { type: 'scan_update', data: update });
    });
    
    updateScanRecord(scanId, result);
    res.json({ success: true, scanId, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const result = query('scan_history').slice(-50).reverse();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function createScanRecord(path) {
  const result = insert('scan_history', { path, status: 'running', threats_found: 0, files_scanned: 0 });
  return result.lastInsertRowid;
}

function updateScanRecord(id, scanResult) {
  update('scan_history', id, {
    status: scanResult.status,
    threats_found: scanResult.threatsFound,
    files_scanned: scanResult.filesScanned,
    completed_at: new Date().toISOString()
  });
}

function broadcast(wss, message) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}

export default router;
