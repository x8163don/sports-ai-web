import {Button, Modal, Input, Textarea, Card} from "react-daisyui";
import {useRef, useState} from "react";
import {createKnowledgeBase, deleteKnowledgeBase, listKnowledgeBases} from "../api/knowledge-base.js";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {CacheKeyFn, queryClient} from "../api/base.js";

export default function KnowledgeBasesPage() {

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const newKnowledgeBaseName = useRef(null);
    const newKnowledgeBaseDesc = useRef(null);

    const {
        data: knowledgeBases,
        isLoading: isKnowledgeBasesLoading
    } = useQuery({
        queryKey: CacheKeyFn.KnowledgeBases(),
        queryFn: listKnowledgeBases,
    })

    const {
        mutate: createKnowledgeBaseMutate,
    } = useMutation({
        mutationFn: createKnowledgeBase,
        onSuccess: (data) => {
            queryClient.invalidateQueries(CacheKeyFn.KnowledgeBases())
            queryClient.invalidateQueries(CacheKeyFn.KnowledgeBase(data.id))
            setIsModalOpen(false)
        },
        onError: (error) => {
            console.error('Failed to fetch chat response:', error);
        }
    })

    const {
        mutate: deleteKnowledgeBaseMutate,
        isPending: isDeletePending
    } = useMutation({
        mutationFn: deleteKnowledgeBase,
        onSuccess: (data) => {
            queryClient.invalidateQueries(CacheKeyFn.KnowledgeBases())
            queryClient.invalidateQueries(CacheKeyFn.KnowledgeBase(data.id))
        }
    })

    const handleNewKnowledgeBase = () => {
        createKnowledgeBaseMutate({
            name: newKnowledgeBaseName.current.value,
            description: newKnowledgeBaseDesc.current.value
        })
    }

    const handleDeleteKnowledgeBase = async (id) => {
        deleteKnowledgeBaseMutate(id)
    }

    if (isKnowledgeBasesLoading) {
        return <div>Loading...</div>
    }

    return <div className="h-full flex flex-col">
        <div className="h-full flex flex-col p-6 gap-2">
            <div className="flex flex-row gap-2">
                <Button onClick={() => setIsModalOpen(true)}>New</Button>
            </div>

            {
                knowledgeBases?.knowledge_bases.map(kb => {
                        return <Card key={kb.id}>
                            <Card.Body onClick={() => {
                                navigate(`/dashboard/knowledge-base/${kb.id}`)
                            }}>
                                <Card.Title className="flex flex-row justify-between">{kb.name}
                                    <Button
                                        disabled={isDeletePending}
                                        onClick={() => handleDeleteKnowledgeBase(kb.id)}
                                    >Delete</Button>
                                </Card.Title>
                                {kb.description}
                            </Card.Body>
                        </Card>
                    }
                )
            }
        </div>

        <Modal open={isModalOpen}>
            <Modal.Header>New Knowledge Base</Modal.Header>
            <Modal.Body>
                <div className="flex flex-col">
                    <label>Name</label>
                    <Input ref={newKnowledgeBaseName}></Input>
                </div>

                <div className="mt-2 flex flex-col">
                    <label>Description</label>
                    <Textarea ref={newKnowledgeBaseDesc}></Textarea>
                </div>
            </Modal.Body>
            <Modal.Actions>
                <Button onClick={() => {
                    setIsModalOpen(false)
                    newKnowledgeBaseName.current.value = ""
                    newKnowledgeBaseDesc.current.value = ""
                }}>Close</Button>
                <Button onClick={handleNewKnowledgeBase}>Save</Button>
            </Modal.Actions>
        </Modal>


    </div>
}

