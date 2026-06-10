export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function ensureUniqueSlug(slug: string, existing: string[]): string {
  const taken = new Set(existing);
  if (!taken.has(slug)) return slug;

  let counter = 2;
  let candidate = `${slug}-${counter}`;
  while (taken.has(candidate)) {
    counter++;
    candidate = `${slug}-${counter}`;
  }
  return candidate;
}
