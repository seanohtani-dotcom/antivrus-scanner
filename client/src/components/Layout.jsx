import { Link, useLocation } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{
        width: '250px',
        background: '#1a1a1a',
        borderRight: '1px solid #2a2a2a',
        padding: '20px'
      }}>
        <h1 style={{ marginBottom: '30px', fontSize: '20px' }}>🛡️ SecureGuard</h1>
        <ul style={{ listStyle: 'none' }}>
          <NavItem to="/" active={isActive('/')}>Dashboard</NavItem>
          <NavItem to="/scanner" active={isActive('/scanner')}>Scanner</NavItem>
          <NavItem to="/monitor" active={isActive('/monitor')}>Monitor</NavItem>
          <NavItem to="/threats" active={isActive('/threats')}>Threats</NavItem>
          <NavItem to="/quarantine" active={isActive('/quarantine')}>Quarantine</NavItem>
        </ul>
      </nav>
      <main style={{ flex: 1 }}>
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, active, children }) {
  return (
    <li style={{ marginBottom: '10px' }}>
      <Link
        to={to}
        style={{
          display: 'block',
          padding: '10px 15px',
          borderRadius: '6px',
          textDecoration: 'none',
          color: active ? '#2563eb' : '#e0e0e0',
          background: active ? '#1e3a8a20' : 'transparent',
          fontWeight: active ? '500' : '400'
        }}
      >
        {children}
      </Link>
    </li>
  );
}

export default Layout;
