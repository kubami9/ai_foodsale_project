import { URL } from 'node:url';
import { cpSync } from 'node:fs';
cpSync(
  new URL('../src/database/migrations/', import.meta.url),
  new URL('../dist/database/migrations/', import.meta.url),
  { recursive: true },
);
