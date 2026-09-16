import { describe, it, expect, beforeEach } from 'vitest';
import { workOrderService } from '../services/workOrderService';

describe('workOrderService', () => {
  // Test 1: Service assigns id, createdAt, and updatedAt on creation
  it('assigns an id, createdAt, and updatedAt when creating a work order', () => {
    const newOrder = workOrderService.createWorkOrder({
      title: 'Fix AC Unit',
      description: 'AC is leaking water',
      status: 'open',
      priority: 'high',
      assignee: 'tech1',
    });

    expect(newOrder.id).toBeDefined();
    expect(newOrder.createdAt).toBeDefined();
    expect(newOrder.updatedAt).toBeDefined();
    expect(newOrder.title).toBe('Fix AC Unit');
  });

  // Test 2: Updates update updatedAt while preserving createdAt
  it('updates updatedAt while leaving createdAt unmodified', async () => {
    const created = workOrderService.createWorkOrder({
      title: 'Check Generator',
      description: 'Routine maintenance',
      status: 'open',
      priority: 'medium',
      assignee: null,
    });

    // Small delay to ensure timestamp progression
    await new Promise((r) => setTimeout(r, 10));

    const updated = workOrderService.updateWorkOrder(created.id, {
      status: 'in_progress',
    });

    expect(updated.createdAt).toBe(created.createdAt);
    expect(updated.updatedAt).not.toBe(created.createdAt);
    expect(updated.status).toBe('in_progress');
  });

  // Test 3: Updating a non-existent ID throws a NOT_FOUND error
  it('raises a NOT_FOUND error when updating a missing id', () => {
    expect(() => {
      workOrderService.updateWorkOrder('non-existent-id', { title: 'New Title' });
    }).toThrow('Work order not found');
  });

  // Test 4: Business Rule: Cannot move closed work order back to open
  it('rejects a status change from closed to open', () => {
    const created = workOrderService.createWorkOrder({
      title: 'Closed Task',
      description: 'Already completed task',
      status: 'closed',
      priority: 'low',
      assignee: 'tech1',
    });

    expect(() => {
      workOrderService.updateWorkOrder(created.id, { status: 'open' });
    }).toThrow('Cannot reopen a closed work order');
  });

  // Test 5: Filter by status returns matching items
  it('filters work orders by status accurately', () => {
    const openOrders = workOrderService.getAllWorkOrders({ status: 'open' });
    expect(openOrders.every((wo) => wo.status === 'open')).toBe(true);
  });
});