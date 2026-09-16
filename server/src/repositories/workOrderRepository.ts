import seedData from '../data/seed.json';
import { WorkOrder } from '../domain/workOrder';

// In-memory storage initialized from seed.json
let workOrders: WorkOrder[] = [...seedData] as WorkOrder[];

export const workOrderRepository = {
  findAll: (filters?: { status?: string; assignee?: string }): WorkOrder[] => {
    let result = workOrders;
    if (filters?.status) {
      result = result.filter((wo) => wo.status === filters.status);
    }
    if (filters?.assignee) {
      result = result.filter((wo) => wo.assignee === filters.assignee);
    }
    return result;
  },

  findById: (id: string): WorkOrder | undefined => {
    return workOrders.find((wo) => wo.id === id);
  },

  save: (workOrder: WorkOrder): WorkOrder => {
    workOrders.push(workOrder);
    return workOrder;
  },

  update: (id: string, updates: Partial<WorkOrder>): WorkOrder | null => {
    const index = workOrders.findIndex((wo) => wo.id === id);
    if (index === -1) return null;

    workOrders[index] = { ...workOrders[index], ...updates };
    return workOrders[index];
  },

  delete: (id: string): boolean => {
    const index = workOrders.findIndex((wo) => wo.id === id);
    if (index === -1) return false;

    workOrders.splice(index, 1);
    return true;
  },
};