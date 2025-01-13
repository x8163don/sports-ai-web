import {useParams} from "react-router-dom";
import {addConversation, getPost, useKnowledgeBase} from "../api/post.js";
import ChatWindow from '../components/ChatWindow.jsx';
import ChatInput from '../components/ChatInput';
import {getReadURL, listKnowledgeBases} from "../api/knowledge-base.js";
import {Select} from "react-daisyui";
import {useMutation, useQuery} from "@tanstack/react-query";
import {CacheKeyFn, queryClient} from "../api/base.js";
import mammoth from "mammoth";

export default function ChatPage() {
    const {id: rawID} = useParams()
    const id = Number(rawID) || 0

    const {
        data: {knowledge_bases: knowledgeBases},
        isLoading: isLoadingKnowledgeBases,
    } = useQuery({
        queryKey: CacheKeyFn.KnowledgeBases(),
        queryFn: listKnowledgeBases,
        initialData: [],
    })

    const {
        data: post,
        isLoading: isLoadingPost,
    } = useQuery({
        queryKey: CacheKeyFn.Post(id),
        queryFn: () => getPost(id),
        cacheTime: 30 * 60 * 1000,
        staleTime: 30 * 60 * 1000
    })

    const {
        mutate: changeKnowledgeBaseMutate,
    } = useMutation({
        mutationFn: useKnowledgeBase,
        onSuccess: (data) => {
            queryClient.setQueryData(CacheKeyFn.Post(id), (old) => {
                if (!old) {
                    return old
                }
                return {
                    ...old,
                    knowledge_base_id: data.knowledge_base_id
                }
            })
        }
    })

    if (isLoadingKnowledgeBases || isLoadingPost) {
        return <div>Loading</div>
    }

    const handleSendMessage = async (message) => {
        await queryClient.setQueryData(CacheKeyFn.Post(id), (old) => {
            if (!old) {
                return old
            }
            return {
                ...old,
                messages: [...old.messages, {speaker: 'Customer', text: message}, {speaker: 'AI', text: ''}]
            }
        })

        try {
            const resp = await addConversation({
                postID: post.id || Number(id),
                message,
                onReceiveEvent: handleReceiveMessage
            })

            queryClient.setQueryData(CacheKeyFn.Post(id), (old) => {
                if (!old) {
                    return old
                }
                const lastMessage = old.messages[old.messages.length - 1];

                return {
                    ...old,
                    messages: [...old.messages.slice(0, -1), {
                        speaker: 'AI',
                        text: lastMessage.text,
                        refFiles: resp.ref_files || []
                    }]
                }
            })


        } catch (e) {
            console.error('Failed to fetch chat response:', e);
        }
    };

    const handleReceiveMessage = (message) => {
        queryClient.setQueryData(CacheKeyFn.Post(Number(id)),
            prev => {
                const lastMessage = prev.messages[prev.messages.length - 1];
                if (lastMessage.speaker === 'AI') {
                    return {
                        ...prev,
                        messages: [...prev.messages.slice(0, -1), {
                            speaker: 'AI',
                            text: lastMessage.text + message,
                            refFiles: lastMessage.refFiles || []
                        }]
                    }
                }
                return {
                    ...prev,
                    messages: [...prev.messages, {speaker: 'AI', text: message, refFiles: []}]
                }
            })
    }

    const handleKnowledgeBaseChange = async (e) => {
        const selectedValue = e.target.value;
        changeKnowledgeBaseMutate({
            postID: post.id,
            knowledgeBaseID: parseInt(selectedValue, 10)
        });
    };

    const handleRefFileClick = async (file) => {
        try {
            const resp = await getReadURL({
                ownerID: file.owner_id,
                knowledgeBaseID: file.knowledge_base_id,
                fileName: file.name,
            });

            const preSignedUrl = resp.pre_signed_url;
            const fileExtension = file.name.split('.').pop().toLowerCase();

            const newWindow = window.open("", "_blank");

            switch (fileExtension) {
                case "txt":
                    fetch(preSignedUrl)
                        .then((response) => response.text())
                        .then((data) => {
                            if (newWindow) {
                                newWindow.document.write(`
                                <html>
                                    <head><title>File Preview</title></head>
                                    <body>
                                        <pre>${data}</pre>
                                    </body>
                                </html>
                            `);
                                newWindow.document.close();
                            }
                        });
                    break;

                case "pdf":
                    if (newWindow) {
                        newWindow.location.href = preSignedUrl;
                    }
                    break;

                case "doc":
                case "docx":
                    fetch(preSignedUrl)
                        .then((response) => response.arrayBuffer())
                        .then((data) => {
                            mammoth.extractRawText({ arrayBuffer: data }).then((result) => {
                                if (newWindow) {
                                    newWindow.document.write(`
                                    <html>
                                        <head><title>File Preview</title></head>
                                        <body>
                                            <pre>${result.value}</pre>
                                        </body>
                                    </html>
                                `);
                                    newWindow.document.close();
                                }
                            });
                        });
                    break;

                default:
                    if (newWindow) {
                        newWindow.document.write(`
                        <html>
                            <head><title>Unsupported File Type</title></head>
                            <body>
                                <p>Unsupported file type for preview.</p>
                            </body>
                        </html>
                    `);
                        newWindow.document.close();
                    }
                    break;
            }
        } catch (error) {
            console.error("Error while fetching file preview:", error);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <ChatWindow messages={post?.messages || []}
                        onFileClick={handleRefFileClick}
            />
            <div className="border-t-2 pt-4 border-gray-500 flex flex-row justify-between px-4 items-center">
                <div className="flex flex-row items-center">
                    <label className="mr-2">Knowledge Base</label>
                    <Select value={post?.knowledge_base_id} onChange={handleKnowledgeBaseChange}>
                        <option value={0} disabled>Choose Knowledge Base</option>
                        {knowledgeBases?.map((kb) => {
                            return <option key={kb.id} value={kb.id}>{kb.name}</option>
                        })}
                    </Select>
                </div>
            </div>
            <ChatInput onSend={handleSendMessage}/>
        </div>
    )
}