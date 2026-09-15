import { describe, expect, it } from 'vitest';
import { normalizeLocale, nextStep, contactHref } from './portfolio-state';
describe('portfolio behavior', () => {
  it('uses Spanish for missing or unsupported stored language', () => {
    expect(normalizeLocale(null)).toBe('es');
    expect(normalizeLocale('fr')).toBe('es');
    expect(normalizeLocale('en')).toBe('en');
  });
  it('runs interface, service, data, response and stops', () => {
    let state = 0;
    const visited = [state];
    for (let i = 0; i < 6; i++) {
      state = nextStep(state);
      visited.push(state);
    }
    expect(visited).toEqual([0, 1, 2, 3, 4, 4, 4]);
  });
  it('preserves contact recipient and encodes the selected bilingual intent', () => {
    expect(contactHref('en', 'opportunity')).toBe(
      'mailto:yeinsmancera@gmail.com?subject=Let%E2%80%99s%20discuss%20an%20opportunity',
    );
    expect(decodeURIComponent(contactHref('es', 'project'))).toContain(
      'Hablemos de un proyecto',
    );
  });
});
