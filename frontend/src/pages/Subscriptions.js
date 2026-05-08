import { useEffect, useState } from 'react';
import API from '../api/api';

const categories = ['OTT', 'Mobile', 'Internet', 'Electricity', 'Other'];

export default function Subscriptions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    category: 'OTT',
    amount: '',
    dueDate: '',
    billingCycle: 'monthly',
    reminderDays: 3
  });

  // Load all subscriptions
  const loadSubs = () => {
    API.get('/subscriptions').then(res => setSubs(res.data));
  };

  useEffect(() => {
    loadSubs();
  }, []);

  // Add new subscription
  const handleAdd = async () => {
    if (!form.name || !form.amount || !form.dueDate) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await API.post('/subscriptions', form);
      setForm({
        name: '',
        category: 'OTT',
        amount: '',
        dueDate: '',
        billingCycle: 'monthly',
        reminderDays: 3
      });
      loadSubs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add subscription');
    }
    setLoading(false);
  };

  // Delete subscription
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      await API.delete(`/subscriptions/${id}`);
      loadSubs();
    }
  };

  // Get days until due
  const getDaysLeft = (dueDate) => {
    const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div style={{ padding: 30, background: '#f5f7ff', minHeight: '100vh' }}>
      <h2 style={{ color: '#1a237e', marginBottom: 4 }}>My Subscriptions</h2>
      <p style={{ color: '#666', marginBottom: 30 }}>Manage all your bills in one place</p>

      {/* Add New Subscription Form */}
      <div style={{
        background: 'white', padding: 24,
        borderRadius: 16, marginBottom: 30,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ color: '#1a237e', marginTop: 0 }}>➕ Add New Subscription</h3>

        {error && (
          <div style={{
            background: '#ffebee', color: '#c62828',
            padding: 10, borderRadius: 8, marginBottom: 16
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>

          {/* Service Name */}
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#333', fontSize: 14 }}>
              Service Name
            </label>
            <input
              placeholder="e.g. Netflix"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px',
                borderRadius: 8, border: '1px solid #ddd',
                fontSize: 14, boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Category */}
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#333', fontSize: 14 }}>
              Category
            </label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px',
                borderRadius: 8, border: '1px solid #ddd',
                fontSize: 14, boxSizing: 'border-box'
              }}
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Amount */}
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#333', fontSize: 14 }}>
              Amount (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 499"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px',
                borderRadius: 8, border: '1px solid #ddd',
                fontSize: 14, boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Due Date */}
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#333', fontSize: 14 }}>
              Due Date
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px',
                borderRadius: 8, border: '1px solid #ddd',
                fontSize: 14, boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Billing Cycle */}
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#333', fontSize: 14 }}>
              Billing Cycle
            </label>
            <select
              value={form.billingCycle}
              onChange={e => setForm({ ...form, billingCycle: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px',
                borderRadius: 8, border: '1px solid #ddd',
                fontSize: 14, boxSizing: 'border-box'
              }}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Reminder Days */}
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#333', fontSize: 14 }}>
              Remind (days before)
            </label>
            <input
              type="number"
              value={form.reminderDays}
              onChange={e => setForm({ ...form, reminderDays: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px',
                borderRadius: 8, border: '1px solid #ddd',
                fontSize: 14, boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={loading}
          style={{
            marginTop: 20, padding: '12px 30px',
            background: '#1a237e', color: 'white',
            border: 'none', borderRadius: 8,
            fontSize: 15, cursor: 'pointer'
          }}
        >
          {loading ? 'Adding...' : '➕ Add Subscription'}
        </button>
      </div>

      {/* Subscriptions List */}
      <div style={{
        background: 'white', padding: 24,
        borderRadius: 16,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ color: '#1a237e', marginTop: 0 }}>
          All Subscriptions ({subs.length})
        </h3>

        {subs.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: 40 }}>
            No subscriptions yet. Add your first one above! ☝️
          </p>
        ) : (
          subs.map(s => {
            const daysLeft = getDaysLeft(s.dueDate);
            return (
              <div key={s._id} style={{
                border: '1px solid #e8eaf6',
                borderRadius: 12, padding: '16px 20px',
                marginBottom: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10
              }}>
                {/* Left Side */}
                <div>
                  <strong style={{ fontSize: 16, color: '#1a237e' }}>{s.name}</strong>
                  <span style={{
                    marginLeft: 10,
                    background: '#e8eaf6',
                    padding: '2px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    color: '#3949ab'
                  }}>
                    {s.category}
                  </span>
                  <p style={{ margin: '4px 0 0', color: '#666', fontSize: 13 }}>
                    {s.billingCycle} · Remind {s.reminderDays} days before
                  </p>
                </div>

                {/* Middle */}
                <div style={{ textAlign: 'center' }}>
                  <strong style={{ fontSize: 18, color: '#1a237e' }}>₹{s.amount}</strong>
                  <p style={{ margin: '4px 0 0', color: '#666', fontSize: 13 }}>
                    Due: {new Date(s.dueDate).toDateString()}
                  </p>
                </div>

                {/* Right Side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    background: daysLeft <= 3 ? '#ffebee' : daysLeft <= 7 ? '#fff8e1' : '#e8f5e9',
                    color: daysLeft <= 3 ? '#c62828' : daysLeft <= 7 ? '#f57f17' : '#2e7d32',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 'bold'
                  }}>
                    {daysLeft < 0 ? 'Overdue!' : daysLeft === 0 ? 'Due Today!' : `${daysLeft} days left`}
                  </span>

                  <button
                    onClick={() => handleDelete(s._id)}
                    style={{
                      background: '#ffebee', color: '#c62828',
                      border: 'none', borderRadius: 8,
                      padding: '8px 16px', cursor: 'pointer',
                      fontSize: 13
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}