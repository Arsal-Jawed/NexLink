export default function Footer() {
    return (
      <footer className="w-full bg-purple-950 text-white py-[3vh] px-[5vw] flex flex-col items-center justify-center gap-3">
        <p className="text-lg">© {new Date().getFullYear()} NexLink - made by AREX with 💜</p>
        <div className="flex gap-4 text-xl">
          <a href="#" className="hover:text-purple-400 transition">Instagram</a>
          <a href="#" className="hover:text-purple-400 transition">Twitter</a>
          <a href="#" className="hover:text-purple-400 transition">Discord</a>
        </div>
      </footer>
    );
  }
  