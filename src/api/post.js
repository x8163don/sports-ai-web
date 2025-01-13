import {apiRequest, streamRequest} from "./base.js";

export const listPosts = async () => {
    try {
        return await apiRequest('/post/list', 'GET', null);
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }
}

export const getPost = async (id) => {
    try {
        return await apiRequest(`/post/${id}`, 'GET', null);
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }
}

export const createPost = async () => {
    try {
        return await apiRequest('/post/create', 'POST', {});
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }
};

export const deletePost = async (id) => {
    try {
        return await apiRequest('/post/delete', 'DELETE', {
            post_id: id
        });
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }
}

export const useKnowledgeBase = async ({postID, knowledgeBaseID}) => {
    try {
        return await apiRequest('/post/use-knowledge-base', 'POST', {
            post_id: postID,
            knowledge_base_id: knowledgeBaseID
        });
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }
}

export const addConversation = async ({ postID, message, onReceiveEvent, timeout = 30000 }) => {
    try {
        const reader = await streamRequest('/post/add-conversation', 'POST', { "post_id": postID, message });

        let accumulatedData = '';

        const timeoutPromise = new Promise((_, reject) => {
            const timer = setTimeout(() => {
                reject(new Error('Request timed out'));
            }, timeout);
            return () => clearTimeout(timer);
        });

        const finalResult = await Promise.race([
            (async () => {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }

                    accumulatedData += new TextDecoder().decode(value);

                    const events = accumulatedData.split('\n\n');
                    for (let i = 0; i < events.length - 1; i++) {
                        const event = events[i];
                        if (!event.startsWith('event:message')) {
                            continue;
                        }
                        const dataLines = event.replace("event:message\n", '')
                            .split("data:");
                        onReceiveEvent(dataLines.join(''));
                    }

                    accumulatedData = events[events.length - 1] || '';
                }

                if (accumulatedData) {
                    try {
                        // Parse the last chunk of data as JSON
                        return JSON.parse(accumulatedData.trim());
                    } catch (e) {
                        console.error('Failed to parse final JSON:', e);
                        throw new Error('Invalid JSON format in the final response');
                    }
                }
            })(),
            timeoutPromise,
        ]);

        return finalResult;
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }
};



