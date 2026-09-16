import React from 'react';
import { WorkOrder } from './WorkOrderList';
import { useAuth } from '../auth/AuthContext';

interface WorkOrderRowProps {
  workOrder: WorkOrder;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const WorkOrderRow: React.FC<WorkOrderRowProps> = ({
  workOrder,
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
      <td>{workOrder.status}</td>
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