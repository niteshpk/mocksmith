import request from 'supertest';
import { createApp } from '../src/app';
import { resetAndSeed } from './helpers';
import { beforeEach, describe, it, expect } from 'vitest';

const app = createApp();

beforeEach(() => resetAndSeed());

describe('Misc endpoints', () => {
  it('GET /health -> ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /docs.json -> OpenAPI spec', async () => {
    const res = await request(app).get('/docs.json');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('openapi');
    expect(res.body).toHaveProperty('info.title');
  });

  it('GET /metrics -> prometheus text', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    const ct = res.headers['content-type'] || '';
    expect(ct.includes('text/plain') || ct.includes('application/openmetrics-text')).toBe(true);
  });
});
