var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/services/api.ts
const BASE_URL = 'http://localhost:5000/api/v1';
export function apiRequest(_a) {
    return __awaiter(this, arguments, void 0, function* ({ endpoint, method = 'GET', data, token, }) {
        const config = {
            method,
            headers: Object.assign({ 'Content-Type': 'application/json' }, (token ? { Authorization: `Bearer ${token}` } : {})),
            credentials: 'include', // for cookies
        };
        if (data) {
            config.body = JSON.stringify(data);
        }
        const response = yield fetch(`${BASE_URL}/${endpoint}`, config);
        if (!response.ok) {
            const errorData = yield response.json().catch(() => ({}));
            throw new Error(errorData.message || 'API request failed');
        }
        return response.json();
    });
}
