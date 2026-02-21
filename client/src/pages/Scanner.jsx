import { useState, useEffect } from 'react';
import axios from 'axios';

function Scanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/scan/history');
      setHistory(res.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    setScanning(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/scan/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data.result);
      fetchHistory();
    } catch (error) {
      setResult({ 
        status: 'error', 
        error: error.response?.data?.error || error.message || 'Upload failed'
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '30px', fontSize: '28px' }}>Scanner</h1>
      
      <div className="card">
        <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Upload & Scan File</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
            Select File to Scan
          </label>
          <input
            type="file"
            id="uploadInput"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <button 
            type="button"
            className="btn btn-primary" 
            onClick={() => document.getElementById('uploadInput').click()}
            disabled={scanning}
          >
            {scanning ? 'Scanning...' : 'Choose File'}
          </button>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '5px' }}>
            File will be scanned immediately after selection
          </div>
        </div>
        
        {result && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: result.status === 'error' ? '#dc262620' : '#0f0f0f', 
            borderRadius: '6px',
            border: result.status === 'error' ? '1px solid #dc2626' : 'none'
          }}>
            <div style={{ marginBottom: '10px' }}>
              Status: <span className={`status-${result.status === 'clean' ? 'clean' : result.status === 'error' ? 'threat' : 'threat'}`}>
                {result.status.toUpperCase()}
              </span>
            </div>
            {result.status === 'error' ? (
              <div style={{ color: '#ef4444' }}>{result.error}</div>
            ) : (
              <>
                <div>Files Scanned: {result.filesScanned}</div>
                <div>Threats Found: {result.threatsFound}</div>
                {result.threats && result.threats.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Detected Threats:</strong>
                    <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                      {result.threats.map((threat, i) => (
                        <li key={i} style={{ color: '#ef4444' }}>
                          {threat.name} ({threat.severity})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Scan History</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Path</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Files</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Threats</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                    No scan history yet. Start your first scan above!
                  </td>
                </tr>
              ) : (
                history.map((scan) => (
                  <tr key={scan.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                    <td style={{ padding: '10px' }}>{scan.path}</td>
                    <td style={{ padding: '10px' }}>
                      <span className={`status-${scan.status === 'clean' ? 'clean' : 'threat'}`}>
                        {scan.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>{scan.files_scanned}</td>
                    <td style={{ padding: '10px' }}>{scan.threats_found}</td>
                    <td style={{ padding: '10px' }}>{new Date(scan.started_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Scanner;
