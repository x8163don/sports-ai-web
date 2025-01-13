import Cookies from "js-cookie";
import {QueryClient} from "@tanstack/react-query";

const CacheKey = {
    Posts: 'posts',
    Post: 'post',
    KnowledgeBases: 'knowledge-bases',
    KnowledgeBase: 'knowledge-base',
}

export const CacheKeyFn = {
    Posts: () => [CacheKey.Posts],
    Post: (id) => [CacheKey.Post, id],
    KnowledgeBase: (kid) => [CacheKey.KnowledgeBase, kid],
    KnowledgeBaseFiles: (kid) => [CacheKey.KnowledgeBase, kid, 'files'],
    KnowledgeBases: () => [CacheKey.KnowledgeBases],
}

export const queryClient = new QueryClient()

export const apiRequest = async (url, method = 'GET', body = null, customHeaders = {}) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `${Cookies.get('token')}`,
    };

    const headers = {...defaultHeaders, ...customHeaders};

    const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
        return
    }

    return response.json();
};
export const streamRequest = async (url, method = 'GET', body = null, customHeaders = {}) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `${Cookies.get('token')}`,
    };

    const headers = {...defaultHeaders, ...customHeaders};

    const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    return response.body.getReader()
};