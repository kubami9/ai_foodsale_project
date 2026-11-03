import { describe, expect, it } from 'vitest';
import { assertDemoDatabase } from './seed.js';
describe('demo data guard', () => {
  it('rejects a seed without explicit permission', () => {
    expect(() => assertDemoDatabase('postgresql://localhost/foodsale_dev', false)).toThrow(
      'ALLOW_DEMO_SEED=true',
    );
  });
  it('rejects seeding a production database even with the flag', () => {
    expect(() => assertDemoDatabase('postgresql://localhost/foodsale', true)).toThrow(
      'ending in _dev or _test',
    );
  });
  it('allows the isolated demo database', () => {
    expect(() => assertDemoDatabase('postgresql://localhost/foodsale_test', true)).not.toThrow();
  });
});
