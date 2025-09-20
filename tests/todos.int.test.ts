import request from 'supertest';
import { createApp } from '../src/app';
import { resetAndSeed } from './helpers';
import { beforeEach, describe, it, expect } from 'vitest';

const app = createApp();

beforeEach(() => resetAndSeed());

describe('Todos API', () => {
  it('GET /api/todos -> list', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    // ensure boolean comes through properly
    expect(typeof res.body[0].completed).toBe('boolean');
  });

  it('GET /api/todos/:id -> 200 / 404', async () => {
    const ok = await request(app).get('/api/todos/1');
    expect(ok.status).toBe(200);
    const miss = await request(app).get('/api/todos/999');
    expect(miss.status).toBe(404);
  });

  it('POST /api/todos -> create (default completed=false) and invalid userId=400', async () => {
    const good = await request(app).post('/api/todos').send({
      userId: 1,
      title: 'New Task',
      // completed omitted -> should default to false
    });
    expect(good.status).toBe(201);
    expect(good.body).toMatchObject({ userId: 1, title: 'New Task', completed: false });

    const bad = await request(app).post('/api/todos').send({
      userId: 999,
      title: 'Invalid',
    });
    expect(bad.status).toBe(400);
  });

  it('PUT /api/todos/:id -> mark complete; invalid userId -> 400; missing id -> 404', async () => {
    const up = await request(app).put('/api/todos/1').send({ completed: true });
    expect(up.status).toBe(200);
    expect(up.body.completed).toBe(true);

    const badUser = await request(app).put('/api/todos/1').send({ userId: 999 });
    expect(badUser.status).toBe(400);

    const miss = await request(app).put('/api/todos/999').send({ title: 'nope' });
    expect(miss.status).toBe(404);
  });

  it('DELETE /api/todos/:id -> 204 then 404', async () => {
    const d = await request(app).delete('/api/todos/1');
    expect(d.status).toBe(204);

    const again = await request(app).delete('/api/todos/1');
    expect(again.status).toBe(404);
  });
});
