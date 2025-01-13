import {apiRequest} from "./base.js";

export const listKnowledgeBases = async () => {
    try {
        return await apiRequest('/knowledge-base/list', 'GET', null);
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }
}

export const getKnowledgeBase = async (id) => {
    try {
        return await apiRequest('/knowledge-base/' + id, 'GET', null);
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }
}

export const createKnowledgeBase = async ({name, description}) => {
    try {
        return await apiRequest(`/knowledge-base/create`, 'POST', {
            name,
            description
        });
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }
}

export const listFiles = async ({knowledgeBaseID, cursor = 0}) => {
    try {
        return await apiRequest(`/knowledge-base/${knowledgeBaseID}/files/${cursor}`, 'GET', null)
    } catch (e) {
        console.error('Failed to fetch chat response:', e);
        throw e
    }
}

export const getUploadURL = async ({knowledgeBaseID, fileName, contentType}) => {
    try {
        return await apiRequest('/knowledge-base/pre-signed-url', 'POST', {
            knowledge_base_id: knowledgeBaseID,
            file_name: fileName,
            content_type: contentType
        });
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }
};

export const getReadURL = async ({ownerID, knowledgeBaseID, fileName}) => {
    try {
        return await apiRequest('/knowledge-base/read-pre-signed-url', 'POST', {
            owner_id: ownerID,
            knowledge_base_id: knowledgeBaseID,
            name: fileName,
        });
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }
};

export const deleteFile = async ({knowledgeBaseID, fileID}) => {
    try {
        return await apiRequest('/knowledge-base/single-file', 'DELETE', {
            knowledge_base_id: knowledgeBaseID,
            file_id: fileID
        });
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }
};

export const deleteKnowledgeBase = async (id) => {
    try {
        return await apiRequest('/knowledge-base/all', 'DELETE', {
            knowledge_base_id: id
        });
    } catch (error) {
        console.error('Failed to fetch chat response:', error);
        throw error;
    }

}

