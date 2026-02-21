import { useState, useEffect } from 'react';
import axios from 'axios';

function Monitor() {
  const [monitors, setMonitors] = useState([]);
  const [activeMonitors, setActiveMonitors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [path, setPath] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const handleFolderSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const firstFile = files[0];
      
      // Try to get full path from file.path (Electron)
      if (firstFile.path) {
        const fullPath = firstFile.path;
        const dirPath = fullPath.substring(0, fullPath.lastIndexOf('\\') || fullPath.lastIndexOf('/'));
        setPath(dirPath || fullPath);
      } 
      // Try webkitRelativePath (browser)
      else if (firstFile.webkitRelativePath) {
        const relativePath = firstFile.webkitRelativePath;
        const dirPath = relativePath.substring(0, relativePath.indexOf('/'));
        setPath(dirPath);
      }
      // Fallback
      else {
        setPath('Selected folder');
      }
    }
  };

  useEffect(() => {
    fetchMonitors();
    fetchActiveMonitors();
    
    const ws = new WebSocket('ws://localhost:5000');
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'monitor_alert') {
        setAlerts(prev => [{
          ...message.data,
          monitorId: message.monitorId,
          timestamp: new Date()
        }, ...prev].slice(0, 10));
      }
      
      if (message.type === 'monitor_update') {
        console.log('Monitor update:', message.data);
      }
    };
    
    ws.onerror = () => {
      console.log('WebSocket connection failed - real-time updates disabled');
    };
    
    return () => ws.close();
  }, []);

  useEffect(() => {
    if (selectedMonitor) {
      fetchMonitorEvents(selectedMonitor);
      fetchMonitorStats(selectedMonitor);
    }
  }, [selectedMonitor]);

  const fetchMonitors = async () => {
    try {
      const res = await axios.get('/api/monitor/list');
      setMonitors(res.data);
    } catch (error) {
      console.error('Failed to fetch monitors:', error);
    }
  };

  const fetchActiveMonitors = async () => {
    try {
      const res = await axios.get('/api/monitor/active');
      setActiveMonitors(res.data);
    } catch (error) {
      console.error('Failed to fetch active monitors:', error);
    }
  };

  const fetchMonitorEvents = async (monitorId) => {
    try {
      const res = await axios.get(`/api/monitor/${monitorId}/events`);
      setEvents(res.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchMonitorStats = async (monitorId) => {
    try {
      const res = await axios.get(`/api/monitor/${monitorId}/stats`);
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleStartMonitor = async (e) => {
    e.preventDefault();
    
    // Validate path
    if (!path.match(/^[A-Za-z]:\\/)) {
      alert('Please enter a valid Windows path (e.g., C:\\Users\\YourName\\Desktop)');
      return;
    }
    
    try {
      await axios.post('/api/monitor/start', { path });
      setPath('');
      setShowForm(false);
      fetchMonitors();
      fetchActiveMonitors();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to start monitor');
    }
  };

  const handleStopMonitor = async (monitorId) => {
    try {
      await axios.post(`/api/monitor/stop/${monitorId}`);
      fetchMonitors();
      fetchActiveMonitors();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to stop monitor');
    }
  };

  const dismissAlert = (index) => {
    setAlerts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px' }}>Real-time Monitoring</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Monitor'}
        </button>
      </div>

      {alerts.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          {alerts.map((alert, index) => (
            <div key={index} className="card" style={{ 
              background: '#dc262620', 
              borderColor: '#dc2626',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ color: '#ef4444', fontWeight: '600', marginBottom: '5px' }}>
                  🚨 Threat Detected
                </div>
                <div style={{ fontSize: '14px' }}>
                  {alert.path} - {alert.threats?.[0]?.name}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '5px' }}>
                  {alert.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <button 
                onClick={() => dismissAlert(index)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: '#9ca3af', 
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="card">
          <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Start New Monitor</h2>
          <form onSubmit={handleStartMonitor}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Directory Path
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text');
                    setPath(pastedText.trim());
                  }}
                  placeholder="C:\path\to\monitor"
                  required
                  style={{ flex: 1 }}
                />
                <input
                  type="file"
                  id="folderInput"
                  style={{ display: 'none' }}
                  onChange={handleFolderSelect}
                  webkitdirectory="true"
                  directory="true"
                />
                <button 
                  type="button"
                  className="btn btn-primary" 
                  onClick={() => document.getElementById('folderInput').click()}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Browse
                </button>
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '5px' }}>
                All files in this directory will be monitored for changes
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Start Monitoring</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div className="card">
          <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>Active Monitors</div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: '#10b981' }}>
            {activeMonitors.length}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>Total Monitors</div>
          <div style={{ fontSize: '32px', fontWeight: '600' }}>{monitors.length}</div>
        </div>
        {stats && (
          <>
            <div className="card">
              <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>Events Detected</div>
              <div style={{ fontSize: '32px', fontWeight: '600' }}>{stats.total_events}</div>
            </div>
            <div className="card">
              <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>Threats Found</div>
              <div style={{ fontSize: '32px', fontWeight: '600', color: '#ef4444' }}>
                {stats.threats_detected}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Monitors</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Path</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Created</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {monitors.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                    No monitors yet. Click "Add Monitor" to start monitoring a directory.
                  </td>
                </tr>
              ) : (
                monitors.map((monitor) => (
                  <tr 
                    key={monitor.id} 
                    style={{ 
                      borderBottom: '1px solid #2a2a2a',
                      cursor: 'pointer',
                      background: selectedMonitor === monitor.id ? '#2563eb20' : 'transparent'
                    }}
                    onClick={() => setSelectedMonitor(monitor.id)}
                  >
                    <td style={{ padding: '10px' }}>{monitor.path}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: monitor.status === 'active' ? '#10b98120' : '#6b728020',
                        color: monitor.status === 'active' ? '#10b981' : '#9ca3af'
                      }}>
                        {monitor.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>{new Date(monitor.created_at).toLocaleString()}</td>
                    <td style={{ padding: '10px' }}>
                      {monitor.status === 'active' ? (
                        <button 
                          className="btn btn-danger" 
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStopMonitor(monitor.id);
                          }}
                        >
                          Stop
                        </button>
                      ) : (
                        <span style={{ color: '#6b7280', fontSize: '12px' }}>Stopped</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMonitor && events.length > 0 && (
        <div className="card">
          <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Recent Events</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>File</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Event</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Result</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                    <td style={{ padding: '10px', fontSize: '13px' }}>{event.file_path}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: getEventColor(event.event_type)
                      }}>
                        {event.event_type}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      {event.scan_result?.threatsFound > 0 ? (
                        <span className="status-threat">Threat Found</span>
                      ) : event.scan_result?.status === 'clean' ? (
                        <span className="status-clean">Clean</span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>{event.scan_result?.status}</span>
                      )}
                    </td>
                    <td style={{ padding: '10px', fontSize: '13px' }}>
                      {new Date(event.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function getEventColor(eventType) {
  const colors = {
    created: '#10b98120',
    modified: '#f59e0b20',
    deleted: '#6b728020'
  };
  return colors[eventType] || '#6b728020';
}

export default Monitor;
