var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/api.ts
import axios from "axios";
import { getAuth } from "firebase/auth";
const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});
// Add request interceptor to inject Firebase ID token
api.interceptors.request.use((config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const auth = getAuth();
    const token = yield ((_a = auth.currentUser) === null || _a === void 0 ? void 0 : _a.getIdToken());
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}));
export default api;
