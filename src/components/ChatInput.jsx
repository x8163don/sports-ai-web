import { useState} from "react";
import debounce from 'lodash/debounce';


export default function ChatInput({onSend, disabled}) {
    const [message, setMessage] = useState('');
    const [isComposing, setIsComposing] = useState(false);

    const handleSend = () => {
        if (!message.trim()) return;
        onSend(message);
        setMessage('');
    };

    const debounceSend = debounce(()=>handleSend(),300)

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isComposing) {
            e.preventDefault();
            debounceSend()
        }
    };

    return (
        <div className="flex items-center p-4">
            <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={()=>setIsComposing(true)}
                onCompositionEnd={()=>setIsComposing(false)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleSend}
                disabled={disabled}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Send
            </button>
        </div>
    );
};