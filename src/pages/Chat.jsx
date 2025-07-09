import Navbar from "../UI/Navbar";
import ChatBox from "../components/ChatBox";
import { FaUserFriends, FaVideo, FaSmile, FaPhone, FaHeart, FaStar } from "react-icons/fa";

function Chat() {
  const StoredData = localStorage.getItem("user");
  const userData = JSON.parse(StoredData);

  return (
    <div className="w-[100vw] items-center h-[100vh] bg-gradient-to-br from-purple-900 to-purple-500 text-white overflow-hidden">
      
      <Navbar />

      <FaUserFriends className="absolute top-[20%] left-[5%] text-5xl opacity-20 animate-bounce" />
      <FaVideo className="absolute top-[14%] right-[10%] text-6xl opacity-20 animate-pulse" />
      <FaStar className="absolute top-[44%] right-[15%] text-[100px] opacity-20 animate-pulse" />
      <FaSmile className="absolute bottom-[15%] left-[15%] text-5xl opacity-20 animate-bounce" />
      <FaPhone className="absolute bottom-[20%] right-[8%] text-6xl opacity-20 animate-pulse" />
      <FaHeart className="absolute top-[34%] left-[15%] text-[100px] opacity-10 animate-spin-slow" />

      {/* Main Chat Centered */}
      <div className="w-full h-[calc(100vh-60px)] flex items-center text-gray-700 justify-center ml-[10vw] px-[5vw]">
        <div className="w-full max-w-4xl">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}

export default Chat;
