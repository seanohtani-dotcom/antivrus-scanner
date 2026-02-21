import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [healthRes, statsRes] = await Promise.all([
        axios.get('/api/system/health'),
        axios.get('/api/system/stats')
      ]);
      setHealth(healthRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px', fontSize: '28px' }}>Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <StatCard title="Total Scans" value={stats?.totalScans || 0} />
        <StatCard title="Known Threats" value={stats?.knownThreats || 0} />
        <StatCard title="Quarantined Files" value={stats?.quarantinedFiles || 0} />
        <StatCard 
          title="System Status" 
          value={health?.status || 'Unknown'}
          color={health?.status === 'healthy' ? '#10b981' : '#ef4444'}
        />
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>System Health</h2>
        <div style={{ display: 'grid', gap: '10px' }}>
          <InfoRow label="Uptime" value={`${Math.floor((health?.uptime || 0) / 60)} minutes`} />
          <InfoRow label="Memory Usage" value={`${health?.memory?.used || 0} MB / ${health?.memory?.total || 0} MB`} />
          <InfoRow label="Platform" value={health?.system?.platform || 'Unknown'} />
          <InfoRow label="CPUs" value={health?.system?.cpus || 0} />
          <InfoRow label="Database" value={health?.database || 'Unknown'} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color = '#2563eb' }) {
  return (
    <div className="card">
      <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '32px', fontWeight: '600', color }}>{value}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #2a2a2a' }}>
      <span style={{ color: '#9ca3af' }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default Dashboard;
