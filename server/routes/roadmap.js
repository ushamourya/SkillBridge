import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function Roadmap() {
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState([]);
  const [progress, setProgress] = useState([]);

  /* ======================
     GET ROADMAP (DB)
  ====================== */
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await API.get(`/roadmap/${id}`);

        console.log("ROADMAP DATA:", res.data);

        setData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log("Roadmap error:", err);
        setData([]);
      }
    };

    fetchRoadmap();
  }, [id]);

  /* ======================
     GET PROGRESS
  ====================== */
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.id) return;

      try {
        const res = await API.get(`/progress/${user.id}`);
        setProgress(res.data || []);
      } catch (err) {
        console.log("Progress error:", err);
        setProgress([]);
      }
    };

    fetchProgress();
  }, [user?.id]);

  /* ======================
     CHECK LEVEL DONE
  ====================== */
  const isDone = (level_id) =>
    progress.some((p) => Number(p.level_id) === Number(level_id));

  /* ======================
     MARK LEVEL COMPLETE
  ====================== */
  const markComplete = async (level_id) => {
    try {
      await API.post("/progress", {
        user_id: user.id,
        level_id,
        status: 1,
      });

      const res = await API.get(`/progress/${user.id}`);
      setProgress(res.data || []);
    } catch (err) {
      console.log("Progress save error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-3xl text-indigo-400 mb-6">
        🚀 Roadmap
      </h1>

      {data.length === 0 && (
        <p className="text-gray-400">No roadmap found</p>
      )}

      {data.map((level) => {
        const done = isDone(level.level_id);

        return (
          <div
            key={level.level_id}
            className="p-5 border border-white/10 rounded mb-4 bg-white/5"
          >

            {/* LEVEL TITLE */}
            <h2 className={`text-xl font-bold ${done ? "text-green-400" : "text-white"}`}>
              {done ? "✅" : "🔓"} {level.level_name}
            </h2>

            {/* QUESTIONS */}
            <div className="mt-3">
              {level.questions?.length > 0 ? (
                level.questions.map((q, i) => (
                  <div key={i} className="mt-2">
                    <p className="text-yellow-400">
                      ❓ {q.question}
                    </p>
                    <p className="text-gray-400 text-sm">
                      💡 {q.answer}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No questions available</p>
              )}
            </div>

            {/* PRACTICE */}
            {level.questions?.[0]?.practice && (
              <p className="text-gray-300 mt-3">
                🧪 Practice: {level.questions[0].practice}
              </p>
            )}

            {/* COMPLETE BUTTON */}
            <button
              onClick={() => markComplete(level.level_id)}
              className="mt-4 bg-blue-600 px-4 py-1 rounded"
            >
              Mark Complete
            </button>

          </div>
        );
      })}
    </div>
  );
}