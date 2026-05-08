import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

function Navbar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('token');

  if (!isLoggedIn) return null;

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{
      background: '#1a237e',
      padding: '14px 30px',
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <span style={{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginRight: 20
      }}>
        💳 BillTracker
      </span>

      <Link to="/dashboard" style={{
        color: location.pathname === '/dashboard' ? '#ffeb3b' : 'white',
        textDecoration: 'none',
        fontSize: 15,
        fontWeight: location.pathname === '/dashboard' ? 'bold' : 'normal'
      }}>
        📊 Dashboard
      </Link>

      <Link to="/subscriptions" style={{
        color: location.pathname === '/subscriptions' ? '#ffeb3b' : 'white',
        textDecoration: 'none',
        fontSize: 15,
        fontWeight: location.pathname === '/subscriptions' ? 'bold' : 'normal'
      }}>
        📋 Subscriptions
      </Link>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ color: '#9fa8da', fontSize: 14 }}>
          👤 {user?.name}
        </span>
        <button
          onClick={logout}
          style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 8,
            padding: '6px 16px',
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/subscriptions" element={
          <PrivateRoute><Subscriptions /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}