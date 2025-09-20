import request from 'supertest';
import { beforeEach, describe, it, expect } from 'vitest';

import { resetAndSeed } from './helpers';
import { createApp } from '../src/app';

const app = createApp();

beforeEach(() => resetAndSeed());

describe('Posts API', () => {
  it('GET /api/posts -> list', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('GET /api/posts/:id -> 200 / 404', async () => {
    const ok = await request(app).get('/api/posts/1');
    expect(ok.status).toBe(200);
    const miss = await request(app).get('/api/posts/999');
    expect(miss.status).toBe(404);
  });

  it('POST /api/posts -> create (201) and reject invalid userId (400)', async () => {
    const good = await request(app).post('/api/posts').send({
      userId: 1,
      title: 'New Post',
      body: 'Some content',
    });
    expect(good.status).toBe(201);
    expect(good.body).toMatchObject({ userId: 1, title: 'New Post' });

    const bad = await request(app).post('/api/posts').send({
      userId: 999,
      title: 'Invalid',
      body: 'no user',
    });
    expect(bad.status).toBe(400);
  });

  it('PUT /api/posts/:id -> update ok; invalid userId -> 400; missing id -> 404', async () => {
    const up = await request(app).put('/api/posts/1').send({ title: 'Retitled' });
    expect(up.status).toBe(200);
    expect(up.body.title).toBe('Retitled');

    const badUser = await request(app).put('/api/posts/1').send({ userId: 999 });
    expect(badUser.status).toBe(400);

    const miss = await request(app).put('/api/posts/999').send({ title: 'nope' });
    expect(miss.status).toBe(404);
  });

  it('DELETE /api/posts/:id -> 204 then 404', async () => {
    const d = await request(app).delete('/api/posts/2');
    expect(d.status).toBe(204);

    const again = await request(app).delete('/api/posts/2');
    expect(again.status).toBe(404);
  });
});
