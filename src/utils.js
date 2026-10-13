const API_URL = import.meta.env.VITE_API_URL || '';
const BACKEND_URL = 'https://ready2cop-server.onrender.com';

export function getImageUrl(image) {
  if (!image) return '/Chaussures-22.jpeg';
  if (image.startsWith('http')) return image;
  if (image === 'Chaussures-22.jpeg') return '/Chaussures-22.jpeg';
  if (API_URL) return `${API_URL}/uploads/${image}`;
  return `${BACKEND_URL}/uploads/${image}`;
}
