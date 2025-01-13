import {apiRequest} from "./base.js";

export const login = async ({email, thirdPartyToken, loginType}) => {
    try {
        return await apiRequest('/login', 'POST', {
            email: email,
            third_party_token: thirdPartyToken,
            login_type: loginType,
        }, {'Language': 'en'});
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }
};

export const check = async () => {
    try {
        return await apiRequest('/check', 'GET', null, {});
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }
}