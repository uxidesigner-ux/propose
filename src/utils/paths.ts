export const withBase = (path: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.replace(/^\/+/, '');
  if (!cleanPath) return base;
  return `${base}${cleanPath}`;
};
