import request from 'supertest';
import { createApp } from '../src/app';
import { resetAndSeed } from './helpers';

const app = createApp();

beforeEach(() => resetAndSeed());

describe('Comments API', () => {
  it('GET /api/comments -> list', async () => {
    const res = await request(app).get('/api/comments');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/comments/:id -> 200 / 404', async () => {
    const ok = await request(app).get('/api/comments/1');
    expect(ok.status).toBe(200);
    const miss = await request(app).get('/api/comments/999');
    expect(miss.status).toBe(404);
  });

  it('POST /api/comments -> create (201) and reject invalid postId (400)', async () => {
    const good = await request(app).post('/api/comments').send({
      postId: 1,
      name: 'New Commenter',
      email: 'nc@example.com',
      body: 'Great!',
    });
    expect(good.status).toBe(201);
    expect(good.body).toMatchObject({ postId: 1, name: 'New Commenter' });

    const bad = await request(app).post('/api/comments').send({
      postId: 999,
      name: 'X',
      email: 'x@example.com',
      body: 'no post',
    });
    expect(bad.status).toBe(400);
  });

  it('PUT /api/comments/:id -> update ok; invalid postId -> 400; missing id -> 404', async () => {
    const up = await request(app).put('/api/comments/1').send({ body: 'Edited' });
    expect(up.status).toBe(200);
    expect(up.body.body).toBe('Edited');

    const badPost = await request(app).put('/api/comments/1').send({ postId: 999 });
    expect(badPost.status).toBe(400);

    const miss = await request(app).put('/api/comments/999').send({ body: 'nope' });
    expect(miss.status).toBe(404);
  });

  it('DELETE /api/comments/:id -> 204 then 404', async () => {
    const d = await request(app).delete('/api/comments/1');
    expect(d.status).toBe(204);

    const again = await request(app).delete('/api/comments/1');
    expect(again.status).toBe(404);
  });
});
