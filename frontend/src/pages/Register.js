import { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/register', form);
      alert('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#e8eaf6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: 40,
        borderRadius: 16,
        width: 380,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#1a237e', marginBottom: 8 }}>Create Account 🎉</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>Start managing your bills today</p>

        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: 10, borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, color: '#333' }}>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 14,
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, color: '#333' }}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 14,
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 6, color: '#333' }}>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            onChange={e => setForm({ ...form, password: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 14,
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, color: '#333' }}>
            Phone Number (for SMS reminders)
          </label>
          <input
            type="tel"
            placeholder="Enter 10 digit mobile number"
            onChange={e => setForm({ ...form, phone: e.target.value })}
            style={{
              width: '100%', padding: '10px 14px',
              borderRadius: 8, border: '1px solid #ddd',
              fontSize: 14, boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: '#1a237e',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 16, color: '#666' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#1a237e' }}>Login here</a>
        </p>
      </div>
    </div>
  );
}