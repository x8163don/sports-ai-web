import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import {Button} from "react-daisyui";

export default function ChatMessage({message, refFiles, isUser, onFileClick}) {
    return <div
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}
    >
        <div
            className={`p-3 rounded-lg max-w-xl ${
                isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
        >
            <ReactMarkdown
                children={message}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
                className="prose prose-md"
            />

            {
                !isUser && refFiles && <div className="flex gap-2">
                    {
                        refFiles.map((file) => (
                            <Button key={file.name} onClick={() => onFileClick(file)}>{file.name}</Button>
                        ))
                    }
                </div>
            }
        </div>
    </div>
}
