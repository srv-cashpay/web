import React, { useState, useRef, useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import Cookies from 'js-cookie';
import { sendWebSocketMessage } from './websocketService'; // Import function to send message

const EmoticonSelector = ({ onSelect }) => {
    const emoticons = [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍',
        // ... (tambahkan lebih banyak emotikon jika diperlukan)
    ];
    const overlayPanelRef = useRef(null);

    const itemTemplate = (emoticon) => (
        <div className="p-d-flex p-ai-center p-p-2" onClick={() => onSelect(emoticon)}>
            <span className="p-text-center" style={{ fontSize: '2rem' }}>{emoticon}</span>
        </div>
    );

    return (
        <div className="p-grid p-justify-center">
            <Button 
                label="😀" 
                className="p-button-rounded p-button-secondary"
                onClick={(e) => overlayPanelRef.current.toggle(e)}
            />
            <OverlayPanel 
                ref={overlayPanelRef} 
                showCloseIcon={true} 
                dismissable={false} 
                className="p-dataview-grid-overlay"
                style={{ width: '300px', maxHeight: '300px', overflow: 'auto' }}
            >
                <DataView 
                    value={emoticons} 
                    itemTemplate={itemTemplate}
                    rows={4}
                    className="p-dataview-grid"
                />
            </OverlayPanel>
        </div>
    );
};

const useFetchFriends = () => {
    const [friends, setFriends] = useState([]);
    const getTokenFromCookie = () => {
        const token = Cookies.get('token'); // <-- Replace 'yourCookieName' with the actual name of your cookie

        return token;
    };
    useEffect(() => {
        const token = getTokenFromCookie();

        const fetchData = async () => {
            try {
                const response = await axios.get('http://192.168.14.185:8080/api/v1/employee?page=1&limit=10', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                 // Ubah ini untuk memastikan Anda mendapatkan data user dari response
                 setFriends(response.data.data.map(item => ({
                    ...item.user, // Ambil semua properti dari user
                    value: item.user.id, // Atau gunakan id sebagai value jika Anda membutuhkannya
                    label: item.user.full_name // Gunakan full_name sebagai label
                })));
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchData();
    }, []);

    return friends;
};

const EmptyPage = () => {
    const friends = useFetchFriends();
    const [selectedFriend, setSelectedFriend] = useState(null);
    const handleEmoticonSelect = (emoticon) => {
        setInputText(prevText => prevText + emoticon);
    };
 
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const chatEndRef = useRef(null);
    const [fullName, setFullName] = useState('');

    const sendReply = () => {
        if (selectedFriend) {
            const reply = {
                id: messages.length + 1,
                content: `Reply from ${selectedFriend.full_name}`,
                sender_id: selectedFriend.id, // ID teman yang dipilih
                receiver_id: fullName,
                type: 'received'
            };
            setMessages([...messages, reply]);
        }
    };

    useEffect(() => {
        const storedFullName =  Cookies.get('use');

        if (storedFullName) {
            setFullName(storedFullName);
        }
        if (messages.length > 0 && messages[messages.length - 1].type === 'sent') {
            const timeout = setTimeout(() => {
                sendReply();
            }, 2000); 

            return () => clearTimeout(timeout); 
            
        }
        console.log("Messages:", messages);

    }, [messages]);

    const sendMessage = () => {
        if (inputText.trim() !== '' && selectedFriend) {
            const newMessage = {
                id: messages.length + 1,
                content: inputText.trim(),  // Menggunakan 'content' alih-alih 'text' sesuai dengan struktur backend
                sender_id: fullName,  // Ganti dengan ID pengirim yang sesuai
                receiver_id: selectedFriend.id,    // Menggunakan ID penerima yang dipilih
                timestamp: new Date().toISOString(),
                type: 'sent'
            };
            
            // Kirim pesan melalui WebSocket
            sendWebSocketMessage(newMessage);
    
            // Tambahkan pesan ke daftar pesan lokal
            setMessages(prevMessages => [...prevMessages, newMessage]);
            
            // Reset input teks
            setInputText('');
        }
    };

    const fetchChatHistory = async (senderId, receiverId) => {
        try {
            const response = await axios.get(`http://192.168.14.185:8080/api/v1/chat/history?sender_id=${senderId}&receiver_id=${receiverId}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`
                }
            });
            
            // Check if the response contains the expected data structure
            if (response.data && Array.isArray(response.data)) {
                return response.data;
            } else {
                console.log('Unexpected response structure:', response.data);
                return [];
            }
    
        } catch (error) {
            console.error('Error fetching chat history:', error.response ? error.response.data : error.message);
            // Handle the error (e.g., display an error message to the user)
            return [];
        }
    };

    const handleFriendSelect = async (friend) => {
        setSelectedFriend(friend);
        const history = await fetchChatHistory(fullName, friend.id); // Ganti dengan ID Anda
        setMessages(history);
    };
    
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="card">
                <div className="card-header">
                <Dropdown 
                    value={selectedFriend ? selectedFriend.id : null} 
                    options={friends} 
                    onChange={(e) => handleFriendSelect(friends.find(friend => friend.id === e.value))} 
                    optionLabel="full_name"
                    placeholder="Select a friend" 
                />
                </div>
            </div>
           <div className="card-body" style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column' }}>
                {/* Map over the messages array and display each message */}
                {messages.map((message) => (
    <div 
        key={message.id} 
        style={{
            textAlign: 'left',
            marginBottom: '4px',
            alignSelf: message.type === 'sent' ? 'flex-end' : 'flex-start'
        }}
    >
        <div 
            style={{
                display: 'inline-block',
                borderRadius: '12px',
                padding: '8px',
                backgroundColor: message.type === 'sent' ? '#DCF8C6' : '#E5E5EA',
                whiteSpace: 'pre-wrap'
            }}
        >
            {/* Display the message content */}
            {Array.isArray(message.content) ? message.content.join('\n') : message.content}
        </div>
    </div>
))}

                <div ref={chatEndRef} />
            </div>

            <div className="card-footer" style={{ padding: '8px', borderTop: '1px solid #ccc' }}>
                <div className="p-inputgroup">
                    <InputTextarea 
                        placeholder="Type your message..." 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <Button 
                        label="Send" 
                        className="p-button-secondary" 
                        icon="pi pi-send" 
                        onClick={sendMessage}
                    />
                </div>
                <EmoticonSelector onSelect={handleEmoticonSelect} />
            </div>
        </div>
    );
};

export default EmptyPage;
