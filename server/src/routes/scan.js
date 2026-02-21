import express from 'express';
import { scanFile, scanDirectory } from '../services/scanner.js';
import { insert, update, query } from '../db/init.js';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

// Validate file path
function isValidPath(filePath) {
  // Prevent directory traversal attacks
  const normalized = path.normalize(filePath);
  return !normalized.includes('..') && path.isAbsolute(normalized);
}

// Sanitize filename
function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

router.post('/file', async (req, res) => {
  const { path: filePath } = req.body;
  const wss = req.app.get('wss');
  
  if (!filePath) {
    return res.status(400).json({ error: 'File path is required' });
  }

  if (!isValidPath(filePath)) {
    return res.status(400).json({ error: 'Invalid file path' });
  }
  
  try {
    const scanId = createScanRecord(filePath);
    const result = await scanFile(filePath, (update) => {
      broadcast(wss, { type: 'scan_update', data: update });
    });
    
    updateScanRecord(scanId, result);
    res.json({ success: true, scanId, result });
  } catch (error) {
    res.status(500).json({ error: 'Scan failed: ' + error.message });
  }
});

router.post('/upload', async (req, res) => {
  const wss = req.app.get('wss');
  
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadedFile = req.files.file;
    
    // Validate file size (50MB max)
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 52428800;
    if (uploadedFile.size > maxSize) {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB' });
    }

    // Sanitize filename
    const safeFilename = sanitizeFilename(uploadedFile.name);
    const tempPath = uploadedFile.tempFilePath || uploadedFile.path;
    
    const scanId = createScanRecord(safeFilename);
    const result = await scanFile(tempPath, (update) => {
      broadcast(wss, { type: 'scan_update', data: update });
    });
    
    // Clean up temp file
    try {
      await fs.unlink(tempPath);
    } catch (err) {
      console.error('Failed to delete temp file:', err);
    }
    
    updateScanRecord(scanId, result);
    res.json({ success: true, scanId, result });
  } catch (error) {
    res.status(500).json({ error: 'Upload scan failed: ' + error.message });
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
