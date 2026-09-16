import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { requireAuth, AuthenticatedRequest } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { config } from '../config';

describe('Auth Middlewares', () => {
  // Test 6: Missing Authorization header gives 401
  it('returns 401 when Authorization header is missing', () => {
    const req = { headers: {} } as AuthenticatedRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: 'UNAUTHORIZED', message: 'Missing or malformed token' },
    });
  });

  // Test 7: Token signed with wrong secret gives 401
  it('returns 401 when token is signed with an invalid secret', () => {
    const invalidToken = jwt.sign({ sub: 'admin', role: 'admin' }, 'wrong-secret');
    const req = {
      headers: { authorization: `Bearer ${invalidToken}` },
    } as AuthenticatedRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  // Test 8: Expired token gives 401
  it('returns 401 when token is expired', () => {
    const expiredToken = jwt.sign(
      { sub: 'admin', role: 'admin' },
      config.jwtSecret,
      { expiresIn: '-1s' }
    );
    const req = {
      headers: { authorization: `Bearer ${expiredToken}` },
    } as AuthenticatedRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  // Test 9: Valid token sets user on request object
  it('attaches payload user object to request on valid token', () => {
    const validToken = jwt.sign(
      { sub: 'tech1', role: 'tech' },
      config.jwtSecret
    );
    const req = {
      headers: { authorization: `Bearer ${validToken}` },
    } as AuthenticatedRequest;
    const res = {} as any;
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(req.user?.sub).toBe('tech1');
    expect(req.user?.role).toBe('tech');
    expect(next).toHaveBeenCalled();
  });

  // Test 10: requireRole('admin') rejects 'tech' role with 403
  it('rejects tech role with 403 when admin role is required', () => {
    const req = { user: { sub: 'tech1', role: 'tech' } } as AuthenticatedRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;
    const next = vi.fn();

    const middleware = requireRole('admin');
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
    });
  });
});