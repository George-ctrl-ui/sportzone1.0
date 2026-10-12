export const imageSrc = (name: string) => `/images/${name}-1200.webp`;
export const imageSet = (name: string) =>
  [640, 1200, 1600].map((width) => `/images/${name}-${width}.webp ${width}w`).join(', ');

// Only replace the original stock URLs; custom catalogue photos stay intact.
const stockPhotos: Record<string, string> = {
  'photo-1546519638-68e109498ffc': 'basketball-hero',
  'photo-1626224583764-f87db24ac4ea': 'badminton-action',
  'photo-1612872087720-bb876e2e67d1': 'volleyball-action',
  'photo-1737476996922-828e3975f631': 'pickleball-equipment',
};
export function localPhoto(url: string) {
  try {
    const source = new URL(url);
    return source.hostname === 'images.unsplash.com'
      ? stockPhotos[source.pathname.slice(1)]
      : undefined;
  } catch {
    return undefined;
  }
}

export const galleryPhotos = [
  {
    name: 'basketball-park',
    label: 'Basketball',
    alt: 'Outdoor basketball hoop in a tree-lined park',
  },
  {
    name: 'badminton-equipment',
    label: 'Badminton',
    alt: 'Shuttlecock resting on a badminton racket',
  },
  {
    name: 'volleyball-evening',
    label: 'Volleyball',
    alt: 'Friends playing outdoor volleyball in the evening',
  },
];
