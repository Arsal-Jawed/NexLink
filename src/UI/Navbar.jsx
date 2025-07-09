import { FaVideo, FaComments, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="w-full h-[10vh] bg-purple-900 flex justify-between items-center px-[5vw] text-white shadow-md">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <FaVideo className="text-2xl text-purple-300" />
        NexLink
      </h1>
      <ul className="flex gap-[3vw] text-lg">
        <li className="hover:text-purple-300 cursor-pointer transition-all duration-300 flex items-center gap-1">
          <FaComments /> Chat
        </li>
        <li className="hover:text-purple-300 cursor-pointer transition-all duration-300 flex items-center gap-1">
          <FaVideo /> Video Call
        </li>
        <li className="hover:text-purple-300 cursor-pointer transition-all duration-300 flex items-center gap-1">
          <FaUserCircle /> Profile
        </li>
      </ul>
    </nav>
  );
}
