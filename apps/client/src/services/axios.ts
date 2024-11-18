import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_SERVER_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});

export const getLiveList = async (field?: string) => {
  const response = await axiosInstance.get('/v1/broadcasts', {
    params: {
      field: field,
    },
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
