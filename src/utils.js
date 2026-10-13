const API_URL = import.meta.env.VITE_API_URL || '';
const BACKEND_URL = 'https://ready2cop-server.onrender.com';

export async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', 'ready2cops');
  const res = await fetch('https://api.cloudinary.com/v1_1/opoeuipv/image/upload', {
    method: 'POST',
    body: fd,
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.secure_url;
}

export function getImageUrl(image) {
  if (!image) return '/Chaussures-22.jpeg';
  if (image.startsWith('http')) return image;
  if (image === 'Chaussures-22.jpeg') return '/Chaussures-22.jpeg';
  if (API_URL) return `${API_URL}/uploads/${image}`;
  return `${BACKEND_URL}/uploads/${image}`;
}
