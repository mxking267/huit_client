import { toast } from 'react-toastify';
import { getAccessToken } from '../utils/getAccessToken';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAccessToken();

  if (!token) {
    toast.error('Token not found');
    return null;
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAccessToken()}`,
    ...options.headers,
  };

  const response = await fetch(`${apiUrl}/${url}`, { ...options, headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  return response.json();
};

export default fetchWithAuth;
