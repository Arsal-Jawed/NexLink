import { FaVideo, FaGlobe, FaCommentDots, FaStar, FaHeart } from "react-icons/fa";
import { RiSparkling2Fill, RiChatSmile2Line } from "react-icons/ri";
import { BsChatSquareQuote } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import CONFIG from '../Configuration';

export default function UserCard({ user }) {

  const navigate = useNavigate();

  const IP = CONFIG.IP || 'localhost';
  const PORT = CONFIG.PORT || '8000';
  const API = CONFIG.API_URL;

  const Chat = async() => {
    
    const StoredData = localStorage.getItem("user");
    const userData = JSON.parse(StoredData);

    const mail2 = user.email;
    const mail1 = userData.email;
    const Check = {
        mail1,
        mail2
    }

    const response = await fetch(`${API}/room`,{
      method: 'POST',
      body: JSON.stringify(Check),
      headers: {'Content-Type':'application/json'}
  });

  const data = await response.json();

  const profile = {
    username: user.username,
    room: data
    }

    navigate('/chat',{state:{profile}});

  }

  return (
    <div className="relative w-[220px] h-[280px] bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-[0_8px_30px_rgba(123,104,238,0.25)] flex flex-col items-center justify-center p-5 m-3 group transition-all hover:scale-105 hover:shadow-[0_8px_30px_rgba(123,104,238,0.4)] border border-purple-100 overflow-hidden">

      <RiSparkling2Fill className="absolute top-2 left-5 text-yellow-400 text-[6vw] opacity-80 animate-pulse" />
      <FaHeart className="absolute bottom-3 left-5 text-pink-400 text-[2vw] opacity-90" />
      <BsChatSquareQuote className="absolute bottom-3 right-2 text-purple-300 text-[2.6vw] -rotate-12" />
      <FaStar className="absolute top-1/4 right-4 text-purple-200 text-[4vw]" />
      
      <div className="flex flex-col items-center mt-4">
        <h3 className="text-[1.8vw] font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent tracking-wide">
          {user.username}
        </h3>
        <div className="flex justify-center items-center mt-2 gap-1 mb-4 text-[1vw]">
          <FaStar className="text-yellow-400" />
          <span className="text-purple-600 font-medium">Active Member</span>
          <FaStar className="text-yellow-400" />
        </div>
        
        <div className="flex gap-3 text-xl mt-2">
          <div className="p-2 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white hover:shadow-lg transition-all hover:-translate-y-1">
            <FaGlobe />
          </div>
          <div className="p-2 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white hover:shadow-lg transition-all hover:-translate-y-1">
            <FaVideo />
          </div>
          <div className="p-2 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-white hover:shadow-lg transition-all hover:-translate-y-1">
            <FaCommentDots />
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/80 to-pink-500/80 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-all duration-300 rounded-3xl">
        <button onClick={Chat} 
        className="px-5 py-2 bg-white text-purple-700 rounded-full font-bold hover:scale-105 transition-transform duration-200 shadow-xl flex items-center gap-2 text-sm">
          <RiSparkling2Fill className="text-pink-500" />
          💬 Start Chat
        </button>
      </div>
    </div>
  );
}