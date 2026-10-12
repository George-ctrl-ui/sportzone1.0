export const pages = {
  '/': 'Home',
  '/court': 'Court',
  '/gallery': 'Gallery',
  '/booking': 'Book',
} as const;

const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
if (pathname === '/about') window.location.replace('/#about');
export const currentPath = ['/index.html', '/about'].includes(pathname) ? '/' : pathname;
export const pageTitle = pages[currentPath as keyof typeof pages] ?? 'Not found';
