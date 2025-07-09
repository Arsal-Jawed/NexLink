import { FaPaperPlane, FaGlobeAmericas, FaVideo, FaBolt } from "react-icons/fa";
import AuthModal from "../components/AuthModal";
import { useState } from "react";

export default function HeroSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative h-[90vh] w-full">
      <img
        src="/Start.png"
        className="absolute h-full w-full object-cover"
        alt="hero bg"
      />
      <div className="absolute h-full w-full bg-black bg-opacity-70 flex items-center justify-center px-4">
        <div className="flex flex-col text-center text-white max-w-[80vw] space-y-6 items-center">
          <div className="flex justify-center gap-8 mb-2 text-purple-400 text-4xl">
            <div className="hover:text-purple-100 transition-all duration-300" title="Global Access">
              <FaGlobeAmericas />
            </div>
            <div className="hover:text-purple-100 transition-all duration-300" title="Live Webcam">
              <FaVideo />
            </div>
            <div className="hover:text-purple-100 transition-all duration-300" title="Instant Matching">
              <FaBolt />
            </div>
          </div>

          <h2 className="text-4xl md:text-[3vw] font-extrabold leading-tight drop-shadow-xl">
            Talk Real. Talk Raw.<br />Live Video Chat With Strangers
          </h2>

          <p className="text-purple-200 text-lg md:text-[1.8vw] max-w-[60vw]">
            Meet new people instantly – no filters, no fakeness, just face-to-face randomness.
          </p>

          <div className="flex justify-center mt-2">
            <button onClick={() => setShowModal(true)}
            className="px-4 py-3 w-[16vw] text-[1.2vw] font-bold bg-white text-purple-800 rounded-full flex justify-center items-center gap-3 hover:bg-purple-700 hover:text-white hover:scale-110 transition-all duration-300 shadow-xl">
              <FaPaperPlane className="text-2xl" />
              Get Started
            </button>
          </div>
        </div>
      </div>
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
