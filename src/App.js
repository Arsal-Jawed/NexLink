import { Routes, Route } from "react-router-dom";
import "./App.css";
import LobbyScreen from "./screens/Lobby";
import RoomPage from "./screens/Room";
import Home from "./pages/Home";
import People from "./pages/People";
import Chat from "./pages/Chat";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/people" element={<People/>}/>
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/lobby" element={<LobbyScreen />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  );
}

export default App;
