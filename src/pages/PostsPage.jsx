import {createPost, deletePost, listPosts} from "../api/post.js";
import {Button, Card} from "react-daisyui";
import {useNavigate} from "react-router-dom";
import {PlusIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
import {useMutation, useQuery} from "@tanstack/react-query";
import {CacheKeyFn, queryClient} from "../api/base.js";

export default function PostsPage() {

    const navigate = useNavigate()

    const {
        data: postsResp,
    } = useQuery({
        queryKey: CacheKeyFn.Posts(),
        queryFn: listPosts,
    })

    const {
        mutateAsync: asyncCreatePostMutate
    } = useMutation({
        mutationFn: createPost,
        onSuccess: (data) => {
            queryClient.invalidateQueries(CacheKeyFn.Posts())
            queryClient.invalidateQueries(CacheKeyFn.Post(data.id))
        }
    })

    const {
        mutate: deletePostMutate,
        isLoading: isDeletePostLoading
    } = useMutation({
        mutationFn: deletePost,
        onSuccess: (data) => {
            queryClient.invalidateQueries(CacheKeyFn.Posts())
            queryClient.invalidateQueries(CacheKeyFn.Post(data.id))
        }
    })

    const handleNewPost = async () => {
        const data = await asyncCreatePostMutate()
        navigate(`/dashboard/post/${data.id}`)
    }

    return (
        <div className="h-full flex flex-col p-6 gap-2">
            <div className="flex flex-row gap-2">
                <Button
                    color="primary"
                    onClick={handleNewPost}>
                    <PlusIcon className="w-5 h-5"/>
                    New Post
                </Button>
            </div>
            {postsResp?.posts.map((post) => {
                return <Card key={post.id}
                             bordered
                             className="cursor-pointer"
                             onClick={() => {
                                 queryClient.invalidateQueries(CacheKeyFn.Post("new"))
                                 navigate(`/dashboard/post/${post.id}`)
                             }}>
                    <Card.Body>
                        <Card.Title className="flex flex-row justify-between">
                            {post.title}
                            <Button onClick={(e) => {
                                e.stopPropagation()
                                deletePostMutate(post.id)
                            }}
                                    disabled={isDeletePostLoading}
                            >
                                <TrashIcon className="w-5 h-5"/>
                                Delete
                            </Button>
                        </Card.Title>
                    </Card.Body>
                </Card>
            })}
        </div>
    );
}

