export default function AlgoDesign() {
    return (
      <section className="w-full min-h-[100vh] bg-gradient-to-b from-purple-700 to-purple-500 flex flex-col items-center justify-center px-[5vw] py-[5vh] text-white">
        <h2 className="text-4xl font-bold mb-6">💡 Smart Auto Connect</h2>
        <p className="text-center max-w-3xl text-lg mb-10">
          NexLink uses a real-time algorithm to instantly match users into chat or video rooms based on availability and preferences. Like Tinder but for deep convos, not just thirst traps. 😏
        </p>
        <div className="w-full max-w-5xl flex flex-wrap justify-center gap-6">
          <div className="bg-purple-300 bg-opacity-20 w-[30vw] min-w-[250px] h-[30vh] rounded-3xl flex items-center justify-center text-xl font-semibold hover:rotate-3 transition">
            Room Discovery AI 🤖
          </div>
          <div className="bg-purple-300 bg-opacity-20 w-[30vw] min-w-[250px] h-[30vh] rounded-3xl flex items-center justify-center text-xl font-semibold hover:-rotate-3 transition">
            Fastest Match Logic ⚡
          </div>
          <div className="bg-purple-300 bg-opacity-20 w-[30vw] min-w-[250px] h-[30vh] rounded-3xl flex items-center justify-center text-xl font-semibold hover:rotate-6 transition">
            Auto-Reconnect Magic ✨
          </div>
        </div>
      </section>
    );
  }
  