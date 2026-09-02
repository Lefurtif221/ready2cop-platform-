const API_URL = import.meta.env.VITE_API_URL || '';

export function getImageUrl(image) {
  if (!image) return '/Chaussures-22.jpeg';
  if (image.startsWith('http')) return image;
  if (image === 'Chaussures-22.jpeg') return '/Chaussures-22.jpeg';
  return `${API_URL}/uploads/${image}`;
}
