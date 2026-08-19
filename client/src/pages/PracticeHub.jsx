import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import API from "../api";

export default function PracticeHub() {

  const navigate = useNavigate();
  const location = useLocation();

  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* =====================================================
     BACK BUTTON
  ===================================================== */

  const goBack = () => {

    const from =
      location.state?.from || "/dashboard";

    navigate(from, {
      replace: true,
    });

  };


  /* =====================================================
     LOAD PRACTICES
  ===================================================== */

  useEffect(() => {

    const loadPractices = async () => {

      try {

        setLoading(true);
        setError("");

        const res = await API.get("/practice");

        console.log(
          "PRACTICE HUB DATA:",
          res.data
        );

        setPractices(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      } catch (err) {

        console.error(
          "PRACTICE HUB ERROR:",
          err
        );

        setError(
          "Failed to load practice topics."
        );

      } finally {

        setLoading(false);

      }

    };

    loadPractices();

  }, []);


  /* =====================================================
     UNIQUE TOPICS
  ===================================================== */

  const topics = [];

  const seenTopics = new Set();

  practices.forEach((practice) => {

    if (
      !practice.topic ||
      seenTopics.has(practice.topic)
    ) {
      return;
    }

    seenTopics.add(
      practice.topic
    );

    topics.push(
      practice
    );

  });


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (
      <div className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
      ">

        <p className="
          text-xl
          text-indigo-400
        ">
          Loading practice...
        </p>

      </div>
    );

  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {

    return (
      <div className="
        min-h-screen
        bg-black
        text-white
        p-6
        md:p-10
      ">

        <div className="
          max-w-5xl
          mx-auto
        ">

          <button
            onClick={goBack}
            className="
              mb-6
              px-5
              py-2.5
              rounded-lg
              bg-white/5
              border
              border-white/10
              text-gray-300
              hover:text-white
              hover:bg-white/10
              hover:border-indigo-500/40
              transition
              font-semibold
            "
          >
            ← Back
          </button>

          <h1 className="
            text-3xl
            text-red-400
          ">
            Error
          </h1>

          <p className="
            text-gray-400
            mt-4
          ">
            {error}
          </p>

        </div>

      </div>
    );

  }


  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="
      min-h-screen
      bg-black
      text-white
      p-6
      md:p-10
    ">

      <div className="
        max-w-5xl
        mx-auto
      ">


        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          onClick={goBack}
          className="
            mb-6
            px-5
            py-2.5
            rounded-lg
            bg-white/5
            border
            border-white/10
            text-gray-300
            hover:text-white
            hover:bg-white/10
            hover:border-indigo-500/40
            transition
            font-semibold
          "
        >
          ← Back
        </button>


        {/* =================================================
            HEADER
        ================================================= */}

        <h1 className="
          text-4xl
          font-bold
          text-indigo-400
          mb-4
        ">
          ⚡ Practice Hub
        </h1>

        <p className="
          text-gray-400
          mb-10
        ">
          Choose a topic and solve coding problems.
        </p>


        {/* =================================================
            NO TOPICS
        ================================================= */}

        {topics.length === 0 ? (

          <div className="
            bg-gray-900
            border
            border-gray-700
            rounded-xl
            p-8
          ">

            <p className="text-gray-400">
              No practice topics available yet.
            </p>

          </div>

        ) : (

          /* =================================================
             TOPIC GRID
          ================================================= */

          <div className="
            grid
            md:grid-cols-2
            gap-5
          ">

            {topics.map((topic) => (

              <div
                key={topic.topic}

                onClick={() =>
                  navigate(
                    `/practice/${encodeURIComponent(
                      topic.topic
                    )}`,
                    {
                      state: {
                        from: "/practice-hub",
                      },
                    }
                  )
                }

                className="
                  p-6
                  bg-gray-900
                  border
                  border-gray-700
                  rounded-xl
                  cursor-pointer
                  hover:border-indigo-500
                  hover:bg-gray-800
                  hover:-translate-y-1
                  transition
                  duration-200
                "
              >

                {/* ICON */}

                <div className="
                  text-3xl
                  mb-3
                ">
                  {getIcon(topic.topic)}
                </div>


                {/* TOPIC */}

                <h2 className="
                  text-xl
                  font-bold
                ">
                  {topic.topic}
                </h2>


                {/* DESCRIPTION */}

                <p className="
                  text-gray-400
                  mt-2
                ">
                  Start coding practice →
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}


/* =====================================================
   ICON
===================================================== */

function getIcon(topic) {

  const value =
    String(topic)
      .toLowerCase();


  if (value.includes("html")) {
    return "🌐";
  }

  if (value.includes("css")) {
    return "🎨";
  }

  if (
    value.includes("javascript") ||
    value.includes("js")
  ) {
    return "⚡";
  }

  if (value.includes("react")) {
    return "⚛️";
  }

  if (value.includes("python")) {
    return "🐍";
  }

  if (value.includes("java")) {
    return "☕";
  }

  if (
    value.includes("sql") ||
    value.includes("database")
  ) {
    return "🗄️";
  }

  return "💻";
}