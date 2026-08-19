import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [progress, setProgress] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    if (!user?.id) {
      window.location.href = "/login";
      return;
    }

    // Load roadmaps
    API.get(`/roadmaps/${user.id}`)
      .then((res) => {
        setRoadmaps(res.data || []);
      })
      .catch((err) => {
        console.error("Roadmap error:", err);
      });

    // Load progress
    API.get(`/progress/${user.id}`)
      .then((res) => {
        setProgress(res.data || []);
      })
      .catch((err) => {
        console.error("Progress error:", err);
      });
  }, []);

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  /* =====================================================
     PROGRESS
  ===================================================== */

  const completedLevels = progress.filter(
    (p) => Number(p.status) === 1
  ).length;

  const totalProgress =
    roadmaps.length > 0
      ? Math.min(
          Math.round(
            (completedLevels / roadmaps.length) * 100
          ),
          100
        )
      : 0;

  /* =====================================================
     BADGE
  ===================================================== */

  let badge = {
    icon: "🌱",
    name: "Beginner",
    color: "text-green-400",
  };

  if (completedLevels >= 10) {
    badge = {
      icon: "👑",
      name: "Learning Legend",
      color: "text-yellow-400",
    };
  } else if (completedLevels >= 5) {
    badge = {
      icon: "🔥",
      name: "Fast Learner",
      color: "text-orange-400",
    };
  } else if (completedLevels >= 3) {
    badge = {
      icon: "🏆",
      name: "Rising Star",
      color: "text-purple-400",
    };
  } else if (completedLevels >= 1) {
    badge = {
      icon: "⭐",
      name: "First Step",
      color: "text-indigo-400",
    };
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="
        hidden
        md:flex
        w-72
        min-h-screen
        flex-col
        border-r
        border-white/10
        bg-[#090909]
        p-5
      ">

        {/* LOGO */}

        <div className="
          flex
          items-center
          gap-3
          px-3
          py-3
          mb-6
        ">

          <div className="
            w-10
            h-10
            rounded-xl
            bg-gradient-to-br
            from-indigo-500
            to-purple-600
            flex
            items-center
            justify-center
            text-xl
            shadow-lg
            shadow-indigo-500/20
          ">
            🚀
          </div>

          <div>
            <h1 className="font-bold text-lg">
              LearnPath
              <span className="text-indigo-400">
                AI
              </span>
            </h1>

            <p className="text-xs text-gray-600">
              Learn. Practice. Grow.
            </p>
          </div>

        </div>


        {/* USER PROFILE */}

        <div className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-indigo-500/20
          bg-gradient-to-br
          from-indigo-500/10
          to-purple-500/5
          p-4
          mb-6
        ">

          <div className="
            absolute
            -right-8
            -top-8
            w-24
            h-24
            bg-indigo-500/10
            blur-2xl
            rounded-full
          " />

          <div className="
            relative
            flex
            items-center
            gap-3
          ">

            {/* AVATAR */}

            <div className="
              w-12
              h-12
              rounded-full
              bg-gradient-to-br
              from-indigo-500
              to-purple-600
              flex
              items-center
              justify-center
              text-lg
              font-bold
              shadow-lg
              shadow-indigo-500/20
            ">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="min-w-0">

              <p className="
                text-xs
                text-gray-500
                mb-1
              ">
                Welcome back
              </p>

              <p className="
                font-semibold
                truncate
              ">
                {user?.name || "Learner"}
              </p>

            </div>

          </div>

          {/* BADGE */}

          <div className="
            mt-4
            flex
            items-center
            justify-between
            bg-black/30
            rounded-xl
            p-3
          ">

            <div className="
              flex
              items-center
              gap-2
            ">

              <span className="text-xl">
                {badge.icon}
              </span>

              <div>
                <p className="text-xs text-gray-500">
                  Current Badge
                </p>

                <p className={`
                  text-sm
                  font-semibold
                  ${badge.color}
                `}>
                  {badge.name}
                </p>
              </div>

            </div>

            <span className="
              text-xs
              text-gray-600
            ">
              {completedLevels} completed
            </span>

          </div>

        </div>


        {/* NAVIGATION TITLE */}

        <p className="
          text-xs
          uppercase
          tracking-widest
          text-gray-600
          font-semibold
          px-3
          mb-3
        ">
          Navigation
        </p>


        {/* NAVIGATION */}

        <nav className="space-y-2">

          {/* DASHBOARD */}

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              bg-indigo-500/10
              border
              border-indigo-500/20
              text-indigo-400
              font-medium
              transition
            "
          >
            <span>📊</span>
            <span>Dashboard</span>
          </button>


          {/* PRACTICE */}

          <button
            onClick={() =>
              navigate("/practice-hub")
            }
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              text-gray-400
              hover:text-white
              hover:bg-white/5
              transition
            "
          >
            <span>⚡</span>
            <span>Quick Coding</span>
          </button>


          {/* ROADMAPS */}

          <button
            onClick={() =>
              document
                .getElementById("roadmaps")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              text-gray-400
              hover:text-white
              hover:bg-white/5
              transition
            "
          >
            <span>🛣️</span>
            <span>My Roadmaps</span>
          </button>

        </nav>


        {/* SIDEBAR STATS */}

        <div className="
          mt-7
          rounded-2xl
          border
          border-white/10
          bg-white/[0.025]
          p-4
        ">

          <p className="
            text-xs
            text-gray-500
            mb-4
          ">
            YOUR JOURNEY
          </p>

          <div className="
            grid
            grid-cols-2
            gap-3
          ">

            <div className="
              bg-black/30
              rounded-xl
              p-3
            ">
              <p className="
                text-xl
                font-bold
                text-indigo-400
              ">
                {roadmaps.length}
              </p>

              <p className="
                text-xs
                text-gray-600
                mt-1
              ">
                Roadmaps
              </p>
            </div>


            <div className="
              bg-black/30
              rounded-xl
              p-3
            ">
              <p className="
                text-xl
                font-bold
                text-green-400
              ">
                {completedLevels}
              </p>

              <p className="
                text-xs
                text-gray-600
                mt-1
              ">
                Completed
              </p>
            </div>

          </div>

        </div>


        {/* PROGRESS */}

        <div className="
          mt-5
          px-2
        ">

          <div className="
            flex
            justify-between
            text-xs
            mb-2
          ">

            <span className="text-gray-500">
              Overall Progress
            </span>

            <span className="text-indigo-400">
              {totalProgress}%
            </span>

          </div>

          <div className="
            h-1.5
            rounded-full
            bg-white/10
            overflow-hidden
          ">

            <div
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-indigo-500
                to-purple-500
                transition-all
              "
              style={{
                width: `${totalProgress}%`,
              }}
            />

          </div>

        </div>


        {/* BOTTOM */}

        <div className="
          mt-auto
          pt-5
          border-t
          border-white/10
        ">

          <button
            onClick={logout}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              text-red-400
              hover:bg-red-500/10
              transition
            "
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="
        flex-1
        min-w-0
        p-5
        md:p-10
      ">

        <div className="
          max-w-6xl
          mx-auto
        ">


          {/* MOBILE HEADER */}

          <div className="
            md:hidden
            flex
            items-center
            justify-between
            mb-6
          ">

            <div className="
              flex
              items-center
              gap-3
            ">

              <div className="
                w-10
                h-10
                rounded-xl
                bg-gradient-to-br
                from-indigo-500
                to-purple-600
                flex
                items-center
                justify-center
              ">
                🚀
              </div>

              <div>
                <h1 className="font-bold">
                  LearnPath
                  <span className="text-indigo-400">
                    AI
                  </span>
                </h1>

                <p className="text-xs text-gray-500">
                  {user?.name || "Learner"}
                </p>
              </div>

            </div>

            <button
              onClick={() =>
                navigate("/practice-hub")
              }
              className="
                px-3
                py-2
                rounded-lg
                bg-indigo-600
                text-sm
              "
            >
              ⚡ Practice
            </button>

          </div>


          {/* HERO */}

          <section className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-indigo-500/20
            bg-gradient-to-br
            from-indigo-950/50
            via-purple-950/20
            to-black
            p-7
            md:p-10
            mb-8
          ">

            <div className="
              absolute
              -top-32
              -right-20
              w-80
              h-80
              bg-indigo-500/20
              blur-[100px]
              rounded-full
            " />

            <div className="
              absolute
              -bottom-32
              left-1/3
              w-72
              h-72
              bg-purple-500/10
              blur-[100px]
              rounded-full
            " />

            <div className="relative">

              <p className="
                text-indigo-400
                text-sm
                font-semibold
                mb-2
              ">
                YOUR LEARNING SPACE
              </p>

              <h2 className="
                text-3xl
                md:text-5xl
                font-bold
              ">
                Welcome back,{" "}
                <span className="
                  bg-gradient-to-r
                  from-indigo-400
                  to-purple-400
                  bg-clip-text
                  text-transparent
                ">
                  {user?.name || "Learner"}
                </span>
                ! 👋
              </h2>

              <p className="
                text-gray-400
                mt-4
                text-lg
              ">
                Keep learning, keep practicing,
                and build your future.
              </p>


              {/* QUICK STATS */}

              <div className="
                grid
                grid-cols-2
                md:grid-cols-4
                gap-3
                mt-8
              ">

                <div className="
                  bg-black/30
                  border
                  border-white/10
                  rounded-2xl
                  p-4
                ">
                  <p className="
                    text-2xl
                    font-bold
                  ">
                    {roadmaps.length}
                  </p>

                  <p className="
                    text-xs
                    text-gray-500
                    mt-1
                  ">
                    Roadmaps
                  </p>
                </div>


                <div className="
                  bg-black/30
                  border
                  border-white/10
                  rounded-2xl
                  p-4
                ">
                  <p className="
                    text-2xl
                    font-bold
                    text-green-400
                  ">
                    {completedLevels}
                  </p>

                  <p className="
                    text-xs
                    text-gray-500
                    mt-1
                  ">
                    Completed
                  </p>
                </div>


                <div className="
                  bg-black/30
                  border
                  border-white/10
                  rounded-2xl
                  p-4
                ">
                  <p className="
                    text-2xl
                    font-bold
                    text-purple-400
                  ">
                    {totalProgress}%
                  </p>

                  <p className="
                    text-xs
                    text-gray-500
                    mt-1
                  ">
                    Progress
                  </p>
                </div>


                <div className="
                  bg-black/30
                  border
                  border-white/10
                  rounded-2xl
                  p-4
                ">
                  <p className="text-2xl">
                    {badge.icon}
                  </p>

                  <p className={`
                    text-xs
                    font-semibold
                    mt-1
                    ${badge.color}
                  `}>
                    {badge.name}
                  </p>
                </div>

              </div>

            </div>

          </section>


          {/* ROADMAP SECTION */}

          <section id="roadmaps">

            <div className="
              flex
              items-center
              justify-between
              mb-5
            ">

              <div>

                <h3 className="
                  text-2xl
                  font-bold
                ">
                  Your Roadmaps 🛣️
                </h3>

                <p className="
                  text-gray-500
                  text-sm
                  mt-1
                ">
                  Choose a roadmap and continue
                  your journey.
                </p>

              </div>

              <button
                onClick={() =>
                  navigate("/practice-hub")
                }
                className="
                  hidden
                  sm:flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  bg-indigo-600
                  hover:bg-indigo-500
                  font-semibold
                  transition
                "
              >
                ⚡ Practice
              </button>

            </div>


            {/* ROADMAPS */}

            {roadmaps.length === 0 ? (

              <div className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                p-10
                text-center
              ">

                <div className="
                  text-5xl
                  mb-4
                ">
                  🛣️
                </div>

                <h3 className="
                  text-xl
                  font-semibold
                ">
                  No roadmaps yet
                </h3>

                <p className="
                  text-gray-500
                  mt-2
                ">
                  Create a roadmap to start
                  your learning journey.
                </p>

              </div>

            ) : (

              <div className="
                grid
                md:grid-cols-2
                gap-5
              ">

                {roadmaps.map((r, index) => (

                  <div
                    key={r.id}
                    onClick={() =>
                      navigate(
                        `/roadmap/${r.id}`
                      )
                    }
                    className="
                      group
                      relative
                      overflow-hidden
                      p-6
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.025]
                      hover:bg-indigo-500/[0.05]
                      hover:border-indigo-500/40
                      cursor-pointer
                      transition
                      duration-300
                    "
                  >

                    {/* glow */}

                    <div className="
                      absolute
                      -right-10
                      -top-10
                      w-32
                      h-32
                      bg-indigo-500/10
                      blur-3xl
                      rounded-full
                      group-hover:bg-indigo-500/20
                      transition
                    " />


                    <div className="
                      relative
                      flex
                      items-start
                      justify-between
                      gap-4
                    ">

                      <div className="
                        flex
                        items-center
                        gap-4
                      ">

                        <div className="
                          w-12
                          h-12
                          rounded-xl
                          bg-indigo-500/10
                          border
                          border-indigo-500/20
                          flex
                          items-center
                          justify-center
                          text-xl
                        ">
                          {index % 2 === 0
                            ? "🎯"
                            : "🚀"}
                        </div>

                        <div>

                          <h4 className="
                            font-bold
                            text-lg
                            group-hover:text-indigo-400
                            transition
                          ">
                            {r.goal}
                          </h4>

                          <p className="
                            text-gray-500
                            text-sm
                            mt-1
                          ">
                            Level: {r.level}
                          </p>

                        </div>

                      </div>

                      <span className="
                        text-gray-600
                        group-hover:text-indigo-400
                        transition
                      ">
                        →
                      </span>

                    </div>


                    {r.description && (

                      <p className="
                        relative
                        text-gray-500
                        text-sm
                        mt-5
                        line-clamp-2
                      ">
                        {r.description}
                      </p>

                    )}


                    <div className="
                      relative
                      flex
                      items-center
                      justify-between
                      mt-6
                      pt-4
                      border-t
                      border-white/10
                    ">

                      <span className="
                        text-xs
                        text-gray-600
                      ">
                        Click to continue
                      </span>

                      <span className="
                        text-xs
                        text-indigo-400
                        font-semibold
                      ">
                        Start Learning →
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>


          {/* MOTIVATION CARD */}

          <section className="
            mt-8
            rounded-2xl
            border
            border-purple-500/20
            bg-gradient-to-r
            from-purple-500/10
            to-indigo-500/10
            p-6
          ">

            <div className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              justify-between
              gap-4
            ">

              <div>

                <p className="
                  text-purple-400
                  font-semibold
                ">
                  {badge.icon} Keep going!
                </p>

                <h3 className="
                  text-xl
                  font-bold
                  mt-1
                ">
                  Every completed level
                  gets you closer.
                </h3>

                <p className="
                  text-gray-500
                  text-sm
                  mt-1
                ">
                  Your next badge is waiting
                  for you.
                </p>

              </div>

              <button
                onClick={() =>
                  navigate("/practice-hub")
                }
                className="
                  px-5
                  py-3
                  rounded-xl
                  bg-purple-600
                  hover:bg-purple-500
                  font-semibold
                  transition
                  whitespace-nowrap
                "
              >
                Start Practicing ⚡
              </button>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}