import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  /* =====================================================
     START LEARNING
  ===================================================== */

  const goToLearning = () => {
    navigate("/login", {
      state: {
        from: "/dashboard",
      },
    });
  };


  /* =====================================================
     PRACTICE
  ===================================================== */

  const goToPractice = () => {
    navigate("/login", {
      state: {
        from: "/practice-hub",
      },
    });
  };


  return (
    <section className="
      relative
      min-h-[75vh]
      flex
      items-center
      justify-center
      px-6
      overflow-hidden
    ">

      {/* =================================================
          BACKGROUND GLOW
      ================================================= */}

      <div className="
        absolute
        inset-0
        pointer-events-none
      ">

        <div className="
          absolute
          top-20
          left-1/4
          w-96
          h-96
          bg-indigo-600/20
          blur-[140px]
          rounded-full
        " />

        <div className="
          absolute
          bottom-0
          right-1/4
          w-96
          h-96
          bg-purple-600/20
          blur-[140px]
          rounded-full
        " />

      </div>


      {/* =================================================
          HERO CONTENT
      ================================================= */}

      <div className="
        relative
        text-center
        max-w-5xl
        mx-auto
      ">


        {/* LABEL */}

        <div className="
          inline-flex
          items-center
          gap-2
          px-4
          py-2
          rounded-full
          bg-indigo-500/10
          border
          border-indigo-500/20
          text-indigo-400
          text-sm
          font-semibold
          mb-6
        ">
          ⚡ AI-Powered Learning Platform
        </div>


        {/* =================================================
            HEADING
        ================================================= */}

        <h1 className="
          text-5xl
          md:text-7xl
          font-bold
          leading-tight
          bg-gradient-to-r
          from-indigo-400
          via-purple-400
          to-cyan-400
          text-transparent
          bg-clip-text
        ">
          Learn Smarter.
          <br />
          Build Faster.
        </h1>


        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <p className="
          text-gray-400
          mt-6
          text-lg
          md:text-xl
          max-w-2xl
          mx-auto
          leading-relaxed
        ">
          AI-powered learning roadmaps that help you
          learn programming, practice coding, and build
          the skills you need for your career.
        </p>


        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="
          flex
          flex-col
          sm:flex-row
          items-center
          justify-center
          gap-4
          mt-10
        ">


          {/* =================================================
              START LEARNING
          ================================================= */}

          <button
            onClick={goToLearning}
            className="
              px-8
              py-4
              rounded-xl
              bg-indigo-600
              hover:bg-indigo-500
              text-white
              font-bold
              text-lg
              shadow-lg
              shadow-indigo-600/20
              hover:scale-105
              transition
            "
          >
            Start Learning →
          </button>


          {/* =================================================
              PRACTICE CODING
          ================================================= */}

          <button
            onClick={goToPractice}
            className="
              px-8
              py-4
              rounded-xl
              bg-white/5
              hover:bg-white/10
              border
              border-white/10
              hover:border-indigo-500/40
              text-white
              font-semibold
              text-lg
              hover:scale-105
              transition
            "
          >
            ⚡ Practice Coding
          </button>

        </div>


        {/* =================================================
            BOTTOM TEXT
        ================================================= */}

        <p className="
          text-gray-600
          text-sm
          mt-6
        ">
          Learn at your own pace • Practice real problems •
          Track your progress
        </p>

      </div>

    </section>
  );
}