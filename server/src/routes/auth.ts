import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { requireAuth, AuthenticatedRequest } from '../middleware/requireAuth';

const router = Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    username: req.user?.sub,
    role: req.user?.role,
  });
});

export default router;