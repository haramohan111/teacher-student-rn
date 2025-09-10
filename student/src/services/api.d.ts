// Option 1: Create a declaration file
// src/services/api.d.ts
import { AxiosInstance } from 'axios';

declare const api: AxiosInstance;
export default api;
