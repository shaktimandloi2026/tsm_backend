import path from 'path';
import os from 'os';
import { env } from './env';

export function getUploadDir(): string {
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), 'tsm-uploads');
  }
  return path.resolve(env.uploadDir);
}
