import { useParams, useNavigate } from "react-router-dom";

export default function Lesson() {
  const { topic } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <button
        onClick={() => navigate("/roadmap")}
        className="text-indigo-400 mb-6"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold text-indigo-400">
        {topic}
      </h1>

      <div className="mt-6 p-6 bg-white/5 rounded-xl">
        <p className="text-gray-300">
          Learn {topic} properly before moving to practice.
        </p>
      </div>

      <button
        onClick={() => navigate(`/practice/${topic}`)}
        className="mt-10 w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl"
      >
        🚀 Start Practice
      </button>

    </div>
  );
}