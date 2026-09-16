import React from 'react';
import { WorkOrder } from './WorkOrderList';
import { useAuth } from '../auth/AuthContext';

interface WorkOrderRowProps {
  workOrder: WorkOrder;
  onStatusChange: (id: string, status: string) => void;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const WorkOrderRow: React.FC<WorkOrderRowProps> = ({
  workOrder,
  onStatusChange,
  onUpdate,
  onDelete,
}) => {
  const { user } = useAuth();

  return (
    <tr>
      <td>{workOrder.title}</td>
      <td>{workOrder.description}</td>
      <td>{workOrder.priority}</td>
      <td>{workOrder.assignee || 'Unassigned'}</td>
      <td>
        <select
          value={workOrder.status}
          onChange={(e) => onStatusChange(workOrder.id, e.target.value)}
        >
          <option value="open">open</option>
          <option value="in_progress">in_progress</option>
          <option value="blocked">blocked</option>
          <option value="closed">closed</option>
        </select>
      </td>
      <td>
        {user?.role === 'tech' && (
          <button onClick={() => onUpdate(workOrder.id)}>
            Update
          </button>
        )}
        {user?.role === 'admin' && (
          <button onClick={() => onDelete(workOrder.id)} style={{ color: 'red' }}>
            Delete
          </button>
        )}
      </td>
    </tr>
  );
};