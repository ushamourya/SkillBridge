import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";

export default function Home() {
  const navigate = useNavigate();

  /* =====================================================
     GO TO PRACTICE
  ===================================================== */

  const goToPractice = () => {
    const user = localStorage.getItem("user");

    if (user) {
      navigate("/practice-hub");
    } else {
      navigate("/login", {
        state: {
          from: "/practice-hub",
        },
      });
    }
  };

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">

      {/* =========================================
          NAVBAR
      ========================================== */}

      <Navbar />


      {/* =========================================
          HERO
      ========================================== */}

      <Hero />


      {/* =========================================
          STATS
      ========================================== */}

      <section className="relative py-16 px-6">

        <div className="absolute inset-0 pointer-events-none">

          <div className="
            absolute
            top-10
            left-1/4
            w-72
            h-72
            bg-indigo-600/10
            blur-[120px]
            rounded-full
          " />

          <div className="
            absolute
            bottom-0
            right-1/4
            w-72
            h-72
            bg-purple-600/10
            blur-[120px]
            rounded-full
          " />

        </div>


        <div className="relative max-w-6xl mx-auto">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <Stat
              number="10+"
              label="Learning Paths"
            />

            <Stat
              number="100+"
              label="Practice Problems"
            />

            <Stat
              number="50+"
              label="Coding Lessons"
            />

            <Stat
              number="24/7"
              label="Learn Anytime"
            />

          </div>

        </div>

      </section>


      {/* =========================================
          FEATURES
      ========================================== */}

      <section
        id="features"
        className="relative"
      >

        <Features />

      </section>


      {/* =========================================
          LEARNING EXPERIENCE
      ========================================== */}

      <section className="py-24 px-6 relative">

        <div className="absolute inset-0 pointer-events-none">

          <div className="
            absolute
            left-0
            top-1/3
            w-96
            h-96
            bg-indigo-600/10
            blur-[140px]
            rounded-full
          " />

          <div className="
            absolute
            right-0
            bottom-0
            w-96
            h-96
            bg-cyan-600/10
            blur-[140px]
            rounded-full
          " />

        </div>


        <div className="relative max-w-6xl mx-auto">

          {/* HEADING */}

          <div className="text-center max-w-3xl mx-auto mb-16">

            <p className="text-indigo-400 font-semibold mb-3">
              LEARN SMARTER
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mb-5">

              Everything you need to

              <span className="
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                from-indigo-400
                to-purple-400
              ">
                {" "}become a developer.
              </span>

            </h2>

            <p className="text-gray-400 text-lg leading-relaxed">
              Learn concepts, follow structured roadmaps,
              practice real problems, and track your progress
              all in one place.
            </p>

          </div>


          {/* CARDS */}

          <div className="grid md:grid-cols-3 gap-6">

            <LearningCard
              icon="🧠"
              title="Learn Concepts"
              description="Understand programming concepts through structured lessons designed for beginners and growing developers."
              color="indigo"
            />

            <LearningCard
              icon="🛣️"
              title="Follow Roadmaps"
              description="Know exactly what to learn next with guided learning paths from fundamentals to advanced skills."
              color="purple"
            />

            <LearningCard
              icon="💻"
              title="Practice Coding"
              description="Write code, run it, and test your solutions with hands-on coding challenges."
              color="cyan"
            />

          </div>

        </div>

      </section>


      {/* =========================================
          HOW IT WORKS
      ========================================== */}

      <section className="
        py-24
        px-6
        bg-white/[0.02]
        border-y
        border-white/5
      ">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">

            <p className="text-indigo-400 font-semibold mb-3">
              SIMPLE PROCESS
            </p>

            <h2 className="text-4xl md:text-5xl font-bold">
              Start learning in minutes
            </h2>

          </div>


          <div className="grid md:grid-cols-4 gap-8">

            <Step
              number="01"
              icon="👤"
              title="Create an account"
              description="Sign up and create your free learning profile."
            />

            <Step
              number="02"
              icon="🎯"
              title="Choose your goal"
              description="Pick a technology or career path you want to learn."
            />

            <Step
              number="03"
              icon="📚"
              title="Follow your roadmap"
              description="Learn step-by-step through structured lessons."
            />

            <Step
              number="04"
              icon="🚀"
              title="Practice & improve"
              description="Solve coding problems and build your skills."
            />

          </div>

        </div>

      </section>


      {/* =========================================
          PRACTICE CTA
      ========================================== */}

      <section className="py-24 px-6">

        <div className="max-w-6xl mx-auto">

          <div className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-indigo-500/20
            bg-gradient-to-br
            from-indigo-950/60
            via-purple-950/40
            to-black
            p-10
            md:p-16
          ">

            {/* GLOW */}

            <div className="
              absolute
              -top-32
              -right-32
              w-80
              h-80
              bg-indigo-500/20
              blur-[100px]
              rounded-full
            " />

            <div className="
              absolute
              -bottom-32
              -left-32
              w-80
              h-80
              bg-purple-500/20
              blur-[100px]
              rounded-full
            " />


            <div className="relative max-w-3xl">

              <div className="text-5xl mb-6">
                ⚡
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">

                Don't just learn.
                <br />

                <span className="
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-r
                  from-indigo-400
                  to-purple-400
                ">
                  Build your skills.
                </span>

              </h2>

              <p className="
                text-gray-300
                text-lg
                leading-relaxed
                mb-8
              ">
                Stop watching tutorials endlessly.
                Start writing code, solving problems,
                and building real confidence.
              </p>


              {/* IMPORTANT:
                  CHECK LOGIN BEFORE PRACTICE */}

              <button
                onClick={goToPractice}
                className="
                  px-8
                  py-4
                  rounded-xl
                  bg-indigo-600
                  hover:bg-indigo-500
                  font-bold
                  text-lg
                  shadow-lg
                  shadow-indigo-600/20
                  hover:scale-105
                  transition
                "
              >
                Start Practicing →
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          FINAL CTA
      ========================================== */}

      <section className="py-24 px-6">

        <div className="max-w-4xl mx-auto text-center">

          <div className="text-5xl mb-6">
            🚀
          </div>

          <h2 className="
            text-4xl
            md:text-5xl
            font-bold
            mb-6
          ">
            Ready to start learning?
          </h2>

          <p className="
            text-gray-400
            text-lg
            mb-8
          ">
            Build your roadmap. Learn consistently.
            Practice every day.
          </p>


          <button
            onClick={() => navigate("/register")}
            className="
              px-10
              py-4
              rounded-xl
              bg-gradient-to-r
              from-indigo-600
              to-purple-600
              hover:from-indigo-500
              hover:to-purple-500
              font-bold
              text-lg
              shadow-xl
              shadow-indigo-600/20
              hover:scale-105
              transition
            "
          >
            Create Free Account →
          </button>


          <p className="text-gray-600 text-sm mt-5">
            No complicated setup. Start learning immediately.
          </p>

        </div>

      </section>


      {/* =========================================
          FOOTER
      ========================================== */}

      <footer className="
        border-t
        border-white/10
        py-10
        px-6
      ">

        <div className="max-w-6xl mx-auto">

          <div className="
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-5
          ">

            {/* BRAND */}

            <div className="text-center md:text-left">

              <h3 className="
                text-xl
                font-bold
                text-indigo-400
              ">
                LearnPath AI
              </h3>

              <p className="
                text-gray-500
                text-sm
                mt-1
              ">
                Learn. Practice. Build.
              </p>

            </div>


            {/* FOOTER LINKS */}

            <div className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-3
              text-sm
            ">

              {/* PRACTICE */}

              <button
                onClick={goToPractice}
                className="
                  px-4
                  py-2
                  text-gray-500
                  hover:text-white
                  transition
                "
              >
                Practice
              </button>


              {/* LOGIN */}

              <button
                onClick={() => navigate("/login")}
                className="
                  px-4
                  py-2
                  text-gray-500
                  hover:text-white
                  transition
                "
              >
                Login
              </button>


              {/* REGISTER */}

              <button
                onClick={() => navigate("/register")}
                className="
                  px-4
                  py-2
                  text-gray-500
                  hover:text-white
                  transition
                "
              >
                Register
              </button>


              {/* ADMIN */}

              <button
                onClick={() => navigate("/admin-login")}
                className="
                  px-4
                  py-2
                  rounded-lg
                  border
                  border-red-500/30
                  text-red-400
                  hover:text-red-300
                  hover:border-red-500/60
                  hover:bg-red-500/10
                  transition
                  font-semibold
                "
              >
                🔐 Admin
              </button>

            </div>

          </div>


          {/* COPYRIGHT */}

          <div className="
            border-t
            border-white/5
            mt-8
            pt-6
            text-center
          ">

            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} LearnPath AI.
              Learn something new every day.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}


/* =====================================================
   STAT
===================================================== */

function Stat({
  number,
  label,
}) {
  return (
    <div className="
      p-6
      rounded-2xl
      bg-white/[0.03]
      border
      border-white/10
      text-center
      hover:border-indigo-500/40
      hover:bg-white/[0.05]
      transition
    ">

      <div className="
        text-3xl
        md:text-4xl
        font-bold
        text-white
      ">
        {number}
      </div>

      <div className="
        text-gray-500
        text-sm
        mt-2
      ">
        {label}
      </div>

    </div>
  );
}


/* =====================================================
   LEARNING CARD
===================================================== */

function LearningCard({
  icon,
  title,
  description,
  color,
}) {

  const colors = {

    indigo:
      "hover:border-indigo-500/50 hover:shadow-indigo-500/10",

    purple:
      "hover:border-purple-500/50 hover:shadow-purple-500/10",

    cyan:
      "hover:border-cyan-500/50 hover:shadow-cyan-500/10",

  };

  return (
    <div className={`
      group
      p-8
      rounded-2xl
      bg-white/[0.03]
      border
      border-white/10
      shadow-xl
      transition
      duration-300
      hover:-translate-y-2
      hover:bg-white/[0.05]
      ${colors[color]}
    `}>

      <div className="
        text-4xl
        mb-6
        group-hover:scale-110
        transition
      ">
        {icon}
      </div>

      <h3 className="
        text-xl
        font-bold
        mb-3
      ">
        {title}
      </h3>

      <p className="
        text-gray-400
        leading-relaxed
      ">
        {description}
      </p>

    </div>
  );
}


/* =====================================================
   STEP
===================================================== */

function Step({
  number,
  icon,
  title,
  description,
}) {

  return (
    <div className="relative text-center">

      <div className="
        inline-flex
        items-center
        justify-center
        w-16
        h-16
        rounded-2xl
        bg-indigo-600/10
        border
        border-indigo-500/20
        text-2xl
        mb-5
      ">
        {icon}
      </div>

      <div className="
        text-indigo-400
        text-xs
        font-bold
        mb-2
      ">
        STEP {number}
      </div>

      <h3 className="
        font-bold
        text-lg
        mb-2
      ">
        {title}
      </h3>

      <p className="
        text-gray-500
        text-sm
        leading-relaxed
      ">
        {description}
      </p>

    </div>
  );
}