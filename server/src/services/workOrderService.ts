import crypto from 'crypto';
import { workOrderRepository } from '../repositories/workOrderRepository';
import { WorkOrder } from '../domain/workOrder';

export const workOrderService = {
  getAllWorkOrders: (filters?: { status?: string; assignee?: string }) => {
    return workOrderRepository.findAll(filters);
  },

  getWorkOrderById: (id: string) => {
    const workOrder = workOrderRepository.findById(id);
    if (!workOrder) {
      const error = new Error('Work order not found');
      (error as any).code = 'NOT_FOUND';
      throw error;
    }
    return workOrder;
  },

  createWorkOrder: (
    data: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>
  ): WorkOrder => {
    const now = new Date().toISOString();
    const newWorkOrder: WorkOrder = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    return workOrderRepository.save(newWorkOrder);
  },

  updateWorkOrder: (id: string, updates: Partial<WorkOrder>): WorkOrder => {
    const existing = workOrderRepository.findById(id);
    if (!existing) {
      const error = new Error('Work order not found');
      (error as any).code = 'NOT_FOUND';
      throw error;
    }

    // Business Rule: A closed work order cannot move back to open
    if (existing.status === 'closed' && updates.status === 'open') {
      const error = new Error('Cannot reopen a closed work order');
      (error as any).code = 'INVALID_STATUS_TRANSITION';
      throw error;
    }

    const updatedData: Partial<WorkOrder> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedWorkOrder = workOrderRepository.update(id, updatedData);
    if (!updatedWorkOrder) {
      const error = new Error('Work order not found');
      (error as any).code = 'NOT_FOUND';
      throw error;
    }

    return updatedWorkOrder;
  },

  deleteWorkOrder: (id: string): void => {
    const existing = workOrderRepository.findById(id);
    if (!existing) {
      const error = new Error('Work order not found');
      (error as any).code = 'NOT_FOUND';
      throw error;
    }

    workOrderRepository.delete(id);
  },
};