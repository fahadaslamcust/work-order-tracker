import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Work Order Route Endpoints', () => {
  let adminToken: string;
  let techToken: string;

  beforeAll(async () => {
    // Obtain valid tokens for admin and tech users
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'Passw0rd!' });
    adminToken = adminRes.body.token;

    const techRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'tech1', password: 'Passw0rd!' });
    techToken = techRes.body.token;
  });

  // Test 11: Validation error shape on POST with title < 3 chars
  it('returns 400 and formatted error shape when title is too short', async () => {
    const res = await request(app)
      .post('/api/work-orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'AB', // invalid short title
        description: 'Test description',
        status: 'open',
        priority: 'low',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  // Test 12: DELETE as tech1 gives 403
  it('rejects DELETE requests from tech1 with 403 Forbidden', async () => {
    // First fetch a valid ID
    const listRes = await request(app)
      .get('/api/work-orders')
      .set('Authorization', `Bearer ${techToken}`);
    const id = listRes.body[0].id;

    const deleteRes = await request(app)
      .delete(`/api/work-orders/${id}`)
      .set('Authorization', `Bearer ${techToken}`);

    expect(deleteRes.status).toBe(403);
  });

  // Test 13: DELETE as admin gives 204, followed by GET returning 404
  it('allows admin to delete work order returning 204, and 404 on subsequent GET', async () => {
    // Create a temporary order to safely delete
    const newRes = await request(app)
      .post('/api/work-orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Delete Me Order',
        description: 'Temporary item',
        status: 'open',
        priority: 'medium',
      });
    const targetId = newRes.body.id;

    // Delete as admin
    const delRes = await request(app)
      .delete(`/api/work-orders/${targetId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(delRes.status).toBe(204);

    // Verify GET now returns 404
    const getRes = await request(app)
      .get(`/api/work-orders/${targetId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(getRes.status).toBe(404);
  });
});