import request from 'supertest';
import { beforeEach, describe, it, expect } from 'vitest';

import { resetAndSeed } from './helpers';
import { createApp } from '../src/app';

const app = createApp();

beforeEach(() => resetAndSeed());

describe('Users API', () => {
  it('GET /api/users -> list', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it('GET /api/users/:id -> one (200) and not found (404)', async () => {
    const ok = await request(app).get('/api/users/1');
    expect(ok.status).toBe(200);
    expect(ok.body).toMatchObject({ id: 1, username: 'alpha' });

    const miss = await request(app).get('/api/users/999');
    expect(miss.status).toBe(404);
  });

  it('POST /api/users -> create (201) and validation (400)', async () => {
    const created = await request(app).post('/api/users').send({
      name: 'Gamma',
      username: 'gamma',
      email: 'gamma@example.com',
    });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ name: 'Gamma', username: 'gamma' });

    const bad = await request(app).post('/api/users').send({
      name: 'No Email',
      username: 'noemail',
      email: 'not-an-email',
    });
    expect(bad.status).toBe(400);
  });

  it('PUT /api/users/:id -> update (200) and 404 on missing', async () => {
    const updated = await request(app).put('/api/users/1').send({ name: 'Alpha Renamed' });
    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe('Alpha Renamed');

    const miss = await request(app).put('/api/users/999').send({ name: 'nope' });
    expect(miss.status).toBe(404);
  });

  it('DELETE /api/users/:id -> 204 then 404 if repeated', async () => {
    const del = await request(app).delete('/api/users/2');
    expect(del.status).toBe(204);

    const again = await request(app).delete('/api/users/2');
    expect(again.status).toBe(404);
  });
});
