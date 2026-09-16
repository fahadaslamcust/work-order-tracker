import { z } from 'zod';

// Schema for GET /api/work-orders query parameters
export const workOrderQuerySchema = z.object({
  status: z.enum(['open', 'in_progress', 'blocked', 'closed']).optional(),
  assignee: z.string().optional(),
});

// Schema for POST /api/work-orders payload
export const createWorkOrderSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).default(''),
  status: z.enum(['open', 'in_progress', 'blocked', 'closed']),
  priority: z.enum(['low', 'medium', 'high']),
  assignee: z.string().nullable().default(null),
});

// Schema for PATCH /api/work-orders/:id payload
export const updateWorkOrderSchema = z.object({
  status: z.enum(['open', 'in_progress', 'blocked', 'closed']),
});