import { z } from 'zod';
export const APP_CONFIG = Symbol('APP_CONFIG');
const environmentSchema = z.object({
  DATABASE_URL: z
    .url()
    .refine((value) => ['postgres:', 'postgresql:'].includes(new URL(value).protocol)),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});
export interface AppConfig {
  databaseUrl: string;
  port: number;
}
export function readConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const result = environmentSchema.safeParse(env);
  if (!result.success) {
    const fields = [...new Set(result.error.issues.map((issue) => issue.path.join('.')))];
    throw new Error(`Invalid environment configuration: ${fields.join(', ')}`);
  }
  return { databaseUrl: result.data.DATABASE_URL, port: result.data.PORT };
}
