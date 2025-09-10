// src/services/api.ts
const BASE_URL = 'http://localhost:5000/api/v1';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiRequestOptions<T> {
  endpoint: string;
  method?: HttpMethod;
  data?: T;
  token?: string | null;
}

export async function apiRequest<T = any, R = any>({
  endpoint,
  method = 'GET',
  data,
  token,
}: ApiRequestOptions<T>): Promise<R> {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include', // for cookies
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}/${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error((errorData as any).message || 'API request failed');
  }

  return response.json() as Promise<R>;
}
