import {useRef, useState} from "react";
import {deleteFile, getKnowledgeBase, getUploadURL, listFiles} from "../api/knowledge-base.js";
import {useParams} from "react-router-dom";
import {Button} from "react-daisyui";
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {CacheKeyFn, queryClient} from "../api/base.js";

export default function KnowledgeBasePage() {
    const {id} = useParams()
    const [curFile, setCurFile] = useState(null)
    const fileRef = useRef(null)

    const {
        data: knowledgeBase,
        isLoading: isKnowledgeBaseLoading
    } = useQuery({
        queryKey: CacheKeyFn.KnowledgeBase(id),
        queryFn: () => getKnowledgeBase(id),
    })

    const {
        data: filesResponse,
        isFetching: isFilesLoading,
    } = useInfiniteQuery({
        queryKey: CacheKeyFn.KnowledgeBaseFiles(id),
        queryFn: ({pageParam}) => listFiles({knowledgeBaseID: id, cursor: pageParam}),
        getNextPageParam: (lastPage) => lastPage.next_cursor || null,
        initialPageParam: 0,
    })

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return
        }
        setCurFile(file)
    };

    const {
        mutate: uploadFileMutate,
    } = useMutation({
        mutationFn: async () => {
            if (!curFile) {
                return
            }

            const data = await getUploadURL({
                knowledgeBaseID: knowledgeBase.id,
                fileName: curFile.name,
                contentType: curFile.type
            })

            const {pre_signed_url} = data;

            const response = await fetch(pre_signed_url, {
                method: "PUT",
                headers: {"Content-Type": curFile.type,},
                body: curFile,
            });

            if (response.ok) {
                fileRef.current.value = null
            } else {
                console.error("Failed to upload file.");
            }
        },
        onSuccess: () => {
            setTimeout(() => {
                queryClient.invalidateQueries(CacheKeyFn.KnowledgeBaseFiles(id))
            }, 1200)
        },
        onError: (error) => {
            console.error('Failed to fetch chat response:', error);
        }
    })

    const {
        mutate: deleteFileMutate,
        isPending: isDeleteFilePending
    } = useMutation({
        mutationFn: deleteFile,
        onSuccess: (data) => {
            queryClient.setQueryData(
                CacheKeyFn.KnowledgeBaseFiles(id),
                (old) => {
                    if (!old) return old
                    const n = {
                        ...old,
                        pages: old.pages.map((group) => ({
                            ...group,
                            files: group.files.filter(file => file.id !== data.id)
                        }))
                    }
                    console.log(n);
                    return n
                }
            )
        }
    })


    if (isKnowledgeBaseLoading || isFilesLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <div> {knowledgeBase.name} </div>
            <div className="flex items-center">
                <input
                    type="file"
                    accept="application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className=""
                    ref={fileRef}
                    onChange={handleFileChange}
                />
                <Button onClick={uploadFileMutate}>Upload</Button>
            </div>

            <div className="w-full max-w-lg">
                <ul className="divide-y divide-gray-700">
                    {filesResponse.pages.map((group) => {
                        return group.files.map((file) => {
                            return <li
                                key={file.id}
                                className="flex justify-between items-center py-3 px-4 hover:bg-gray-800 group transition duration-200 rounded"
                            >
                                <a
                                    href={file.url}
                                    className="text-blue-400 hover:text-blue-300 truncate"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {file.name}
                                </a>
                                <Button
                                    disabled={isDeleteFilePending}
                                    onClick={() => deleteFileMutate({
                                        knowledgeBaseID: knowledgeBase.id,
                                        fileID: file.id
                                    })}
                                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    Delete
                                </Button>
                            </li>
                        })
                    }).flat(1)}
                </ul>
            </div>
        </div>
    );
}

