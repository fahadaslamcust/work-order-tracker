import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { WorkOrderRow } from './WorkOrderRow';

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'blocked' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
}

export const WorkOrderList: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchWorkOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (assigneeFilter) params.append('assignee', assigneeFilter);

      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await apiFetch<WorkOrder[]>(`/api/work-orders${query}`);
      setWorkOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load work orders');
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, [statusFilter, assigneeFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await apiFetch<WorkOrder>(`/api/work-orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchWorkOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work order?')) return;
    try {
      await apiFetch(`/api/work-orders/${id}`, { method: 'DELETE' });
      fetchWorkOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to delete work order');
    }
  };
const handleUpdate = async (id: string) => {
  const newStatus = prompt(
    'Enter status: open, in_progress, blocked, or closed'
  );

  if (!newStatus) return;

  try {
    await apiFetch<WorkOrder>(`/api/work-orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });

    fetchWorkOrders();
  } catch (err: any) {
    alert(err.message || 'Failed to update work order');
  }
};
  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Work Orders</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label>Status Filter: </label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div>
          <label>Assignee Filter: </label>
          <input
            type="text"
            placeholder="Username..."
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
          />
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }} border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Assignee</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workOrders.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>No work orders found.</td>
            </tr>
          ) : (
            workOrders.map((wo) => (
              <WorkOrderRow
                key={wo.id}
                workOrder={wo}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};