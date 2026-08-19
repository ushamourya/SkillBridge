import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

export default function Roadmap() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  /* =====================================================
     STATE
  ===================================================== */

  const [roadmap, setRoadmap] = useState([]);
  const [progress, setProgress] = useState([]);

  const [answers, setAnswers] = useState({});
  const [completedQuestions, setCompletedQuestions] =
    useState({});

  const [currentLevelIndex, setCurrentLevelIndex] =
    useState(0);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* =====================================================
     ROADMAP FINISHED
  ===================================================== */

  const [roadmapFinished, setRoadmapFinished] =
    useState(false);

  /* =====================================================
     LOAD ROADMAP
  ===================================================== */

  useEffect(() => {
    if (!id) {
      setError("Roadmap ID is missing");
      setLoading(false);
      return;
    }

    const loadRoadmap = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          `/roadmap/${id}`
        );

        console.log(
          "ROADMAP API RESPONSE:",
          response.data
        );

        if (Array.isArray(response.data)) {
          setRoadmap(response.data);
        } else {
          setRoadmap([]);
        }
      } catch (err) {
        console.error(
          "ROADMAP ERROR:",
          err
        );

        setError(
          "Failed to load roadmap."
        );

        setRoadmap([]);
      } finally {
        setLoading(false);
      }
    };

    loadRoadmap();
  }, [id]);

  /* =====================================================
     LOAD USER PROGRESS
  ===================================================== */

  useEffect(() => {
    if (!user?.id) return;

    const loadProgress = async () => {
      try {
        const response = await API.get(
          `/progress/${user.id}`
        );

        setProgress(
          response.data || []
        );
      } catch (err) {
        console.error(
          "Progress error:",
          err
        );
      }
    };

    loadProgress();
  }, [user?.id]);

  /* =====================================================
     CURRENT LEVEL
  ===================================================== */

  const currentLevel =
    roadmap[currentLevelIndex];

  /* =====================================================
     CURRENT QUESTIONS
  ===================================================== */

  const currentQuestions =
    currentLevel?.questions || [];

  /* =====================================================
     CURRENT QUESTION
  ===================================================== */

  const currentQuestion =
    currentQuestions[
      currentQuestionIndex
    ];

  /* =====================================================
     CHECK LEVEL COMPLETED
  ===================================================== */

  const isLevelCompleted = (levelId) => {
    return progress.some(
      (p) =>
        Number(p.level_id) ===
          Number(levelId) &&
        Number(p.status) === 1
    );
  };

  /* =====================================================
     CHECK ENTIRE ROADMAP COMPLETED
  ===================================================== */

  const isRoadmapCompleted = () => {
    if (
      roadmap.length === 0 ||
      progress.length === 0
    ) {
      return false;
    }

    return roadmap.every(
      (level) =>
        isLevelCompleted(
          level.level_id
        )
    );
  };

  /* =====================================================
     SHOW MESSAGE
  ===================================================== */

  const showMessage = (
    text,
    type
  ) => {
    setMessage(text);
    setMessageType(type);
  };

  /* =====================================================
     SUBMIT QUESTION
  ===================================================== */

  const submitQuestion = () => {
    if (!currentQuestion) {
      return;
    }

    const questionId =
      currentQuestion.id;

    const userAnswer =
      answers[questionId] || "";

    if (!userAnswer.trim()) {
      showMessage(
        "⚠️ Please write an answer first.",
        "warning"
      );

      return;
    }

    const userValue =
      userAnswer
        .trim()
        .toLowerCase();

    const expectedValue =
      String(
        currentQuestion.answer || ""
      )
        .trim()
        .toLowerCase();

    /* ================================
       CORRECT
    ================================= */

    if (
      userValue ===
      expectedValue
    ) {
      setCompletedQuestions(
        (previous) => ({
          ...previous,
          [questionId]: true,
        })
      );

      showMessage(
        "✅ Correct answer! Great job!",
        "success"
      );

      return;
    }

    /* ================================
       WRONG
    ================================= */

    showMessage(
      "❌ Wrong answer. Try again.",
      "error"
    );
  };

  /* =====================================================
     NEXT QUESTION
  ===================================================== */

  const nextQuestion = () => {
    setMessage("");
    setMessageType("");

    /* ================================
       MORE QUESTIONS
    ================================= */

    if (
      currentQuestionIndex <
      currentQuestions.length - 1
    ) {
      setCurrentQuestionIndex(
        (previous) =>
          previous + 1
      );

      return;
    }

    /* ================================
       LAST QUESTION
    ================================= */

    if (
      currentLevel &&
      !isLevelCompleted(
        currentLevel.level_id
      )
    ) {
      showMessage(
        "🎉 All questions completed! Mark the level complete below.",
        "success"
      );

      return;
    }

    /* ================================
       NEXT LEVEL
    ================================= */

    if (
      currentLevelIndex <
      roadmap.length - 1
    ) {
      setCurrentLevelIndex(
        (previous) =>
          previous + 1
      );

      setCurrentQuestionIndex(0);

      setMessage("");
      setMessageType("");

      return;
    }

    /* ================================
       ROADMAP FINISHED
    ================================= */

    setRoadmapFinished(true);

    showMessage(
      "🎉 Congratulations! You completed the entire roadmap!",
      "success"
    );
  };

  /* =====================================================
     PREVIOUS QUESTION
  ===================================================== */

  const previousQuestion = () => {
    setMessage("");
    setMessageType("");

    if (
      currentQuestionIndex > 0
    ) {
      setCurrentQuestionIndex(
        (previous) =>
          previous - 1
      );

      return;
    }

    if (
      currentLevelIndex > 0
    ) {
      const previousLevel =
        roadmap[
          currentLevelIndex - 1
        ];

      const previousQuestions =
        previousLevel?.questions ||
        [];

      setCurrentLevelIndex(
        (previous) =>
          previous - 1
      );

      setCurrentQuestionIndex(
        Math.max(
          previousQuestions.length - 1,
          0
        )
      );
    }
  };

  /* =====================================================
     MARK LEVEL COMPLETE
  ===================================================== */

  const markComplete = async () => {
    if (!user?.id) {
      showMessage(
        "⚠️ Please login first.",
        "warning"
      );

      return;
    }

    if (!currentLevel) {
      return;
    }

    try {
      await API.post(
        "/progress",
        {
          user_id: user.id,

          level_id:
            currentLevel.level_id,

          topic:
            currentLevel.level_name,

          step_index:
            currentLevel.order_index ||
            0,

          status: 1,
        }
      );

      const response =
        await API.get(
          `/progress/${user.id}`
        );

      const updatedProgress =
        response.data || [];

      setProgress(
        updatedProgress
      );

      /* =========================================
         CHECK IF WHOLE ROADMAP IS FINISHED
      ========================================= */

      const allCompleted =
        roadmap.every(
          (level) => {
            if (
              Number(
                level.level_id
              ) ===
              Number(
                currentLevel.level_id
              )
            ) {
              return true;
            }

            return updatedProgress.some(
              (p) =>
                Number(
                  p.level_id
                ) ===
                  Number(
                    level.level_id
                  ) &&
                Number(
                  p.status
                ) === 1
            );
          }
        );

      /* =========================================
         ROADMAP COMPLETE 🎉
      ========================================= */

      if (allCompleted) {
        setRoadmapFinished(true);

        showMessage(
          "🏆 Amazing! You completed the entire roadmap!",
          "success"
        );

        return;
      }

      /* =========================================
         LEVEL COMPLETE
      ========================================= */

      showMessage(
        "🎉 Level completed!",
        "success"
      );

      /* =========================================
         MOVE TO NEXT LEVEL
      ========================================= */

      if (
        currentLevelIndex <
        roadmap.length - 1
      ) {
        setTimeout(() => {
          setCurrentLevelIndex(
            (previous) =>
              previous + 1
          );

          setCurrentQuestionIndex(0);

          setMessage("");
          setMessageType("");
        }, 800);
      }
    } catch (err) {
      console.error(
        "Complete error:",
        err
      );

      showMessage(
        "❌ Failed to save progress.",
        "error"
      );
    }
  };

  /* =====================================================
     LEVEL PROGRESS
  ===================================================== */

  const totalQuestions =
    currentQuestions.length;

  const questionNumber =
    currentQuestionIndex + 1;

  const questionProgress =
    totalQuestions > 0
      ? Math.round(
          (questionNumber /
            totalQuestions) *
            100
        )
      : 0;

  /* =====================================================
     OVERALL PROGRESS
  ===================================================== */

  const completedLevels =
    roadmap.filter(
      (level) =>
        isLevelCompleted(
          level.level_id
        )
    ).length;

  const overallProgress =
    roadmap.length > 0
      ? Math.round(
          (completedLevels /
            roadmap.length) *
            100
        )
      : 0;

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="
        min-h-screen
        bg-[#050505]
        text-white
        flex
        items-center
        justify-center
      ">
        <div className="text-center">

          <div className="
            w-14
            h-14
            border-4
            border-indigo-500/20
            border-t-indigo-500
            rounded-full
            animate-spin
            mx-auto
            mb-5
          " />

          <p className="
            text-xl
            text-indigo-400
            font-semibold
          ">
            Loading roadmap...
          </p>

        </div>
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
        bg-[#050505]
        text-white
        p-6
        md:p-10
      ">
        <div className="max-w-4xl mx-auto">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="
              mb-8
              text-gray-400
              hover:text-white
              transition
            "
          >
            ← Back to Dashboard
          </button>

          <div className="
            rounded-2xl
            border
            border-red-500/30
            bg-red-500/5
            p-8
          ">
            <h1 className="
              text-3xl
              text-red-400
              font-bold
            ">
              Error
            </h1>

            <p className="
              text-gray-400
              mt-4
            ">
              {error}
            </p>

            <p className="
              text-gray-600
              mt-2
            ">
              Roadmap ID: {id}
            </p>
          </div>

        </div>
      </div>
    );
  }

  /* =====================================================
     NO ROADMAP
  ===================================================== */

  if (roadmap.length === 0) {
    return (
      <div className="
        min-h-screen
        bg-[#050505]
        text-white
        flex
        items-center
        justify-center
        p-6
      ">
        <div className="
          text-center
          max-w-lg
        ">

          <div className="
            text-6xl
            mb-6
          ">
            🛣️
          </div>

          <h1 className="
            text-3xl
            font-bold
            text-indigo-400
          ">
            No Roadmap Found
          </h1>

          <p className="
            text-gray-500
            mt-4
          ">
            No levels are available for
            this roadmap yet.
          </p>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="
              mt-7
              px-6
              py-3
              rounded-xl
              bg-indigo-600
              hover:bg-indigo-500
              font-semibold
              transition
            "
          >
            ← Back to Dashboard
          </button>

        </div>
      </div>
    );
  }

  /* =====================================================
     FINAL REWARD SCREEN 🏆
  ===================================================== */

  if (roadmapFinished) {
    return (
      <div className="
        min-h-screen
        bg-[#050505]
        text-white
        flex
        items-center
        justify-center
        p-6
        relative
        overflow-hidden
      ">

        {/* BACKGROUND GLOW */}

        <div className="
          absolute
          top-10
          left-1/4
          w-96
          h-96
          bg-yellow-500/10
          blur-[120px]
          rounded-full
        " />

        <div className="
          absolute
          bottom-10
          right-1/4
          w-96
          h-96
          bg-purple-500/10
          blur-[120px]
          rounded-full
        " />

        <div className="
          relative
          max-w-2xl
          w-full
          text-center
        ">

          {/* TROPHY */}

          <div className="
            text-7xl
            md:text-8xl
            mb-6
            animate-bounce
          ">
            🏆
          </div>

          <p className="
            text-yellow-400
            font-bold
            tracking-widest
            text-sm
            mb-3
          ">
            ACHIEVEMENT UNLOCKED
          </p>

          <h1 className="
            text-4xl
            md:text-6xl
            font-black
            mb-5
          ">
            Roadmap Master
          </h1>

          <p className="
            text-gray-400
            text-lg
            md:text-xl
            leading-relaxed
            mb-10
          ">
            You completed every level and
            challenge in this roadmap.
            Great work! 🚀
          </p>


          {/* BADGE */}

          <div className="
            mx-auto
            w-56
            h-56
            rounded-full
            bg-gradient-to-br
            from-yellow-300
            via-yellow-500
            to-orange-600
            p-2
            shadow-2xl
            shadow-yellow-500/20
          ">

            <div className="
              w-full
              h-full
              rounded-full
              bg-[#111]
              border-4
              border-yellow-400/40
              flex
              flex-col
              items-center
              justify-center
            ">

              <div className="
                text-6xl
                mb-2
              ">
                🏆
              </div>

              <p className="
                text-yellow-400
                font-black
                text-xl
              ">
                ROADMAP
              </p>

              <p className="
                text-white
                font-bold
                text-lg
              ">
                MASTER
              </p>

            </div>

          </div>


          {/* REWARD TEXT */}

          <div className="
            mt-10
            p-5
            rounded-2xl
            bg-yellow-500/5
            border
            border-yellow-500/20
          ">

            <p className="
              text-yellow-400
              font-bold
            ">
              🎖️ Badge Earned
            </p>

            <p className="
              text-gray-400
              text-sm
              mt-2
            ">
              Roadmap Master — Completed
              100% of your learning journey.
            </p>

          </div>


          {/* BUTTONS */}

          <div className="
            flex
            flex-col
            sm:flex-row
            justify-center
            gap-4
            mt-8
          ">

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="
                px-7
                py-3
                rounded-xl
                bg-indigo-600
                hover:bg-indigo-500
                font-bold
                transition
                hover:scale-105
              "
            >
              📊 Go to Dashboard
            </button>

            <button
              onClick={() => {
                setRoadmapFinished(false);
                setCurrentLevelIndex(0);
                setCurrentQuestionIndex(0);
              }}
              className="
                px-7
                py-3
                rounded-xl
                bg-white/5
                border
                border-white/10
                text-gray-300
                hover:bg-white/10
                transition
              "
            >
              🔄 Review Roadmap
            </button>

          </div>

        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <div className="
      min-h-screen
      bg-[#050505]
      text-white
      p-5
      md:p-10
    ">

      <div className="
        max-w-5xl
        mx-auto
      ">

        {/* TOP NAVIGATION */}

        <div className="
          flex
          items-center
          justify-between
          mb-8
        ">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="
              flex
              items-center
              gap-2
              text-gray-400
              hover:text-white
              transition
            "
          >
            ← Dashboard
          </button>

          <span className="
            text-sm
            text-gray-500
          ">
            Roadmap {id}
          </span>

        </div>


        {/* HEADER */}

        <div className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-indigo-500/20
          bg-gradient-to-br
          from-indigo-950/50
          via-purple-950/30
          to-black
          p-7
          md:p-10
          mb-8
        ">

          <div className="
            absolute
            -top-32
            -right-32
            w-80
            h-80
            bg-indigo-500/20
            blur-[110px]
            rounded-full
          " />

          <div className="relative">

            <p className="
              text-indigo-400
              text-sm
              font-semibold
              mb-2
            ">
              YOUR LEARNING JOURNEY
            </p>

            <h1 className="
              text-3xl
              md:text-5xl
              font-bold
              mb-4
            ">
              🚀 Learning Roadmap
            </h1>

            <p className="
              text-gray-400
              text-lg
            ">
              Learn step by step and
              complete each challenge.
            </p>


            {/* OVERALL PROGRESS */}

            <div className="mt-7">

              <div className="
                flex
                justify-between
                text-sm
                mb-2
              ">

                <span className="text-gray-400">
                  Overall Progress
                </span>

                <span className="
                  text-indigo-400
                  font-bold
                ">
                  {overallProgress}%
                </span>

              </div>

              <div className="
                h-2
                bg-white/10
                rounded-full
                overflow-hidden
              ">

                <div
                  className="
                    h-full
                    bg-gradient-to-r
                    from-indigo-500
                    to-purple-500
                    rounded-full
                    transition-all
                    duration-500
                  "
                  style={{
                    width:
                      `${overallProgress}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>


        {/* LEVEL NAVIGATION */}

        <div className="
          flex
          gap-2
          overflow-x-auto
          pb-3
          mb-8
        ">

          {roadmap.map(
            (level, index) => {

              const completed =
                isLevelCompleted(
                  level.level_id
                );

              const active =
                index ===
                currentLevelIndex;

              return (
                <button
                  key={
                    level.level_id
                  }
                  onClick={() => {

                    setCurrentLevelIndex(
                      index
                    );

                    setCurrentQuestionIndex(
                      0
                    );

                    setMessage("");
                    setMessageType("");

                  }}
                  className={`
                    flex
                    items-center
                    gap-2
                    whitespace-nowrap
                    px-4
                    py-2.5
                    rounded-xl
                    border
                    transition
                    ${
                      active
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : completed
                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                        : "bg-white/[0.03] border-white/10 text-gray-400 hover:text-white"
                    }
                  `}
                >

                  <span>
                    {completed
                      ? "✅"
                      : index + 1}
                  </span>

                  <span>
                    {level.level_name}
                  </span>

                </button>
              );
            }
          )}

        </div>


        {/* CURRENT LEVEL */}

        {currentLevel && (

          <div className="
            rounded-3xl
            border
            border-white/10
            bg-white/[0.025]
            overflow-hidden
          ">

            {/* LEVEL HEADER */}

            <div className="
              p-6
              md:p-8
              border-b
              border-white/10
              bg-white/[0.02]
            ">

              <div className="
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-4
              ">

                <div>

                  <p className="
                    text-indigo-400
                    text-sm
                    font-semibold
                    mb-2
                  ">
                    LEVEL {currentLevel.order_index}
                  </p>

                  <h2 className="
                    text-2xl
                    md:text-3xl
                    font-bold
                  ">
                    {isLevelCompleted(
                      currentLevel.level_id
                    )
                      ? "✅ "
                      : "📚 "}
                    {currentLevel.level_name}
                  </h2>

                </div>

                {isLevelCompleted(
                  currentLevel.level_id
                ) && (

                  <span className="
                    px-4
                    py-2
                    rounded-full
                    bg-green-500/10
                    border
                    border-green-500/20
                    text-green-400
                    text-sm
                    font-semibold
                  ">
                    Completed ✓
                  </span>

                )}

              </div>


              {/* QUESTION PROGRESS */}

              {totalQuestions > 0 && (

                <div className="mt-6">

                  <div className="
                    flex
                    justify-between
                    text-sm
                    mb-2
                  ">

                    <span className="
                      text-gray-400
                    ">
                      Question{" "}
                      {questionNumber}{" "}
                      of{" "}
                      {totalQuestions}
                    </span>

                    <span className="
                      text-indigo-400
                      font-semibold
                    ">
                      {questionProgress}%
                    </span>

                  </div>

                  <div className="
                    h-2
                    bg-white/10
                    rounded-full
                    overflow-hidden
                  ">

                    <div
                      className="
                        h-full
                        bg-gradient-to-r
                        from-indigo-500
                        to-cyan-400
                        rounded-full
                        transition-all
                        duration-500
                      "
                      style={{
                        width:
                          `${questionProgress}%`,
                      }}
                    />

                  </div>

                </div>

              )}

            </div>


            {/* QUESTION */}

            <div className="p-6 md:p-10">

              {!currentQuestion ? (

                <div className="
                  text-center
                  py-10
                ">

                  <div className="
                    text-5xl
                    mb-5
                  ">
                    📚
                  </div>

                  <p className="
                    text-gray-400
                  ">
                    No questions available
                    for this level.
                  </p>

                </div>

              ) : (

                <>

                  <div className="
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    rounded-full
                    bg-indigo-500/10
                    border
                    border-indigo-500/20
                    text-indigo-400
                    text-sm
                    font-semibold
                    mb-5
                  ">
                    Question{" "}
                    {questionNumber}
                  </div>


                  <h3 className="
                    text-2xl
                    md:text-3xl
                    font-bold
                    leading-relaxed
                    mb-8
                  ">

                    <span className="
                      text-pink-500
                      mr-2
                    ">
                      ❓
                    </span>

                    {currentQuestion.question}

                  </h3>


                  {/* ANSWER */}

                  <div>

                    <label className="
                      block
                      text-sm
                      text-gray-400
                      mb-2
                    ">
                      Your Answer
                    </label>

                    <input
                      type="text"
                      placeholder="Write your answer..."
                      value={
                        answers[
                          currentQuestion.id
                        ] || ""
                      }
                      onChange={(e) =>
                        setAnswers({
                          ...answers,
                          [currentQuestion.id]:
                            e.target.value,
                        })
                      }
                      onKeyDown={(e) => {

                        if (
                          e.key === "Enter"
                        ) {
                          submitQuestion();
                        }

                      }}
                      className="
                        w-full
                        bg-black
                        text-white
                        p-4
                        rounded-xl
                        border
                        border-white/10
                        outline-none
                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-500/10
                        transition
                      "
                    />

                  </div>


                  {/* MESSAGE */}

                  {message && (

                    <div
                      className={`
                        mt-5
                        p-4
                        rounded-xl
                        border
                        font-semibold
                        ${
                          messageType ===
                          "success"
                            ? "bg-green-500/10 border-green-500/30 text-green-400"
                            : messageType ===
                              "warning"
                            ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                            : "bg-red-500/10 border-red-500/30 text-red-400"
                        }
                      `}
                    >
                      {message}
                    </div>

                  )}


                  {/* PRACTICE */}

                  {currentQuestion.practice && (

                    <div className="
                      mt-6
                      p-5
                      rounded-xl
                      bg-cyan-500/5
                      border
                      border-cyan-500/20
                    ">

                      <p className="
                        text-cyan-400
                        font-semibold
                        mb-2
                      ">
                        💻 Practice
                      </p>

                      <p className="
                        text-gray-400
                        leading-relaxed
                      ">
                        {currentQuestion.practice}
                      </p>

                    </div>

                  )}


                  {/* TYPE */}

                  {currentQuestion.type && (

                    <p className="
                      text-gray-600
                      text-sm
                      mt-5
                    ">
                      Type:{" "}
                      {currentQuestion.type}
                    </p>

                  )}


                  {/* CONTROLS */}

                  <div className="
                    flex
                    flex-col-reverse
                    sm:flex-row
                    items-stretch
                    sm:items-center
                    justify-between
                    gap-3
                    mt-8
                    pt-6
                    border-t
                    border-white/10
                  ">

                    <button
                      onClick={
                        previousQuestion
                      }
                      disabled={
                        currentLevelIndex ===
                          0 &&
                        currentQuestionIndex ===
                          0
                      }
                      className="
                        px-6
                        py-3
                        rounded-xl
                        bg-white/5
                        border
                        border-white/10
                        text-gray-300
                        hover:bg-white/10
                        disabled:opacity-30
                        disabled:cursor-not-allowed
                        transition
                      "
                    >
                      ← Previous
                    </button>


                    <div className="
                      flex
                      flex-col
                      sm:flex-row
                      gap-3
                    ">

                      {!completedQuestions[
                        currentQuestion.id
                      ] && (

                        <button
                          onClick={
                            submitQuestion
                          }
                          className="
                            px-7
                            py-3
                            rounded-xl
                            bg-green-600
                            hover:bg-green-500
                            font-bold
                            shadow-lg
                            shadow-green-600/10
                            transition
                            hover:scale-105
                          "
                        >
                          Submit Answer ✓
                        </button>

                      )}


                      {completedQuestions[
                        currentQuestion.id
                      ] && (

                        <button
                          onClick={
                            nextQuestion
                          }
                          className="
                            px-7
                            py-3
                            rounded-xl
                            bg-indigo-600
                            hover:bg-indigo-500
                            font-bold
                            shadow-lg
                            shadow-indigo-600/20
                            transition
                            hover:scale-105
                          "
                        >

                          {currentQuestionIndex <
                          currentQuestions.length - 1
                            ? "Next Question →"
                            : currentLevelIndex <
                              roadmap.length - 1
                            ? "Complete & Next Level →"
                            : "Finish Roadmap 🎉"}

                        </button>

                      )}

                    </div>

                  </div>


                  {/* COMPLETE LEVEL */}

                  {currentQuestionIndex ===
                    currentQuestions.length - 1 &&
                    completedQuestions[
                      currentQuestion.id
                    ] &&
                    !isLevelCompleted(
                      currentLevel.level_id
                    ) && (

                      <div className="
                        mt-8
                        p-6
                        rounded-2xl
                        bg-indigo-500/5
                        border
                        border-indigo-500/20
                        text-center
                      ">

                        <div className="
                          text-4xl
                          mb-3
                        ">
                          🎉
                        </div>

                        <h3 className="
                          text-xl
                          font-bold
                          mb-2
                        ">
                          You completed all
                          questions!
                        </h3>

                        <p className="
                          text-gray-500
                          mb-5
                        ">
                          Mark this level as
                          completed to continue.
                        </p>

                        <button
                          onClick={
                            markComplete
                          }
                          className="
                            px-7
                            py-3
                            rounded-xl
                            bg-gradient-to-r
                            from-indigo-600
                            to-purple-600
                            hover:from-indigo-500
                            hover:to-purple-500
                            font-bold
                            transition
                          "
                        >
                          🎯 Mark Level Complete
                        </button>

                      </div>

                  )}

                </>

              )}

            </div>

          </div>

        )}

      </div>

    </div>
  );
}