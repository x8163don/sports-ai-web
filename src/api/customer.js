import {apiRequest} from "./base.js";

export const me = async () => {
    try {
        return await apiRequest('/customer/me', 'GET', null);
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }
};