import request from 'supertest';
import { beforeEach, describe, it, expect } from 'vitest';

import { resetAndSeed } from './helpers';
import { createApp } from '../src/app';

const app = createApp();

beforeEach(() => resetAndSeed());

describe('Pagination & filters', () => {
  it('users: _page/_limit and X-Total-Count', async () => {
    const res = await request(app).get('/api/users?_page=1&_limit=1');
    expect(res.status).toBe(200);
    expect(res.headers['x-total-count']).toBeDefined();
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(Number(res.headers['x-total-count'])).toBe(2);
  });

  it('posts: filter by userId with pagination', async () => {
    const res = await request(app).get('/api/posts?userId=1&_page=1&_limit=1');
    expect(res.status).toBe(200);
    expect(Number(res.headers['x-total-count'])).toBe(1); // helper seeds 1 post for userId=1
    expect(res.body.length).toBe(1);
    expect(res.body[0].userId).toBe(1);
  });

  it('comments: filter by postId with pagination', async () => {
    const res = await request(app).get('/api/comments?postId=1&_page=1&_limit=1');
    expect(res.status).toBe(200);
    expect(Number(res.headers['x-total-count'])).toBeGreaterThanOrEqual(1);
    expect(res.body.length).toBe(1);
    expect(res.body[0].postId).toBe(1);
  });

  it('todos: filter by userId with pagination', async () => {
    const res = await request(app).get('/api/todos?userId=1&_page=1&_limit=1');
    expect(res.status).toBe(200);
    expect(Number(res.headers['x-total-count'])).toBeGreaterThanOrEqual(1);
    expect(res.body.length).toBe(1);
    expect(res.body[0].userId).toBe(1);
  });
});
