import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import { FaPhoneAlt, FaPhoneSlash, FaVideo } from "react-icons/fa";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const username = JSON.parse(localStorage.getItem("name"));

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleEndCall = useCallback(() => {
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
      setMyStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    peer.peer.close();
    setRemoteSocketId(null);
  }, [myStream, remoteStream]);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  return (
    <div className="relative min-h-screen w-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 flex items-center justify-center overflow-hidden">
      
      {/* Remote Stream */}
      {remoteStream && (
        <div className="w-[92vw] max-w-6xl h-[78vh] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/20 backdrop-blur-md">
          <ReactPlayer
            playing
            muted={false}
            url={remoteStream}
            width="100%"
            height="100%"
            className="object-cover rounded-3xl"
          />
        </div>
      )}
  
      {/* Control Buttons - Floating */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 px-12 py-4 bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] z-20">
        {myStream && (
          <button
            onClick={sendStreams}
            className="text-blue-300 hover:text-blue-500 text-3xl transition-transform hover:scale-110"
          >
            <FaVideo />
          </button>
        )}
  
        {remoteSocketId && (
          <button
            onClick={handleCallUser}
            className="text-green-400 hover:text-green-600 text-3xl transition-transform hover:scale-110"
          >
            <FaPhoneAlt />
          </button>
        )}
        {remoteSocketId ? (
        <div className="absolute top-[-77vh] w-[30vw] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-[1.6vw] md:text-3xl font-semibold bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/30 shadow-lg text-center z-50">
         {username.name} Connected
        </div>
      ) : (
        <div className="absolute top-[-74vh] w-[30vw] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl md:text-3xl font-semibold bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/30 shadow-lg text-center z-50">
          No one in the room yet
          <br />
          <span className="text-sm opacity-80">
            Waiting for your crush to join
            <span className="relative w-5 inline-block text-lg font-bold after:content-['.'] after:animate-dots after:inline-block after:whitespace-pre"></span>
          </span>
        </div>
      )}

  
      <button
        onClick={handleEndCall}
        className="text-red-400 hover:text-red-600 text-3xl transition-transform hover:scale-110"
      >
        <FaPhoneSlash />
      </button>
      </div>
  
      {/* My Stream - Corner Preview */}
      {myStream && (
        <div className="absolute bottom-6 right-6 w-[200px] rounded-xl bg-white/20 border border-white/30 p-2 backdrop-blur-md shadow-lg z-30">
          <h2 className="text-white text-xs font-medium text-center mb-2 tracking-wide">My Stream</h2>
          <div className="rounded-lg overflow-hidden">
            <ReactPlayer
              playing
              muted
              url={myStream}
              height="120px"
              width="100%"
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
  
};

export default RoomPage;
