import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../api";


export default function Practice() {

  const {
    topic,
  } = useParams();

  const navigate =
    useNavigate();


  /* =====================================================
     STATE
  ===================================================== */

  const [practice, setPractice] =
    useState(null);

  const [code, setCode] =
    useState("");

  const [output, setOutput] =
    useState("");

  const [result, setResult] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [attempts, setAttempts] =
    useState(0);

  const [showSolution, setShowSolution] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);


  const iframeRef =
    useRef(null);


  /* =====================================================
     NORMALIZE OUTPUT
  ===================================================== */

  const normalize = (
    value
  ) => {

    return String(
      value || ""
    )
      .replace(/\r/g, "")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  };


  /* =====================================================
     LOAD PRACTICE
  ===================================================== */

  useEffect(() => {

    if (!topic) {
      return;
    }


    const loadPractice =
      async () => {

        try {

          setLoading(true);

          setResult("");

          setOutput("");

          setAttempts(0);

          setShowSolution(false);

          setSubmitted(false);


          console.log(
            "Loading practice topic:",
            topic
          );


          const res =
            await API.get(
              `/practice/${encodeURIComponent(
                topic
              )}`
            );


          console.log(
            "Practice data:",
            res.data
          );


          setPractice(
            res.data
          );


          setCode(
            res.data.starter_code || ""
          );


        } catch (err) {

          console.error(
            "Practice load error:",
            err
          );


          setPractice(null);


          setResult(
            "❌ Practice question could not be loaded."
          );

        } finally {

          setLoading(false);

        }

      };


    loadPractice();

  }, [topic]);


  /* =====================================================
     IFRAME MESSAGE
  ===================================================== */

  useEffect(() => {

    const handleMessage =
      (event) => {

        if (!event.data) {
          return;
        }


        if (
          event.data.type !==
          "PRACTICE_OUTPUT"
        ) {
          return;
        }


        const actualOutput =
          String(
            event.data.output || ""
          ).trim();


        setOutput(
          actualOutput
        );


        if (!practice) {
          return;
        }


        const expectedOutput =
          String(
            practice.expected_output || ""
          ).trim();


        console.log(
          "Expected:",
          expectedOutput
        );


        console.log(
          "Actual:",
          actualOutput
        );


        /*
          Do not automatically count an attempt here.

          The user must click
          "Submit Answer".
        */

      };


    window.addEventListener(
      "message",
      handleMessage
    );


    return () => {

      window.removeEventListener(
        "message",
        handleMessage
      );

    };

  }, [practice]);


  /* =====================================================
     HTML / CSS RUNNER
  ===================================================== */

  const runHTML =
    () => {

      if (!iframeRef.current) {
        return;
      }


      setResult("");

      setOutput("");


      const userCode =
        code;


      const outputScript = `
<script>

(function () {

  function sendOutput() {

    try {

      var text =
        document.body
          ? document.body.innerText
          : "";

      window.parent.postMessage(
        {
          type: "PRACTICE_OUTPUT",
          output: text
        },
        "*"
      );

    } catch (error) {

      window.parent.postMessage(
        {
          type: "PRACTICE_OUTPUT",
          output:
            "Error: " +
            error.message
        },
        "*"
      );

    }

  }


  window.addEventListener(
    "load",
    function () {

      setTimeout(
        sendOutput,
        100
      );

    }
  );

})();

</script>
`;


      let finalHTML =
        userCode;


      if (
        userCode
          .toLowerCase()
          .includes("</body>")
      ) {

        finalHTML =
          userCode.replace(
            /<\/body>/i,
            outputScript +
            "</body>"
          );

      } else {

        finalHTML =
          userCode +
          outputScript;

      }


      iframeRef.current.srcdoc =
        finalHTML;

    };


  /* =====================================================
     JAVASCRIPT RUNNER
  ===================================================== */

  const runJavaScript =
    () => {

      if (!iframeRef.current) {
        return;
      }


      setResult("");

      setOutput("");


      const safeCode =
        JSON.stringify(
          code
        );


      const html = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
JavaScript Runner
</title>

</head>


<body>

<div id="output"></div>


<script>

(function () {

  var outputElement =
    document.getElementById(
      "output"
    );


  var logs = [];


  console.log =
    function () {

      var text =
        Array
          .from(arguments)
          .map(
            function (value) {

              return String(value);

            }
          )
          .join(" ");


      logs.push(text);


      outputElement.innerText =
        logs.join("\\n");

    };


  try {

    var userCode =
      ${safeCode};


    eval(userCode);

  } catch (error) {

    outputElement.innerText =
      "Error: " +
      error.message;

  }


  setTimeout(
    function () {

      window.parent.postMessage(
        {
          type:
            "PRACTICE_OUTPUT",

          output:
            outputElement.innerText
        },
        "*"
      );

    },
    300
  );


})();

</script>


</body>

</html>
`;


      iframeRef.current.srcdoc =
        html;

    };


  /* =====================================================
     RUN CODE
  ===================================================== */

  const runCode =
    () => {

      if (!practice) {
        return;
      }


      if (!code.trim()) {

        setResult(
          "⚠️ Please write some code first."
        );

        return;

      }


      const language =
        (
          practice.language ||
          "html"
        ).toLowerCase();


      if (
        language === "javascript" ||
        language === "js"
      ) {

        runJavaScript();

      } else {

        runHTML();

      }

    };


  /* =====================================================
     SUBMIT ANSWER
  ===================================================== */

  const submitAnswer =
    () => {

      if (!practice) {
        return;
      }


      if (!code.trim()) {

        setResult(
          "⚠️ Please write some code first."
        );

        return;

      }


      /*
        First run the code.
      */

      runCode();


      /*
        Give iframe a little time
        to produce the output.
      */

      setTimeout(() => {

        const currentOutput =
          output;


        const expectedOutput =
          String(
            practice.expected_output || ""
          ).trim();


        /*
          Compare the latest output.

          Since iframe output updates
          asynchronously, we also inspect
          the iframe document directly.
        */

        let actual =
          currentOutput;


        try {

          if (
            iframeRef.current &&
            iframeRef.current.contentDocument
          ) {

            actual =
              iframeRef.current
                .contentDocument
                .body
                ?.innerText || "";

          }

        } catch (error) {

          console.log(
            "Could not read iframe:",
            error
          );

        }


        actual =
          String(
            actual || ""
          ).trim();


        console.log(
          "SUBMIT EXPECTED:",
          expectedOutput
        );


        console.log(
          "SUBMIT ACTUAL:",
          actual
        );


        /*
          CORRECT
        */

        if (
          normalize(actual) ===
          normalize(expectedOutput)
        ) {

          setResult(
            "✅ Correct! Excellent work. Your answer is correct."
          );

          setSubmitted(true);

          return;

        }


        /*
          INCORRECT
        */

        setAttempts(
          (previous) => {

            const newAttempts =
              previous + 1;


            /*
              After 2 failed attempts,
              automatically show solution.
            */

            if (
              newAttempts >= 2
            ) {

              setShowSolution(true);

              setResult(
                "❌ Incorrect again. Don't worry! The solution is shown below so you can learn from it."
              );

            } else {

              setResult(
                "❌ Incorrect answer. Try again! You have " +
                (2 - newAttempts) +
                " attempt left before the solution is shown."
              );

            }


            return newAttempts;

          }
        );

      }, 500);

    };


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
     NOT FOUND
  ===================================================== */

  if (!practice) {

    return (

      <div className="
        min-h-screen
        bg-black
        text-white
        p-10
      ">

        <h1 className="
          text-3xl
          text-red-400
        ">
          Practice question not found
        </h1>


        <p className="
          text-gray-400
          mt-4
        ">

          Topic:{" "}

          {decodeURIComponent(
            topic || ""
          )}

        </p>


        <button
          onClick={() =>
            navigate("/practice-hub")
          }
          className="
            mt-6
            px-5
            py-3
            rounded-lg
            bg-indigo-600
            hover:bg-indigo-500
            font-semibold
          "
        >
          ← Back to Practice
        </button>

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
        max-w-6xl
        mx-auto
      ">


        {/* =================================================
            TOP NAVIGATION
        ================================================= */}

        <div className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
          mb-6
        ">

          <button
            onClick={() =>
              navigate("/practice-hub")
            }
            className="
              w-fit
              px-5
              py-2
              rounded-lg
              bg-white/5
              border
              border-white/10
              text-gray-300
              hover:text-white
              hover:bg-white/10
              transition
            "
          >
            ← Back to Practice
          </button>


          {/* ATTEMPTS */}

          <div className="
            px-4
            py-2
            rounded-lg
            bg-white/5
            border
            border-white/10
            text-sm
          ">

            <span className="text-gray-400">
              Attempts:
            </span>

            <span className="
              ml-2
              font-bold
              text-indigo-400
            ">
              {attempts} / 2
            </span>

          </div>

        </div>


        {/* =================================================
            TITLE
        ================================================= */}

        <h1 className="
          text-4xl
          font-bold
          text-indigo-400
          mb-6
        ">

          ⚡ {practice.topic}

        </h1>


        {/* =================================================
            QUESTION
        ================================================= */}

        <div className="
          bg-gray-900
          border
          border-gray-700
          rounded-xl
          p-6
          mb-6
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-4
          ">
            📝 Question
          </h2>


          <p className="
            text-xl
            leading-relaxed
          ">
            {practice.question}
          </p>


          {/* LANGUAGE */}

          <div className="mt-5">

            <span className="text-gray-400">
              Language:
            </span>

            <span className="
              ml-2
              text-indigo-400
              font-bold
            ">
              {practice.language}
            </span>

          </div>


          {/* EXPECTED OUTPUT */}

          {practice.expected_output && (

            <div className="mt-5">

              <p className="
                text-gray-400
                mb-2
              ">
                Expected output:
              </p>


              <div className="
                bg-black
                border
                border-gray-700
                rounded-lg
                p-4
                text-green-400
                font-mono
                whitespace-pre-wrap
              ">

                {practice.expected_output}

              </div>

            </div>

          )}

        </div>


        {/* =================================================
            EDITOR
        ================================================= */}

        <div className="mb-6">

          <h2 className="
            text-xl
            font-bold
            mb-3
          ">
            💻 Write your code
          </h2>


          <textarea
            value={code}
            onChange={(e) =>
              setCode(
                e.target.value
              )
            }
            spellCheck={false}
            className="
              w-full
              h-80
              bg-gray-900
              text-green-300
              border
              border-gray-600
              rounded-xl
              p-5
              font-mono
              text-base
              outline-none
              resize-y
              focus:border-indigo-500
            "
          />

        </div>


        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="
          grid
          sm:grid-cols-2
          gap-4
        ">


          {/* RUN */}

          <button
            onClick={runCode}
            disabled={submitted}
            className="
              bg-green-600
              hover:bg-green-500
              disabled:bg-gray-700
              disabled:cursor-not-allowed
              text-white
              font-bold
              py-4
              rounded-xl
              transition
            "
          >
            ▶ Run Code
          </button>


          {/* SUBMIT */}

          <button
            onClick={submitAnswer}
            disabled={submitted}
            className="
              bg-indigo-600
              hover:bg-indigo-500
              disabled:bg-gray-700
              disabled:cursor-not-allowed
              text-white
              font-bold
              py-4
              rounded-xl
              transition
            "
          >
            {submitted
              ? "✅ Submitted"
              : "📤 Submit Answer"}
          </button>

        </div>


        {/* =================================================
            RESULT
        ================================================= */}

        {result && (

          <div
            className={`
              mt-5
              p-5
              rounded-xl
              border
              text-lg
              font-bold

              ${
                result.startsWith("✅")
                  ? "bg-green-900/40 border-green-500 text-green-300"

                  : result.startsWith("⚠️")
                  ? "bg-yellow-900/40 border-yellow-500 text-yellow-300"

                  : "bg-red-900/40 border-red-500 text-red-300"
              }
            `}
          >

            {result}

          </div>

        )}


        {/* =================================================
            OUTPUT
        ================================================= */}

        <div className="mt-8">

          <h2 className="
            text-2xl
            font-bold
            text-indigo-400
            mb-3
          ">
            🖥️ Output
          </h2>


          <div className="
            bg-gray-900
            border
            border-gray-700
            rounded-xl
            p-5
            mb-5
            min-h-[80px]
          ">

            {output ? (

              <pre className="
                text-green-400
                font-mono
                whitespace-pre-wrap
              ">
                {output}
              </pre>

            ) : (

              <p className="text-gray-500">
                Click "Run Code" to see the output.
              </p>

            )}

          </div>


          {/* =================================================
              LIVE PREVIEW
          ================================================= */}

          <h3 className="
            text-lg
            font-bold
            text-white
            mb-3
          ">
            👀 Live Preview
          </h3>


          <div className="
            bg-white
            rounded-xl
            overflow-hidden
          ">

            <iframe
              ref={iframeRef}
              title="Code Output"
              sandbox="allow-scripts"
              className="
                w-full
                h-72
                border-0
              "
            />

          </div>

        </div>


        {/* =================================================
            SOLUTION
        ================================================= */}

        {showSolution && (

          <div className="
            mt-10
            rounded-2xl
            border
            border-yellow-500/40
            bg-yellow-950/20
            overflow-hidden
          ">

            {/* SOLUTION HEADER */}

            <div className="
              p-5
              border-b
              border-yellow-500/20
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-3
            ">

              <div>

                <h2 className="
                  text-2xl
                  font-bold
                  text-yellow-400
                ">
                  💡 Solution
                </h2>

                <p className="
                  text-gray-400
                  text-sm
                  mt-1
                ">
                  You have tried twice. Review the solution and understand how it works.
                </p>

              </div>

            </div>


            {/* SOLUTION CODE */}

            <div className="p-5">

              {practice.solution_code ? (

                <pre className="
                  bg-black
                  border
                  border-gray-700
                  rounded-xl
                  p-5
                  overflow-x-auto
                  text-green-300
                  font-mono
                  text-sm
                  whitespace-pre-wrap
                ">
                  {practice.solution_code}
                </pre>

              ) : (

                <div className="
                  p-5
                  rounded-xl
                  bg-red-900/20
                  border
                  border-red-500/30
                ">

                  <p className="
                    text-red-400
                    font-semibold
                  ">
                    ⚠️ No solution was found in the database.
                  </p>

                  <p className="
                    text-gray-500
                    text-sm
                    mt-2
                  ">
                    Make sure your database column is named exactly:
                  </p>

                  <code className="
                    block
                    mt-2
                    text-yellow-400
                  ">
                    solution_code
                  </code>

                </div>

              )}

            </div>

          </div>

        )}


        {/* =================================================
            SHOW SOLUTION BUTTON
        ================================================= */}

        {!showSolution &&
          attempts >= 2 &&
          practice.solution_code && (

            <button
              onClick={() =>
                setShowSolution(true)
              }
              className="
                mt-6
                w-full
                py-4
                rounded-xl
                bg-yellow-600
                hover:bg-yellow-500
                text-white
                font-bold
                transition
              "
            >
              💡 Show Solution
            </button>

          )}


        {/* =================================================
            CORRECT MESSAGE
        ================================================= */}

        {submitted && (

          <div className="
            mt-6
            p-5
            rounded-xl
            bg-green-900/20
            border
            border-green-500/30
            text-center
          ">

            <p className="
              text-green-400
              font-bold
              text-lg
            ">
              🎉 Great job!
            </p>

            <p className="
              text-gray-400
              mt-2
            ">
              You solved this practice problem correctly.
            </p>


            <button
              onClick={() =>
                navigate("/practice-hub")
              }
              className="
                mt-4
                px-6
                py-3
                rounded-lg
                bg-indigo-600
                hover:bg-indigo-500
                font-semibold
              "
            >
              ← Back to Practice Hub
            </button>

          </div>

        )}

      </div>

    </div>

  );

}