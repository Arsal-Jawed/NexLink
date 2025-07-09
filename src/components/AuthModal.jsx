import { useState } from "react";
import { FaTimes, FaCamera, FaVideo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CONFIG from '../Configuration';

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", confirm: "", username: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const IP = CONFIG.IP || 'localhost';
  const PORT = CONFIG.PORT || '8000';
  const API = CONFIG.API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (isLogin) {
      if (!form.email || !form.password) return setError("All fields are required.");
      if (!/\S+@\S+\.\S+/.test(form.email)) return setError("Invalid email format.");
      return true;
    } else {
      if (!form.username || !form.email || !form.password || !form.confirm)
        return setError("All fields are required.");
      if (!/\S+@\S+\.\S+/.test(form.email)) return setError("Invalid email format.");
      if (form.password.length < 8) return setError("Password must be at least 8 characters.");
      if (!/[!@#$%^&*]/.test(form.password)) return setError("Password must contain a special character.");
      if (form.password !== form.confirm) return setError("Passwords do not match.");
      return true;
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
  
    const url = isLogin ? `${API}/login` : `${API}/signup`;
    const payload = isLogin
      ? { email: form.email, password: form.password }
      : { username: form.username, email: form.email, password: form.password };
  
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError(data || "Something went wrong");
  
      console.log("Success:", data);
      onClose();
      localStorage.clear();
      localStorage.setItem("user",JSON.stringify(data));
      navigate('/people');
    } catch (err) {
      console.error("Error:", err);
      setError("Server not responding. Maybe backend band hai? 😒");
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md z-50 flex justify-center items-center">
      <div className="relative w-[90vw] md:w-[30vw] bg-white rounded-2xl shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-5 text-2xl text-purple-700 hover:text-red-500 z-10">
          <FaTimes />
        </button>

        <div className="flex w-[200%] transition-transform duration-500" style={{ transform: isLogin ? "translateX(0%)" : "translateX(-50%)" }}>
          {/* Login */}
          <div className="w-[50%] p-8 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-purple-700 mb-4 flex items-center gap-2">
              <FaVideo className="text-purple-500" /> Login to NexLink
            </h2>
            <input name="email" type="email" placeholder="Email" onChange={handleChange}
              className="w-full mb-4 px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <input name="password" type="password" placeholder="Password" onChange={handleChange}
              className="w-full mb-4 px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button onClick={handleSubmit}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-xl font-semibold transition-all duration-300">
              Login
            </button>
            <p className="mt-4 text-sm text-gray-600">
              Not a user?{" "}
              <span onClick={() => { setIsLogin(false); setError(""); }}
                className="text-purple-700 font-bold cursor-pointer hover:underline">Signup here</span>
            </p>
          </div>

          {/* Signup */}
          <div className="w-[50%] p-8 flex flex-col items-center justify-center bg-gray-50">
            <h2 className="text-3xl font-bold text-purple-700 mb-4 flex items-center gap-2">
              <FaCamera className="text-purple-500" /> Join NexLink
            </h2>
            <input name="username" type="text" placeholder="Username" onChange={handleChange}
              className="w-full mb-3 px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <input name="email" type="email" placeholder="Email" onChange={handleChange}
              className="w-full mb-3 px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <input name="password" type="password" placeholder="Password" onChange={handleChange}
              className="w-full mb-3 px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <input name="confirm" type="password" placeholder="Confirm Password" onChange={handleChange}
              className="w-full mb-4 px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button onClick={handleSubmit}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-xl font-semibold transition-all duration-300">
              Signup
            </button>
            <p className="mt-4 text-sm text-gray-600">
              Already have an account?{" "}
              <span onClick={() => { setIsLogin(true); setError(""); }}
                className="text-purple-700 font-bold cursor-pointer hover:underline">Login</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
