import { useEffect, useState } from 'react';
import API from '../api/api';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const COLORS = ['#1a237e', '#283593', '#3949ab', '#5c6bc0', '#9fa8da'];

export default function Dashboard() {
  const [subs, setSubs] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.get('/subscriptions').then(res => setSubs(res.data));
  }, []);

  // Calculate total monthly spending
  const totalMonthly = subs.reduce((acc, s) => {
    return acc + (s.billingCycle === 'monthly' ? s.amount : s.amount / 12);
  }, 0);

  // Calculate total yearly spending
  const totalYearly = subs.reduce((acc, s) => {
    return acc + (s.billingCycle === 'yearly' ? s.amount : s.amount * 12);
  }, 0);

  // Get bills due within 7 days
  const upcoming = subs.filter(s => {
    const days = Math.ceil((new Date(s.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days <= 7 && days >= 0;
  });

  // Data for pie chart
  const categoryData = ['OTT', 'Mobile', 'Internet', 'Electricity', 'Other'].map(cat => ({
    name: cat,
    value: subs.filter(s => s.category === cat).reduce((a, s) => a + s.amount, 0)
  })).filter(d => d.value > 0);

  // Data for bar chart
  const barData = subs.map(s => ({
    name: s.name,
    amount: s.amount
  }));

  return (
    <div style={{ padding: 30, background: '#f5f7ff', minHeight: '100vh' }}>

      {/* Welcome Message */}
      <h2 style={{ color: '#1a237e', marginBottom: 4 }}>
        Welcome back, {user?.name} 👋
      </h2>
      <p style={{ color: '#666', marginBottom: 30 }}>
        Here is your billing overview
      </p>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 30, flexWrap: 'wrap' }}>
        <div style={{
          background: '#1a237e', color: 'white',
          padding: 24, borderRadius: 16, flex: 1, minWidth: 180
        }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Monthly Spending</p>
          <h2 style={{ margin: '8px 0 0' }}>₹{totalMonthly.toFixed(0)}</h2>
        </div>

        <div style={{
          background: '#283593', color: 'white',
          padding: 24, borderRadius: 16, flex: 1, minWidth: 180
        }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Yearly Spending</p>
          <h2 style={{ margin: '8px 0 0' }}>₹{totalYearly.toFixed(0)}</h2>
        </div>

        <div style={{
          background: '#3949ab', color: 'white',
          padding: 24, borderRadius: 16, flex: 1, minWidth: 180
        }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Active Subscriptions</p>
          <h2 style={{ margin: '8px 0 0' }}>{subs.length}</h2>
        </div>

        <div style={{
          background: '#c62828', color: 'white',
          padding: 24, borderRadius: 16, flex: 1, minWidth: 180
        }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Due This Week</p>
          <h2 style={{ margin: '8px 0 0' }}>{upcoming.length}</h2>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 30, flexWrap: 'wrap' }}>

        {/* Pie Chart */}
        <div style={{
          background: 'white', padding: 24,
          borderRadius: 16, flex: 1, minWidth: 300,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ color: '#1a237e', marginTop: 0 }}>Spending by Category</h3>
          {categoryData.length === 0 ? (
            <p style={{ color: '#999' }}>No data yet. Add subscriptions!</p>
          ) : (
            <PieChart width={300} height={250}>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
            </PieChart>
          )}
        </div>

        {/* Bar Chart */}
        <div style={{
          background: 'white', padding: 24,
          borderRadius: 16, flex: 1, minWidth: 300,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ color: '#1a237e', marginTop: 0 }}>Amount per Service</h3>
          {barData.length === 0 ? (
            <p style={{ color: '#999' }}>No data yet. Add subscriptions!</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Bar dataKey="amount" fill="#1a237e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Upcoming Due Bills */}
      <div style={{
        background: 'white', padding: 24,
        borderRadius: 16,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ color: '#1a237e', marginTop: 0 }}>⚠️ Due This Week</h3>
        {upcoming.length === 0 ? (
          <p style={{ color: '#999' }}>No bills due this week 🎉</p>
        ) : (
          upcoming.map(s => (
            <div key={s._id} style={{
              background: '#fff8e1',
              border: '1px solid #ffe082',
              padding: '12px 16px',
              borderRadius: 10,
              marginBottom: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ color: '#1a237e' }}>{s.name}</strong>
                <span style={{
                  marginLeft: 10,
                  background: '#e8eaf6',
                  padding: '2px 8px',
                  borderRadius: 20,
                  fontSize: 12,
                  color: '#3949ab'
                }}>
                  {s.category}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ color: '#c62828' }}>₹{s.amount}</strong>
                <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
                  Due: {new Date(s.dueDate).toDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}