import '../styles/chat.css';
import socketIo from 'socket.io-client';
import Message from "./Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import { FaVideo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSocket } from "../context/SocketProvider";
import CONFIG from '../Configuration';

let socket;

const NSFW_WORDS = [
    'abuse', 'fuck', 'fucked', 'racist', 'fucker', 'ass', 'exploit', 'porn', 'explicit', 'vulgar', 'naked', 
    'kill', 'murder', 'terrorist', 'rape', 'pussy', 'vagina', 'harass', 'slur', 'dick', 'abuser', 'bully', 
    'molest', 'illegal', 'drugs', 'cock', 'asshole', 'gay', 'transgender', 'sexy', 'suicide', 'kafir', 
    'misogyny', 'sexism', 'xenophobia', 'homophobia', 'transphobia', 'abduction', 'exploitation', 'trafficking', 
    'profanity', 'kaafir', 'degrading', 'humiliate', 'exploitative', 'sadist', 'cum', 'malicious', 'extremism', 
    'missionary', 'doggy', 'doggystyle', 'whore', 'boobs', 'boob', 'breast', 'hip', 'hips', 'nipple', 'orgasm', 
    'masturbate', 'masturbation', 'ejaculation', 'anal', 'squirting', 'squirt','blowjob', 'handjob', 'threesome', 
    'foursome', 'incest', 'penetration', 'creampie', 'gangbang', 'hentai', 'xhamster', 'fetish', 'dominatrix', 
    'submissive', 'sadomasochism', 'erotic', 'bondage', 'nude', 'strip', 'striptease', 'pornhub', 'xvideos', 
    'redtube', 'onlyfans', 'camgirl', 'camsite', 'amateur', 'adult', 'swinger', 'foreplay', 'hookup', 'sexcam',
    'brazzers', 'bangbros', 'naughtyamerica', 'teamSkeet', 'metart', 'joymii', 'realitykings', 'evilangel', 
    'digitalplayground', 'kink', 'vrporn', 'javhub', 'pornhd', 'desipapa', 'tamilsex', 'bhabhixxx', 'hindisex', 
    'bhabhiporn', 'desisexvideos', 'bangla', 'punesex', 'keralaporn', 'sikhporn', 'indiansex', 'malluporn', 
    'indianbhabhi', 'hotindian', 'indianfuck', 'indianporn', 'indiananal', 'indianhentai',
    'chutiya', 'gandu', 'bhenchod', 'madarchod', 'lund', 'chut', 'behenchod', 'bhosdike', 'gaand', 'chod', 
    'randi', 'saala', 'saali', 'chutmarani', 'bhen', 'ma', 'haraami', 'harami', 'paagal', 'bakchod', 
    'chodu', 'rakhail', 'chutiyapa', 'chutkula', 'ghus', 'bhadwa', 'bhadwe', 'lauda', 'laude', 'gaandfat', 
    'peshab', 'thook', 'chachundar', 'saand', 'gobar', 'kutta', 'kaminey', 'kaminay', 'hijra', 'gand', 'bsdk',
    'rapist', 'peeping', 'voyeur', 'scat', 'vomit', 'bestiality', 'pedophile', 'molester', 'maniac', 
    'pervert', 'necrophilia', 'zoophilia', 'gore', 'degradation', 'incel', 'simp', 'slut', 'hoe', 
    'hooker', 'bimbo', 'goldigger', 'smut', 'obscene', 'perversion', 'smutty', 'taboo', 'seduction', 
    'lewd', 'lustful', 'adultwork','infidelity','pornstar','bbc','blacked','blackedraw','bbw','spank','brazzer'
];


const checkNSFW = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    return words.some(word => NSFW_WORDS.includes(word));
};

function ChatBox() {
    const location = useLocation();
    const { profile } = location.state;
    const StoredData = localStorage.getItem("user");
    const user = JSON.parse(StoredData);
    const [id, setid] = useState("");
    const [messages, setMessages] = useState([]);
    const [name, setName] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [room, setRoom] = useState(profile.room);
    const [showWarning, setShowWarning] = useState(false);
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const timerRef = useRef(null);

    const PORT = 4500;
    const IP = CONFIG.IP || 'localhost';
    const Server_PORT = CONFIG.PORT || '8000';
    const API = CONFIG.API_URL;
    const APIS = CONFIG.SOCKET_API;

    const socket2 = useSocket();

    const navigate = useNavigate();

    const joinRoom = () => {
        socket.emit('joinRoom', room);
    };
     
    const Warn = async () => {
        setShowWarning(true);
    };
    
    const startRecording = async () => {
        try {
            setIsRecording(true);
            setRecordingTime(0);
            
            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            let chunks = [];

            recorder.ondataavailable = (e) => {
                chunks.push(e.data);
            };

            recorder.onstop = () => {
                clearInterval(timerRef.current);
                setIsRecording(false);
                
                if (chunks.length > 0) {
                    const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = () => {
                        const base64Audio = reader.result;
                        socket.emit('audioMessage', { audio: base64Audio, id, room });
                    };
                }
                
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current = recorder;
            recorder.start();
        } catch (err) {
            console.error('Error accessing microphone:', err);
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
    };

    const send = () => {
        const message = document.getElementById('chatInput').value;

        if (checkNSFW(message)) {
            Warn();
            return;
        }

        if (message.trim()) {
            socket.emit('message', { message, id, room });
            document.getElementById('chatInput').value = "";
            setChatInput('');
        }
    };

    const handleEmojiClick = (emoji) => {
        setChatInput((prevInput) => prevInput + emoji.emoji);
    };
    
     const JoinVideo = useCallback(
        (e) => {
         console.log("Join Video FN Called");
          e.preventDefault();
          socket2.emit("room:join", { email, room });
          localStorage.setItem('name',JSON.stringify({name: profile.username}));
        },
        [email, room, socket2]
      );
      const handleJoinRoom = useCallback(
          (data) => {
            const { email, room } = data;
            navigate(`/room/${room}`);
          },
          [navigate]
        );

    useEffect(() => {
        socket = socketIo(`${APIS}`, { transports: ['websocket'] });
        socket.on("connect", () => {
            setid(socket.id);
        });
        joinRoom();
        socket.emit("joined", { name });

        socket.on("welcome", (data) => {
            setMessages(prev => [...prev, data]);
        });

        socket.on('userjoined', (data) => {
            setMessages(prev => [...prev, data]);
        });

        socket.on('leave', (data) => {
            setMessages(prev => [...prev, data]);
        });

        socket.on('sendMessage', (data) => {
            setMessages(prev => [...prev, data]);
        });

        socket.on('sendAudio', (data) => {
            setMessages(prev => [...prev, { ...data, isAudio: true }]);
        });

        return () => {
            clearInterval(timerRef.current);
            socket.off();
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket2.on("room:join", handleJoinRoom);
        return () => {
          socket2.off("room:join", handleJoinRoom);
        };
      }, [socket2, handleJoinRoom]);
    
    return (
        <div className='chat-container'>
           {showWarning && (
                <div className="absolute top-0 left-0 h-full w-full inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="warning-popup">
                        <div className="warning-content">
                            <div className="warning-icon">
                                <i className="fas fa-exclamation-circle"></i>
                            </div>
                            <p>Warning: Inappropriate language detected!</p>
                            <button onClick={() => setShowWarning(false)}>I am Sorry</button>
                        </div>
                    </div>
                </div>
            )}
            
            {isRecording && (
                <div className="recording-overlay">
                    <div className="recording-indicator">
                        <div className="pulse-animation"></div>
                        <span>Recording... {recordingTime}s</span>
                        <button 
                            onClick={stopRecording}
                            className="stop-recording-btn"
                        >
                            Stop & Send
                        </button>
                    </div>
                </div>
            )}
            
            <div className='header'>
                <div className='profileInfo'>
                    <h2 className='sname'>{profile.username}</h2>
                </div>
                <button
                onClick={JoinVideo}
                className="text-white text-2xl hover:text-purple-300 transition transform hover:scale-125 duration-200"
                >
                <FaVideo />
                </button>
            </div>
            
            <ReactScrollToBottom className="chatBox">
                {messages.map((item, i) => (
                    <Message
                        key={i}
                        user={item.id === id ? '' : item.user}
                        message={item.isAudio ? null : item.message}
                        audio={item.isAudio ? item.audio : null}
                        classs={item.id === id ? 'right' : 'left'}
                    />
                ))}
            </ReactScrollToBottom>
            
            <div className="inputBox">
                {emojiPickerVisible && (
                    <div className="emoji-picker">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                )}
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(event) => (event.key === 'Enter' ? send() : null)}
                    placeholder="Type a message..."
                    id="chatInput"
                />
                <button 
                    onClick={() => setEmojiPickerVisible(!emojiPickerVisible)} 
                    className="emoji-btn"
                >
                    😊
                </button>
                <button 
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    className={`mic-btn ${isRecording ? 'recording' : ''}`}
                >
                    🎤
                </button>
                <button onClick={send} className="sendBtn">
                    <img src="send.png" alt="Send" />
                </button>
            </div>
        </div>
    );
}

export default ChatBox;
