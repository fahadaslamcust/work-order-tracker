import React, { useState } from 'react';
import { apiFetch } from '../api/client';

export const NewWorkOrderForm: React.FC<{ onCreated: () => void }> = ({ onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'open' | 'in_progress' | 'blocked' | 'closed'>('open');
  const [assignee, setAssignee] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await apiFetch('/api/work-orders', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          priority,
          status,
          assignee: assignee.trim() || null,
        }),
      });
      setTitle('');
      setDescription('');
      setAssignee('');
      onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create work order');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
      <h4>Create New Work Order</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '0.5rem' }}>
        <input
          type="text"
          placeholder="Title (min 3 chars)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
        <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="blocked">Blocked</option>
          <option value="closed">Closed</option>
        </select>
        <input
          type="text"
          placeholder="Assignee Username"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        />
      </div>
      <button type="submit">Create Work Order</button>
    </form>
  );
};