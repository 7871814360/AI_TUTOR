import React, { useState, useEffect } from 'react';
import '../CSS/pdf.css';
import App from './App.js';
import Whiteboard from './Whiteboard'; // Import the Whiteboard component

const PDF = ({ url }) => {
    const [isChatOpen, setIsChatOpen] = useState(false); // State for chat popup
    const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false); // State for whiteboard popup
    const [isChatHalfScreen, setIsChatHalfScreen] = useState(false); // State for half-screen chat

    const toggleChat = () => {
        setIsChatOpen((prev) => !prev); // Toggle chat state
    };

    const toggleWhiteboard = () => {
        setIsWhiteboardOpen((prev) => !prev); // Toggle whiteboard state
    };

    const toggleChatHalfScreen = () => {
        setIsChatHalfScreen((prev) => !prev); // Toggle half-screen state
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            const chatElement = document.getElementById('chat-popup');
            const iconElement = document.getElementById('chat-icon');

            if (chatElement && !chatElement.contains(e.target) && iconElement && !iconElement.contains(e.target)) {
                setIsChatOpen(false); // Close chat if clicking outside
            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
            <iframe
                src={url}
                style={{ border: 'none', height: '100%', width: isChatHalfScreen ? '50%' : '100%' }} // Adjust width based on half-screen state
                title="PDF Viewer"
                allowFullScreen
            />

            {/* Chatbot popup */}
            {isChatOpen && (
                <div
                    id="chat-popup"
                    style={{
                        position: 'fixed',
                        bottom: isChatHalfScreen ? '0' : '13%',
                        right: isChatHalfScreen ? '0' : '20px', // Adjust position for half-screen
                        width: isChatHalfScreen ? '50%' : '400px',
                        height: isChatHalfScreen ? '100%' : '77%',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        backgroundColor: 'white',
                        zIndex: 1000,
                        overflow: 'hidden',
                    }}
                >
                    {/* Half-screen toggle icon */}
                    <div 
                        onClick={toggleChatHalfScreen}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            cursor: 'pointer',
                            zIndex: 1001,
                        }}
                    >
                        {isChatHalfScreen ? <img width="30" height="30" src="https://img.icons8.com/ios-filled/50/collapse.png" alt="collapse"/> : <img width="30" height="30" src="https://img.icons8.com/ios-filled/50/fit-to-width.png" alt="fit-to-width"/>} {/* Change icon based on state */}
                    </div>
                    <App screen={{isChatHalfScreen}} />
                </div>
            )}

            {/* Floating chatbot icon */}
            <div 
                id="chat-icon"
                onClick={toggleChat}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '100px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    zIndex: 999,
                }}
            >
                💬 {/* Chat icon */}
            </div>

            {/* Floating whiteboard icon */}
            <div 
                onClick={toggleWhiteboard}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#28a745',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    zIndex: 999,
                }}
            >
                📝 {/* Whiteboard icon */}
            </div>

            {/* Whiteboard popup */}
            {isWhiteboardOpen && (
                <div
                    id="whiteboard-popup"
                    style={{
                        position: 'fixed',
                        bottom: '100px',
                        right: '20px',
                        width: '400px',
                        height: '500px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        backgroundColor: 'white',
                        zIndex: 1000,
                        overflow: 'hidden',
                    }}
                >
                    <Whiteboard />
                </div>
            )}
        </div>
    );
};

export default PDF;