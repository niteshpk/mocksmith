import type { Request, Response } from 'express';
import { db } from '../db/sqlite';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

function getDbStatus() {
  try {
    // PRAGMA quick_check returns a row like: { quick_check: 'ok' }
    const row = db.prepare('PRAGMA quick_check').get() as { quick_check?: string } | undefined;
    const quickCheck = row?.quick_check ?? 'unknown';
    const ok = quickCheck.toLowerCase() === 'ok';
    return { ok, quickCheck };
  } catch (e: any) {
    return { ok: false, quickCheck: String(e?.message ?? e) };
  }
}

export const HealthController = {
  status: (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: pkg?.version ?? 'unknown',
      db: getDbStatus(),
    });
  },
};
