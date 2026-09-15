export type Locale = 'es' | 'en';
export function normalizeLocale(value: string | null): Locale {
  return value === 'en' ? 'en' : 'es';
}
export function nextStep(step: number): number {
  return Math.min(4, step + 1);
}
export function contactHref(
  locale: Locale,
  intent: 'project' | 'opportunity',
): string {
  const subjects = {
    es: {
      project: 'Hablemos de un proyecto',
      opportunity: 'Hablemos de una oportunidad',
    },
    en: {
      project: 'Let’s discuss a project',
      opportunity: 'Let’s discuss an opportunity',
    },
  };
  return `mailto:yeinsmancera@gmail.com?subject=${encodeURIComponent(subjects[locale][intent])}`;
}
