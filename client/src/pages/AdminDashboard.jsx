import { useEffect, useState } from "react";
import API from "../api";

/* =====================================================
   TOAST
===================================================== */

function Toast({ message, type = "success" }) {
  if (!message) return null;

  return (
    <div
      className={`fixed top-5 right-5 px-5 py-3 rounded-lg shadow-lg z-50 ${
        type === "error"
          ? "bg-red-600"
          : "bg-green-600"
      }`}
    >
      {message}
    </div>
  );
}

/* =====================================================
   CARD
===================================================== */

function Card({
  children,
  active = false,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all ${
        onClick
          ? "cursor-pointer"
          : ""
      } ${
        active
          ? "bg-indigo-600 border-indigo-400"
          : "bg-[#0b0b0b] border-white/10 hover:border-indigo-500"
      }`}
    >
      {children}
    </div>
  );
}

/* =====================================================
   INPUT
===================================================== */

function Input(props) {
  return (
    <input
      {...props}
      className="w-full p-3 mb-3 bg-black border border-white/10 rounded-lg text-sm outline-none focus:border-indigo-500"
    />
  );
}

/* =====================================================
   TEXTAREA
===================================================== */

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full p-3 mb-3 bg-black border border-white/10 rounded-lg text-sm outline-none focus:border-indigo-500 min-h-[100px] resize-y"
    />
  );
}

/* =====================================================
   BUTTON
===================================================== */

function Button({
  children,
  danger = false,
  ...props
}) {
  return (
    <button
      type="button"
      {...props}
      className={`px-4 py-2 text-sm rounded-lg transition disabled:opacity-50 ${
        danger
          ? "bg-red-600 hover:bg-red-500"
          : "bg-indigo-600 hover:bg-indigo-500"
      }`}
    >
      {children}
    </button>
  );
}

/* =====================================================
   SIDEBAR
===================================================== */

function Sidebar({
  active,
  setActive,
  onLogout,
}) {
  const items = [
    "roadmaps",
    "levels",
    "questions",
    "practice",
  ];

  return (
    <div className="w-64 min-h-screen bg-[#070707] border-r border-white/10 p-4 flex flex-col">

      {/* LOGO */}

      <h1 className="text-xl font-bold text-indigo-400 mb-6">
        SaaS Admin
      </h1>

      {/* MENU */}

      <div className="flex-1">

        {items.map((item) => (
          <div
            key={item}
            onClick={() =>
              setActive(item)
            }
            className={`p-3 mb-2 rounded-lg cursor-pointer capitalize transition ${
              active === item
                ? "bg-indigo-600 text-white"
                : "hover:bg-white/5 text-gray-300"
            }`}
          >
            {item === "roadmaps" && "🎯 "}
            {item === "levels" && "📘 "}
            {item === "questions" && "❓ "}
            {item === "practice" && "⚡ "}

            {item}
          </div>
        ))}

      </div>

      {/* LOGOUT */}

      <div className="pt-4 border-t border-white/10">

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
        >
          <span className="text-lg">
            🚪
          </span>

          <span>
            Logout
          </span>
        </button>

      </div>

    </div>
  );
}

/* =====================================================
   MAIN
===================================================== */

export default function AdminDashboard() {

  const [view, setView] =
    useState("roadmaps");

  const [toast, setToast] =
    useState("");

  const [toastType, setToastType] =
    useState("success");

  /* =====================================================
     ROADMAP STATE
  ===================================================== */

  const [roadmaps, setRoadmaps] =
    useState([]);

  const [selectedRoadmap, setSelectedRoadmap] =
    useState(null);

  /* =====================================================
     LEVEL STATE
  ===================================================== */

  const [levels, setLevels] =
    useState([]);

  const [selectedLevel, setSelectedLevel] =
    useState(null);

  /* =====================================================
     QUESTION STATE
  ===================================================== */

  const [questions, setQuestions] =
    useState([]);

  /* =====================================================
     PRACTICE STATE
  ===================================================== */

  const [practices, setPractices] =
    useState([]);

  /* =====================================================
     FORMS
  ===================================================== */

  const [roadmapForm, setRoadmapForm] =
    useState({
      goal: "",
      level: "",
      description: "",
    });

  const [levelForm, setLevelForm] =
    useState({
      level_name: "",
      order_index: "",
    });

  const [questionForm, setQuestionForm] =
    useState({
      question: "",
      answer: "",
      practice: "",
      type: "",
    });

  const [practiceForm, setPracticeForm] =
    useState({
      topic: "",
      question: "",
      starter_code: "",
      solution_code: "",
      expected_output: "",
      language: "html",
    });

  /* =====================================================
     NOTIFY
  ===================================================== */

  const notify = (
    message,
    type = "success"
  ) => {

    setToast(message);
    setToastType(type);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  /* =====================================================
     LOAD ROADMAPS
  ===================================================== */

  const loadRoadmaps = async () => {

    try {

      const res =
        await API.get(
          "/admin/roadmaps"
        );

      setRoadmaps(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(
        "ROADMAP LOAD ERROR:",
        err
      );

      notify(
        "Failed to load roadmaps",
        "error"
      );
    }
  };

  /* =====================================================
     LOAD LEVELS
  ===================================================== */

  const loadLevels = async (
    roadmapId
  ) => {

    try {

      const res =
        await API.get(
          `/admin/levels/${roadmapId}`
        );

      setLevels(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(
        "LEVEL LOAD ERROR:",
        err
      );

      setLevels([]);

      notify(
        "Failed to load levels",
        "error"
      );
    }
  };

  /* =====================================================
     LOAD QUESTIONS
  ===================================================== */

  const loadQuestions = async (
    levelId
  ) => {

    try {

      const res =
        await API.get(
          `/admin/questions/${levelId}`
        );

      setQuestions(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(
        "QUESTION LOAD ERROR:",
        err
      );

      setQuestions([]);

      notify(
        "Failed to load questions",
        "error"
      );
    }
  };

  /* =====================================================
     LOAD PRACTICES
  ===================================================== */

  const loadPractices = async () => {

    try {

      console.log(
        "Loading practices..."
      );

      const res =
        await API.get(
          "/admin/practice"
        );

      console.log(
        "PRACTICE RESPONSE:",
        res.data
      );

      setPractices(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(
        "PRACTICE LOAD ERROR:",
        err.response?.data ||
          err.message ||
          err
      );

      setPractices([]);

      notify(
        err.response?.data?.message ||
          "Failed to load practices",
        "error"
      );
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {

    loadRoadmaps();

    loadPractices();

  }, []);

  /* =====================================================
     SELECT ROADMAP
  ===================================================== */

  const handleRoadmapSelect =
    async (id) => {

      const roadmapId =
        Number(id);

      setSelectedRoadmap(
        roadmapId
      );

      setSelectedLevel(null);

      setLevels([]);

      setQuestions([]);

      await loadLevels(
        roadmapId
      );

      setView("levels");
    };

  /* =====================================================
     SELECT LEVEL
  ===================================================== */

  const handleLevelSelect =
    async (id) => {

      const levelId =
        Number(id);

      setSelectedLevel(
        levelId
      );

      setQuestions([]);

      await loadQuestions(
        levelId
      );

      setView("questions");
    };

  /* =====================================================
     CREATE ROADMAP
  ===================================================== */

  const createRoadmap = async () => {

    try {

      if (
        !roadmapForm.goal.trim()
      ) {

        notify(
          "Enter roadmap goal",
          "error"
        );

        return;
      }

      await API.post(
        "/admin/roadmap",
        {
          goal:
            roadmapForm.goal.trim(),

          level:
            roadmapForm.level.trim(),

          description:
            roadmapForm.description.trim(),
        }
      );

      setRoadmapForm({
        goal: "",
        level: "",
        description: "",
      });

      await loadRoadmaps();

      notify(
        "Roadmap created successfully"
      );

    } catch (err) {

      console.error(
        "CREATE ROADMAP ERROR:",
        err
      );

      notify(
        err.response?.data?.message ||
          "Failed to create roadmap",
        "error"
      );
    }
  };

  /* =====================================================
     CREATE LEVEL
  ===================================================== */

  const createLevel = async () => {

    try {

      if (!selectedRoadmap) {

        notify(
          "Select a roadmap first",
          "error"
        );

        return;
      }

      if (
        !levelForm.level_name.trim()
      ) {

        notify(
          "Enter level name",
          "error"
        );

        return;
      }

      await API.post(
        "/admin/level",
        {
          roadmap_id:
            Number(
              selectedRoadmap
            ),

          level_name:
            levelForm.level_name.trim(),

          order_index:
            Number(
              levelForm.order_index
            ) || 0,
        }
      );

      setLevelForm({
        level_name: "",
        order_index: "",
      });

      await loadLevels(
        selectedRoadmap
      );

      notify(
        "Level created successfully"
      );

    } catch (err) {

      console.error(
        "CREATE LEVEL ERROR:",
        err
      );

      notify(
        err.response?.data?.message ||
          "Failed to create level",
        "error"
      );
    }
  };

  /* =====================================================
     CREATE QUESTION
  ===================================================== */

  const createQuestion =
    async () => {

      try {

        if (!selectedLevel) {

          notify(
            "Select a level first",
            "error"
          );

          return;
        }

        if (
          !questionForm.question.trim()
        ) {

          notify(
            "Enter question",
            "error"
          );

          return;
        }

        if (
          !questionForm.answer.trim()
        ) {

          notify(
            "Enter answer",
            "error"
          );

          return;
        }

        await API.post(
          "/admin/question",
          {
            level_id:
              Number(
                selectedLevel
              ),

            question:
              questionForm.question.trim(),

            answer:
              questionForm.answer.trim(),

            practice:
              questionForm.practice.trim(),

            type:
              questionForm.type.trim(),
          }
        );

        setQuestionForm({
          question: "",
          answer: "",
          practice: "",
          type: "",
        });

        await loadQuestions(
          selectedLevel
        );

        notify(
          "Question created successfully"
        );

      } catch (err) {

        console.error(
          "CREATE QUESTION ERROR:",
          err
        );

        notify(
          err.response?.data?.message ||
            "Failed to create question",
          "error"
        );
      }
    };

  /* =====================================================
     CREATE PRACTICE
  ===================================================== */

  const createPractice =
    async () => {

      try {

        if (
          !practiceForm.topic.trim()
        ) {

          notify(
            "Enter practice topic",
            "error"
          );

          return;
        }

        if (
          !practiceForm.question.trim()
        ) {

          notify(
            "Enter practice question",
            "error"
          );

          return;
        }

        if (
          !practiceForm.solution_code.trim()
        ) {

          notify(
            "Enter solution code",
            "error"
          );

          return;
        }

        console.log(
          "CREATING PRACTICE:",
          practiceForm
        );

        const res =
          await API.post(
            "/admin/practice",
            {
              topic:
                practiceForm.topic.trim(),

              question:
                practiceForm.question.trim(),

              starter_code:
                practiceForm.starter_code,

              solution_code:
                practiceForm.solution_code,

              expected_output:
                practiceForm.expected_output,

              language:
                practiceForm.language,
            }
          );

        console.log(
          "CREATE PRACTICE RESPONSE:",
          res.data
        );

        setPracticeForm({
          topic: "",
          question: "",
          starter_code: "",
          solution_code: "",
          expected_output: "",
          language: "html",
        });

        await loadPractices();

        notify(
          "Practice question created successfully"
        );

      } catch (err) {

        console.error(
          "CREATE PRACTICE ERROR:",
          err.response?.data ||
            err.message ||
            err
        );

        notify(
          err.response?.data?.message ||
            "Failed to create practice",
          "error"
        );
      }
    };

  /* =====================================================
     DELETE PRACTICE
  ===================================================== */

  const deletePractice =
    async (id) => {

      const confirmed =
        window.confirm(
          "Delete this practice question?"
        );

      if (!confirmed) return;

      try {

        await API.delete(
          `/admin/practice/${id}`
        );

        await loadPractices();

        notify(
          "Practice question deleted"
        );

      } catch (err) {

        console.error(
          "DELETE PRACTICE ERROR:",
          err
        );

        notify(
          err.response?.data?.message ||
            "Failed to delete practice",
          "error"
        );
      }
    };

  /* =====================================================
     CHANGE VIEW
  ===================================================== */

  const changeView =
    async (newView) => {

      setView(newView);

      if (
        newView === "roadmaps"
      ) {
        await loadRoadmaps();
      }

      if (
        newView === "levels" &&
        selectedRoadmap
      ) {
        await loadLevels(
          selectedRoadmap
        );
      }

      if (
        newView === "questions" &&
        selectedLevel
      ) {
        await loadQuestions(
          selectedLevel
        );
      }

      if (
        newView === "practice"
      ) {
        await loadPractices();
      }
    };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="flex min-h-screen bg-black text-white">

      <Toast
        message={toast}
        type={toastType}
      />

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar
        active={view}
        setActive={changeView}
        onLogout={handleLogout}
      />

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="flex-1 p-8">

        {/* =================================================
            ROADMAPS
        ================================================= */}

        {view === "roadmaps" && (

          <div>

            <h2 className="text-2xl font-bold mb-6 text-indigo-400">
              🎯 Roadmaps
            </h2>

            {roadmaps.length === 0 ? (

              <p className="text-gray-500 mb-8">
                No roadmaps created yet.
              </p>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                {roadmaps.map((r) => {

                  const roadmapId =
                    Number(r.id);

                  return (

                    <Card
                      key={roadmapId}
                      active={
                        Number(
                          selectedRoadmap
                        ) === roadmapId
                      }
                      onClick={() =>
                        handleRoadmapSelect(
                          roadmapId
                        )
                      }
                    >

                      <div className="font-semibold">
                        🎯 {r.goal}
                      </div>

                      <div className="text-sm text-gray-400 mt-2">
                        Level:{" "}
                        {r.level ||
                          "Not specified"}
                      </div>

                      {r.description && (

                        <div className="text-xs text-gray-500 mt-2">
                          {r.description}
                        </div>

                      )}

                      <div className="text-xs text-indigo-400 mt-3">
                        ID: {roadmapId}
                      </div>

                    </Card>

                  );
                })}

              </div>

            )}

            {/* CREATE ROADMAP */}

            <div className="max-w-md">

              <h3 className="text-xl font-semibold mb-4">
                Create New Roadmap
              </h3>

              <Input
                placeholder="Goal"
                value={
                  roadmapForm.goal
                }
                onChange={(e) =>
                  setRoadmapForm({
                    ...roadmapForm,
                    goal:
                      e.target.value,
                  })
                }
              />

              <Input
                placeholder="Level"
                value={
                  roadmapForm.level
                }
                onChange={(e) =>
                  setRoadmapForm({
                    ...roadmapForm,
                    level:
                      e.target.value,
                  })
                }
              />

              <Input
                placeholder="Description"
                value={
                  roadmapForm.description
                }
                onChange={(e) =>
                  setRoadmapForm({
                    ...roadmapForm,
                    description:
                      e.target.value,
                  })
                }
              />

              <Button
                onClick={
                  createRoadmap
                }
              >
                Create Roadmap
              </Button>

            </div>

          </div>

        )}

        {/* =================================================
            LEVELS
        ================================================= */}

        {view === "levels" && (

          <div>

            <h2 className="text-2xl font-bold mb-6 text-indigo-400">
              📘 Levels
            </h2>

            {!selectedRoadmap ? (

              <div className="bg-yellow-900/30 border border-yellow-600 p-4 rounded-lg">
                ⚠️ Go to{" "}
                <b>Roadmaps</b>{" "}
                and click a roadmap first.
              </div>

            ) : (

              <>

                <div className="mb-6 bg-white/5 p-4 rounded-lg">

                  <p className="text-gray-400">
                    Selected Roadmap:
                  </p>

                  <p className="text-indigo-400 font-bold">
                    ID:{" "}
                    {selectedRoadmap}
                  </p>

                </div>

                {levels.length === 0 ? (

                  <p className="text-gray-500 mb-6">
                    No levels for this roadmap.
                  </p>

                ) : (

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

                    {levels.map((l) => {

                      const levelId =
                        Number(l.id);

                      return (

                        <Card
                          key={levelId}
                          active={
                            Number(
                              selectedLevel
                            ) === levelId
                          }
                          onClick={() =>
                            handleLevelSelect(
                              levelId
                            )
                          }
                        >

                          <div className="font-semibold">
                            📘{" "}
                            {l.level_name}
                          </div>

                          <div className="text-sm text-gray-400 mt-2">
                            Order:{" "}
                            {l.order_index}
                          </div>

                          <div className="text-xs text-indigo-400 mt-2">
                            ID: {levelId}
                          </div>

                        </Card>

                      );
                    })}

                  </div>

                )}

                {/* CREATE LEVEL */}

                <div className="max-w-md">

                  <h3 className="text-xl font-semibold mb-4">
                    Add Level
                  </h3>

                  <Input
                    placeholder="Level Name"
                    value={
                      levelForm.level_name
                    }
                    onChange={(e) =>
                      setLevelForm({
                        ...levelForm,
                        level_name:
                          e.target.value,
                      })
                    }
                  />

                  <Input
                    type="number"
                    placeholder="Order Index"
                    value={
                      levelForm.order_index
                    }
                    onChange={(e) =>
                      setLevelForm({
                        ...levelForm,
                        order_index:
                          e.target.value,
                      })
                    }
                  />

                  <Button
                    onClick={
                      createLevel
                    }
                  >
                    Add Level
                  </Button>

                </div>

              </>

            )}

          </div>

        )}

        {/* =================================================
            QUESTIONS
        ================================================= */}

        {view === "questions" && (

          <div>

            <h2 className="text-2xl font-bold mb-6 text-indigo-400">
              ❓ Questions
            </h2>

            {!selectedLevel ? (

              <div className="bg-yellow-900/30 border border-yellow-600 p-4 rounded-lg">
                ⚠️ Go to{" "}
                <b>Levels</b>{" "}
                and click a level first.
              </div>

            ) : (

              <>

                <div className="mb-6 bg-white/5 p-4 rounded-lg">

                  <p className="text-gray-400">
                    Selected Level:
                  </p>

                  <p className="text-indigo-400 font-bold">
                    ID:{" "}
                    {selectedLevel}
                  </p>

                </div>

                {questions.length === 0 ? (

                  <p className="text-gray-500 mb-6">
                    No questions for this level.
                  </p>

                ) : (

                  <div className="space-y-3 mb-8">

                    {questions.map((q) => (

                      <Card key={q.id}>

                        <div className="font-semibold">
                          ❓ {q.question}
                        </div>

                        <div className="text-sm text-green-400 mt-2">
                          Answer:{" "}
                          {q.answer}
                        </div>

                        {q.practice && (

                          <div className="text-sm text-gray-400 mt-2">
                            Practice:{" "}
                            {q.practice}
                          </div>

                        )}

                        {q.type && (

                          <div className="text-xs text-gray-500 mt-2">
                            Type:{" "}
                            {q.type}
                          </div>

                        )}

                      </Card>

                    ))}

                  </div>

                )}

                {/* CREATE QUESTION */}

                <div className="max-w-md">

                  <h3 className="text-xl font-semibold mb-4">
                    Add Question
                  </h3>

                  <Input
                    placeholder="Question"
                    value={
                      questionForm.question
                    }
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        question:
                          e.target.value,
                      })
                    }
                  />

                  <Input
                    placeholder="Answer"
                    value={
                      questionForm.answer
                    }
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        answer:
                          e.target.value,
                      })
                    }
                  />

                  <Input
                    placeholder="Practice"
                    value={
                      questionForm.practice
                    }
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        practice:
                          e.target.value,
                      })
                    }
                  />

                  <Input
                    placeholder="Type"
                    value={
                      questionForm.type
                    }
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        type:
                          e.target.value,
                      })
                    }
                  />

                  <Button
                    onClick={
                      createQuestion
                    }
                  >
                    Add Question
                  </Button>

                </div>

              </>

            )}

          </div>

        )}

        {/* =================================================
            PRACTICE
        ================================================= */}

        {view === "practice" && (

          <div>

            <h2 className="text-2xl font-bold mb-6 text-indigo-400">
              ⚡ Practice Questions
            </h2>

            {/* PRACTICE LIST */}

            {practices.length === 0 ? (

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">

                <p className="text-gray-400">
                  No practice questions yet.
                </p>

              </div>

            ) : (

              <div className="space-y-4 mb-10">

                {practices.map(
                  (practice) => (

                    <Card
                      key={
                        practice.id
                      }
                    >

                      <div className="flex justify-between gap-4">

                        <div className="flex-1">

                          <h3 className="text-lg font-bold text-indigo-400">
                            ⚡{" "}
                            {practice.topic}
                          </h3>

                          <p className="text-white mt-2">
                            {practice.question}
                          </p>

                          <div className="flex gap-3 mt-3 text-xs">

                            <span className="bg-indigo-600/30 text-indigo-300 px-3 py-1 rounded-full">
                              {practice.language}
                            </span>

                            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full">
                              ID:{" "}
                              {practice.id}
                            </span>

                          </div>

                          {practice.expected_output && (

                            <div className="mt-4">

                              <p className="text-gray-400 text-sm mb-1">
                                Expected Output:
                              </p>

                              <pre className="bg-black border border-white/10 rounded-lg p-3 text-green-400 text-sm whitespace-pre-wrap">
                                {
                                  practice.expected_output
                                }
                              </pre>

                            </div>

                          )}

                        </div>

                        <div>

                          <Button
                            danger
                            onClick={() =>
                              deletePractice(
                                practice.id
                              )
                            }
                          >
                            Delete
                          </Button>

                        </div>

                      </div>

                    </Card>

                  )
                )}

              </div>

            )}

            {/* CREATE PRACTICE */}

            <div className="max-w-3xl">

              <h3 className="text-xl font-semibold mb-5">
                ➕ Add Practice Question
              </h3>

              {/* TOPIC */}

              <label className="block text-sm text-gray-400 mb-2">
                Topic
              </label>

              <Input
                placeholder="Example: HTML Basics"
                value={
                  practiceForm.topic
                }
                onChange={(e) =>
                  setPracticeForm({
                    ...practiceForm,
                    topic:
                      e.target.value,
                  })
                }
              />

              {/* LANGUAGE */}

              <label className="block text-sm text-gray-400 mb-2">
                Language
              </label>

              <select
                value={practiceForm.language}
                onChange={(e) =>
                  setPracticeForm({
                    ...practiceForm,
                    language: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 bg-black border border-white/10 rounded text-sm outline-none focus:border-indigo-500"
              >
                <option value="">
                  Select Language
                </option>

                <option value="html">
                  HTML
                </option>

                <option value="css">
                  CSS
                </option>

                <option value="javascript">
                  JavaScript
                </option>

                <option value="typescript">
                  TypeScript
                </option>

                <option value="python">
                  Python
                </option>

                <option value="java">
                  Java
                </option>

                <option value="c">
                  C
                </option>

                <option value="cpp">
                  C++
                </option>

                <option value="csharp">
                  C#
                </option>

                <option value="php">
                  PHP
                </option>

                <option value="sql">
                  SQL
                </option>

                <option value="go">
                  Go
                </option>

                <option value="rust">
                  Rust
                </option>

                <option value="kotlin">
                  Kotlin
                </option>

                <option value="swift">
                  Swift
                </option>

                <option value="react">
                  React
                </option>

                <option value="nodejs">
                  Node.js
                </option>
              </select>

              {/* QUESTION */}

              <label className="block text-sm text-gray-400 mb-2">
                Question
              </label>

              <Textarea
                placeholder="Example: Create a heading that displays Hello World."
                value={
                  practiceForm.question
                }
                onChange={(e) =>
                  setPracticeForm({
                    ...practiceForm,
                    question:
                      e.target.value,
                  })
                }
              />

              {/* STARTER CODE */}

              <label className="block text-sm text-gray-400 mb-2">
                Starter Code
              </label>

              <Textarea
                placeholder="<h1></h1>"
                value={
                  practiceForm.starter_code
                }
                onChange={(e) =>
                  setPracticeForm({
                    ...practiceForm,
                    starter_code:
                      e.target.value,
                  })
                }
                className="font-mono"
              />

              {/* SOLUTION */}

              <label className="block text-sm text-gray-400 mb-2">
                Solution Code
              </label>

              <Textarea
                placeholder="<h1>Hello World</h1>"
                value={
                  practiceForm.solution_code
                }
                onChange={(e) =>
                  setPracticeForm({
                    ...practiceForm,
                    solution_code:
                      e.target.value,
                  })
                }
              />

              {/* EXPECTED OUTPUT */}

              <label className="block text-sm text-gray-400 mb-2">
                Expected Output
              </label>

              <Textarea
                placeholder="Hello World"
                value={
                  practiceForm.expected_output
                }
                onChange={(e) =>
                  setPracticeForm({
                    ...practiceForm,
                    expected_output:
                      e.target.value,
                  })
                }
              />

              <Button
                onClick={
                  createPractice
                }
              >
                ⚡ Create Practice
              </Button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}