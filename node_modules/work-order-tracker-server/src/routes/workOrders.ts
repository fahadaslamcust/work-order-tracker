import { Router, Request, Response, NextFunction } from 'express';
import { workOrderService } from '../services/workOrderService';
import { createWorkOrderSchema, updateWorkOrderSchema, workOrderQuerySchema } from '../domain/schemas';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
const router = Router();
router.use(requireAuth);
// GET /api/work-orders
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = workOrderQuerySchema.parse(req.query);
    const workOrders = workOrderService.getAllWorkOrders(filters);
    res.status(200).json(workOrders);
  } catch (error) {
    next(error);
  }
});

// GET /api/work-orders/:id
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const workOrder = workOrderService.getWorkOrderById(req.params.id);
    res.status(200).json(workOrder);
  } catch (error) {
    next(error);
  }
});

// POST /api/work-orders
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createWorkOrderSchema.parse(req.body);
    const newWorkOrder = workOrderService.createWorkOrder(validatedData);
    res.status(201).json(newWorkOrder);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/work-orders/:id
router.patch('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateWorkOrderSchema.parse(req.body);
    const updatedWorkOrder = workOrderService.updateWorkOrder(req.params.id, validatedData);
    res.status(200).json(updatedWorkOrder);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/work-orders/:id
router.delete('/:id',requireRole('admin'), (req: Request, res: Response, next: NextFunction) => {
  try {
    workOrderService.deleteWorkOrder(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;