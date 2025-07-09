export default function Features() {
    const features = [
      { title: 'Profiles', icon: '👤' },
      { title: 'Instant Messaging', icon: '💬' },
      { title: 'Audio Messages', icon: '🎙️' },
      { title: 'Emoji Sender', icon: '😊' },
      { title: 'Live Video Calling', icon: '📹' },
      { title: 'Vulgarity Detector', icon: '🚫' }
    ];
  
    return (
      <section className="w-full min-h-[100vh] bg-gradient-to-b from-purple-900 to-purple-700 flex flex-col items-center justify-center px-[5vw] py-[5vh] gap-8">
        <h2 className="text-4xl text-white font-bold tracking-wider">🔥 NexLink Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {features.map((feat, idx) => (
            <div key={idx} className="bg-purple-500 bg-opacity-20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:scale-105 transition">
              <span className="text-5xl">{feat.icon}</span>
              <h3 className="text-xl font-semibold text-white">{feat.title}</h3>
            </div>
          ))}
        </div>
      </section>
    );
  }
  