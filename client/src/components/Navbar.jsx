export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-10 py-5 border-b border-white/10">

      {/* Logo */}
      <h1 className="text-indigo-400 font-bold text-xl">
        LearnPath AI
      </h1>

      {/* Links */}
      <div className="flex items-center space-x-6 text-gray-300">

        <a className="hover:text-white" href="/">Home</a>
        <a className="hover:text-white" href="/dashboard">Dashboard</a>

        {/* Buttons */}
        <a
          href="/login"
          className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10"
        >
          Login
        </a>

        <a
          href="/register"
          className="px-4 py-2 bg-indigo-600 rounded-lg hover:scale-105 transition"
        >
          Register
        </a>

      </div>
    </div>
  );
}