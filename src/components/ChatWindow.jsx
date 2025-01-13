import PropTypes from 'prop-types';
import ChatMessage from './ChatMessage';
import {useRef, useEffect} from 'react';

export default function ChatWindow({messages, onFileClick}) {
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'auto',
            });
        }
    }, [messages]);

    return (
        <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4"
        >
            {messages.map((msg, index) => (
                <ChatMessage
                    key={index}
                    onFileClick={onFileClick}
                    isUser={msg.speaker === 'Customer'}
                    refFiles={msg.refFiles}
                    message={msg.text}
                />
            ))}
        </div>
    );
}

ChatWindow.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired,
            speaker: PropTypes.string.isRequired,
        })
    ).isRequired,
};
