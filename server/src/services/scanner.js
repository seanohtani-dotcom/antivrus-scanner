import fs from 'fs/promises';
import crypto from 'crypto';
import path from 'path';
import { query, insert } from '../db/init.js';

export async function scanFile(filePath, onProgress) {
  try {
    const content = await fs.readFile(filePath);
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    
    onProgress?.({ file: filePath, status: 'scanning' });
    
    const threats = await checkAgainstSignatures(content, hash);
    
    if (threats.length > 0) {
      await quarantineFile(filePath, threats[0].name);
      return {
        status: 'threat_found',
        threatsFound: threats.length,
        filesScanned: 1,
        threats
      };
    }
    
    return {
      status: 'clean',
      threatsFound: 0,
      filesScanned: 1
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      filesScanned: 0,
      threatsFound: 0
    };
  }
}

export async function scanDirectory(dirPath, onProgress) {
  let filesScanned = 0;
  let threatsFound = 0;
  const threats = [];
  
  async function scanRecursive(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        await scanRecursive(fullPath);
      } else {
        const result = await scanFile(fullPath, onProgress);
        filesScanned++;
        
        if (result.threatsFound > 0) {
          threatsFound += result.threatsFound;
          threats.push(...result.threats);
        }
      }
    }
  }
  
  await scanRecursive(dirPath);
  
  return {
    status: threatsFound > 0 ? 'threats_found' : 'clean',
    filesScanned,
    threatsFound,
    threats
  };
}

async function checkAgainstSignatures(content, hash) {
  const signatures = query('threat_signatures');
  const threats = [];
  
  for (const sig of signatures) {
    if (content.includes(sig.signature) || hash === sig.signature) {
      threats.push({
        name: sig.name,
        severity: sig.severity
      });
    }
  }
  
  return threats;
}

async function quarantineFile(filePath, threatName) {
  const quarantinePath = process.env.QUARANTINE_PATH || './quarantine';
  await fs.mkdir(quarantinePath, { recursive: true });
  
  const fileName = path.basename(filePath);
  const newPath = path.join(quarantinePath, `${Date.now()}_${fileName}`);
  
  await fs.rename(filePath, newPath);
  
  insert('quarantine', {
    original_path: filePath,
    threat_name: threatName,
    restored: 0
  });
}
