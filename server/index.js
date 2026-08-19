const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

/* =====================================================
   BADGE SYSTEM
===================================================== */

function getBadge(completedLevels) {
  const count = Number(completedLevels) || 0;

  if (count >= 10) {
    return {
      name: "LearnPath Champion",
      icon: "👑",
      level: 5,
      color: "purple",
      description: "You completed 10 or more levels!"
    };
  }

  if (count >= 5) {
    return {
      name: "Roadmap Master",
      icon: "🏆",
      level: 4,
      color: "yellow",
      description: "You completed 5 or more levels!"
    };
  }

  if (count >= 3) {
    return {
      name: "Rising Star",
      icon: "⭐",
      level: 3,
      color: "blue",
      description: "You completed 3 or more levels!"
    };
  }

  if (count >= 1) {
    return {
      name: "First Step",
      icon: "🥉",
      level: 2,
      color: "green",
      description: "You completed your first level!"
    };
  }

  return {
    name: "New Learner",
    icon: "🌱",
    level: 1,
    color: "gray",
    description: "Start learning to earn your first badge!"
  };
}


/* =====================================================
   GET USER BADGE
===================================================== */

function getUserBadge(userId, callback) {
  db.query(
    `
    SELECT COUNT(DISTINCT level_id) AS completed_levels
    FROM progress
    WHERE user_id = ?
      AND status = 1
      AND level_id IS NOT NULL
    `,
    [userId],
    (err, result) => {
      if (err) {
        console.error("BADGE ERROR:", err);

        return callback(err, {
          completed_levels: 0,
          badge: getBadge(0)
        });
      }

      const completedLevels =
        Number(result[0]?.completed_levels) || 0;

      callback(null, {
        completed_levels: completedLevels,
        badge: getBadge(completedLevels)
      });
    }
  );
}


/* =====================================================
   USER AUTH
===================================================== */

/* -----------------------------
   REGISTER
----------------------------- */

app.post("/api/auth/register", (req, res) => {
  const {
    name,
    email,
    password
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message:
        "Name, email and password are required"
    });
  }

  const hashed = bcrypt.hashSync(
    password,
    10
  );

  db.query(
    `
    INSERT INTO users
    (
      name,
      email,
      password
    )
    VALUES (?, ?, ?)
    `,
    [
      name,
      email,
      hashed
    ],
    (err, result) => {

      if (err) {
        console.error(
          "REGISTER ERROR:",
          err
        );

        if (
          err.code ===
          "ER_DUP_ENTRY"
        ) {
          return res.status(400).json({
            message:
              "Email already registered"
          });
        }

        return res.status(500).json({
          message:
            "Database error"
        });
      }

      res.json({
        message:
          "User registered successfully",

        user_id:
          result.insertId
      });
    }
  );
});


/* -----------------------------
   LOGIN
----------------------------- */

app.post("/api/auth/login", (req, res) => {

  const {
    email,
    password
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message:
        "Email and password are required"
    });
  }

  db.query(
    `
    SELECT *
    FROM users
    WHERE email = ?
    `,
    [email],
    (err, result) => {

      if (err) {
        console.error(
          "LOGIN ERROR:",
          err
        );

        return res.status(500).json({
          message:
            "Database error"
        });
      }

      if (!result.length) {
        return res.status(401).json({
          message:
            "Invalid credentials"
        });
      }

      const user = result[0];

      const ok =
        bcrypt.compareSync(
          password,
          user.password
        );

      if (!ok) {
        return res.status(401).json({
          message:
            "Invalid credentials"
        });
      }

      /*
        Get badge before sending
        login response.
      */

      getUserBadge(
        user.id,
        (badgeError, badgeData) => {

          if (badgeError) {
            console.error(
              "LOGIN BADGE ERROR:",
              badgeError
            );
          }

          res.json({

            message:
              "Login successful",

            user: {

              id:
                user.id,

              name:
                user.name,

              email:
                user.email,

              completed_levels:
                badgeData.completed_levels,

              badge:
                badgeData.badge
            }
          });
        }
      );
    }
  );
});


/* =====================================================
   USER PROFILE
===================================================== */

app.get(
  "/api/profile/:user_id",
  (req, res) => {

    const userId =
      req.params.user_id;

    db.query(
      `
      SELECT
        id,
        name,
        email,
        created_at
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [userId],
      (err, result) => {

        if (err) {
          console.error(
            "PROFILE ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to load profile"
          });
        }

        if (!result.length) {
          return res.status(404).json({
            message:
              "User not found"
          });
        }

        getUserBadge(
          userId,
          (badgeError, badgeData) => {

            if (badgeError) {
              return res.status(500).json({
                message:
                  "Failed to load badge"
              });
            }

            res.json({
              id:
                result[0].id,

              name:
                result[0].name,

              email:
                result[0].email,

              created_at:
                result[0].created_at,

              completed_levels:
                badgeData.completed_levels,

              badge:
                badgeData.badge
            });
          }
        );
      }
    );
  }
);


/* =====================================================
   ADMIN AUTH
===================================================== */

app.post(
  "/api/admin/login",
  (req, res) => {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required"
      });
    }

    db.query(
      `
      SELECT *
      FROM admins
      WHERE email = ?
      `,
      [email],
      (err, result) => {

        if (err) {
          console.error(
            "ADMIN LOGIN ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Database error"
          });
        }

        if (!result.length) {
          return res.status(401).json({
            message:
              "Invalid admin credentials"
          });
        }

        const admin = result[0];

        const ok =
          bcrypt.compareSync(
            password,
            admin.password
          );

        if (!ok) {
          return res.status(401).json({
            message:
              "Invalid admin credentials"
          });
        }

        res.json({
          message:
            "Admin login successful",

          admin: {
            id:
              admin.id,

            name:
              admin.name,

            email:
              admin.email
          }
        });
      }
    );
  }
);


/* =====================================================
   ADMIN USERS
===================================================== */

app.get(
  "/api/admin/users",
  (req, res) => {

    db.query(
      `
      SELECT
        id,
        name,
        email,
        created_at
      FROM users
      `,
      (err, result) => {

        if (err) {
          console.error(
            "ADMIN USERS ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Database error"
          });
        }

        res.json(result);
      }
    );
  }
);


/* =====================================================
   ADMIN - ROADMAP CRUD
===================================================== */

app.post(
  "/api/admin/roadmap",
  (req, res) => {

    const {
      goal,
      level,
      description
    } = req.body;

    if (
      !goal ||
      !goal.trim()
    ) {
      return res.status(400).json({
        message:
          "Goal is required"
      });
    }

    db.query(
      `
      INSERT INTO roadmaps
      (
        goal,
        level,
        description
      )
      VALUES (?, ?, ?)
      `,
      [
        goal.trim(),
        level || "",
        description || ""
      ],
      (err, result) => {

        if (err) {
          console.error(
            "CREATE ROADMAP ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to create roadmap"
          });
        }

        res.json({
          message:
            "Roadmap created",

          id:
            result.insertId
        });
      }
    );
  }
);


app.get(
  "/api/admin/roadmaps",
  (req, res) => {

    db.query(
      `
      SELECT *
      FROM roadmaps
      ORDER BY id DESC
      `,
      (err, result) => {

        if (err) {
          console.error(
            "GET ROADMAPS ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Database error"
          });
        }

        res.json(result);
      }
    );
  }
);


app.put(
  "/api/admin/roadmap/:id",
  (req, res) => {

    const {
      goal,
      level,
      description
    } = req.body;

    db.query(
      `
      UPDATE roadmaps
      SET
        goal = ?,
        level = ?,
        description = ?
      WHERE id = ?
      `,
      [
        goal,
        level,
        description,
        req.params.id
      ],
      (err) => {

        if (err) {
          console.error(
            "UPDATE ROADMAP ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to update roadmap"
          });
        }

        res.json({
          message:
            "Roadmap updated"
        });
      }
    );
  }
);


app.delete(
  "/api/admin/roadmap/:id",
  (req, res) => {

    db.query(
      `
      DELETE FROM roadmaps
      WHERE id = ?
      `,
      [req.params.id],
      (err) => {

        if (err) {
          console.error(
            "DELETE ROADMAP ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to delete roadmap"
          });
        }

        res.json({
          message:
            "Roadmap deleted"
        });
      }
    );
  }
);


/* =====================================================
   ADMIN - LEVEL CRUD
===================================================== */

app.post(
  "/api/admin/level",
  (req, res) => {

    const {
      roadmap_id,
      level_name,
      order_index
    } = req.body;

    if (
      !roadmap_id ||
      !level_name ||
      !level_name.trim()
    ) {
      return res.status(400).json({
        message:
          "Roadmap and level name are required"
      });
    }

    db.query(
      `
      INSERT INTO roadmap_levels
      (
        roadmap_id,
        level_name,
        order_index
      )
      VALUES (?, ?, ?)
      `,
      [
        roadmap_id,
        level_name.trim(),
        Number(order_index) || 0
      ],
      (err, result) => {

        if (err) {
          console.error(
            "CREATE LEVEL ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to create level",

            error:
              err.message
          });
        }

        res.json({
          message:
            "Level created",

          id:
            result.insertId
        });
      }
    );
  }
);


app.get(
  "/api/admin/levels/:roadmap_id",
  (req, res) => {

    db.query(
      `
      SELECT
        id,
        roadmap_id,
        level_name,
        order_index
      FROM roadmap_levels
      WHERE roadmap_id = ?
      ORDER BY order_index ASC, id ASC
      `,
      [req.params.roadmap_id],
      (err, result) => {

        if (err) {
          console.error(
            "GET LEVELS ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Database error",

            error:
              err.message
          });
        }

        res.json(result);
      }
    );
  }
);


app.put(
  "/api/admin/level/:id",
  (req, res) => {

    const {
      level_name,
      order_index
    } = req.body;

    db.query(
      `
      UPDATE roadmap_levels
      SET
        level_name = ?,
        order_index = ?
      WHERE id = ?
      `,
      [
        level_name,
        Number(order_index) || 0,
        req.params.id
      ],
      (err) => {

        if (err) {
          console.error(
            "UPDATE LEVEL ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to update level"
          });
        }

        res.json({
          message:
            "Level updated"
        });
      }
    );
  }
);


app.delete(
  "/api/admin/level/:id",
  (req, res) => {

    db.query(
      `
      DELETE FROM roadmap_levels
      WHERE id = ?
      `,
      [req.params.id],
      (err) => {

        if (err) {
          console.error(
            "DELETE LEVEL ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to delete level"
          });
        }

        res.json({
          message:
            "Level deleted"
        });
      }
    );
  }
);


/* =====================================================
   ADMIN - ROADMAP QUESTIONS
===================================================== */

app.post(
  "/api/admin/question",
  (req, res) => {

    const {
      level_id,
      question,
      answer,
      practice,
      type
    } = req.body;

    if (
      !level_id ||
      !question ||
      !question.trim() ||
      !answer ||
      !answer.trim()
    ) {
      return res.status(400).json({
        message:
          "Level, question and answer are required"
      });
    }

    db.query(
      `
      INSERT INTO roadmap_questions
      (
        level_id,
        question,
        answer,
        practice,
        type
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        level_id,
        question.trim(),
        answer.trim(),
        practice || "",
        type || ""
      ],
      (err, result) => {

        if (err) {
          console.error(
            "CREATE QUESTION ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to create question",

            error:
              err.message
          });
        }

        res.json({
          message:
            "Question created",

          id:
            result.insertId
        });
      }
    );
  }
);


app.get(
  "/api/admin/questions/:level_id",
  (req, res) => {

    db.query(
      `
      SELECT
        id,
        level_id,
        question,
        answer,
        practice,
        type
      FROM roadmap_questions
      WHERE level_id = ?
      ORDER BY id ASC
      `,
      [req.params.level_id],
      (err, result) => {

        if (err) {
          console.error(
            "GET QUESTIONS ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Database error",

            error:
              err.message
          });
        }

        res.json(result);
      }
    );
  }
);


app.put(
  "/api/admin/question/:id",
  (req, res) => {

    const {
      question,
      answer,
      practice,
      type
    } = req.body;

    db.query(
      `
      UPDATE roadmap_questions
      SET
        question = ?,
        answer = ?,
        practice = ?,
        type = ?
      WHERE id = ?
      `,
      [
        question,
        answer,
        practice || "",
        type || "",
        req.params.id
      ],
      (err) => {

        if (err) {
          console.error(
            "UPDATE QUESTION ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to update question"
          });
        }

        res.json({
          message:
            "Question updated"
        });
      }
    );
  }
);


app.delete(
  "/api/admin/question/:id",
  (req, res) => {

    db.query(
      `
      DELETE FROM roadmap_questions
      WHERE id = ?
      `,
      [req.params.id],
      (err) => {

        if (err) {
          console.error(
            "DELETE QUESTION ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to delete question"
          });
        }

        res.json({
          message:
            "Question deleted"
        });
      }
    );
  }
);


/* =====================================================
   USER - ROADMAPS
===================================================== */

app.get(
  "/api/roadmaps/:user_id",
  (req, res) => {

    db.query(
      `
      SELECT
        id,
        goal,
        level,
        description
      FROM roadmaps
      ORDER BY id DESC
      `,
      (err, result) => {

        if (err) {
          console.error(
            "USER ROADMAPS ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to load roadmaps"
          });
        }

        res.json(result);
      }
    );
  }
);


/* =====================================================
   USER - ONE ROADMAP
   LEVELS + QUESTIONS
===================================================== */

app.get(
  "/api/roadmap/:id",
  (req, res) => {

    const roadmapId =
      req.params.id;

    const levelSql = `
      SELECT
        id,
        roadmap_id,
        level_name,
        order_index
      FROM roadmap_levels
      WHERE roadmap_id = ?
      ORDER BY order_index ASC, id ASC
    `;

    db.query(
      levelSql,
      [roadmapId],
      (err, levels) => {

        if (err) {
          console.error(
            "USER ROADMAP LEVEL ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to load levels",

            error:
              err.message
          });
        }

        if (!levels.length) {
          return res.json([]);
        }

        const levelIds =
          levels.map(
            level => level.id
          );

        const placeholders =
          levelIds
            .map(() => "?")
            .join(",");

        const questionSql = `
          SELECT
            id,
            level_id,
            question,
            answer,
            practice,
            type
          FROM roadmap_questions
          WHERE level_id IN (${placeholders})
          ORDER BY id ASC
        `;

        db.query(
          questionSql,
          levelIds,
          (err, questions) => {

            if (err) {
              console.error(
                "USER ROADMAP QUESTION ERROR:",
                err
              );

              return res.status(500).json({
                message:
                  "Failed to load questions",

                error:
                  err.message
              });
            }

            const finalData =
              levels.map(level => {

                const levelQuestions =
                  questions.filter(
                    question =>
                      Number(
                        question.level_id
                      ) ===
                      Number(level.id)
                  );

                return {

                  level_id:
                    level.id,

                  roadmap_id:
                    level.roadmap_id,

                  level_name:
                    level.level_name,

                  order_index:
                    level.order_index,

                  questions:
                    levelQuestions.map(
                      question => ({
                        id:
                          question.id,

                        question:
                          question.question,

                        answer:
                          question.answer,

                        practice:
                          question.practice,

                        type:
                          question.type
                      })
                    )
                };
              });

            res.json(finalData);
          }
        );
      }
    );
  }
);


/* =====================================================
   USER PROGRESS
===================================================== */

/* -----------------------------
   GET PROGRESS
----------------------------- */

app.get(
  "/api/progress/:user_id",
  (req, res) => {

    const userId =
      req.params.user_id;

    db.query(
      `
      SELECT *
      FROM progress
      WHERE user_id = ?
      ORDER BY id DESC
      `,
      [userId],
      (err, result) => {

        if (err) {
          console.error(
            "GET PROGRESS ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to load progress"
          });
        }

        getUserBadge(
          userId,
          (badgeError, badgeData) => {

            if (badgeError) {
              return res.json({
                progress: result,
                completed_levels: 0,
                badge:
                  getBadge(0)
              });
            }

            /*
              Keep backward compatibility:
              the frontend can still use
              response.data as an array.

              Badge information is included
              separately in headers below.
            */

            res.setHeader(
              "X-Completed-Levels",
              badgeData.completed_levels
            );

            res.setHeader(
              "X-Badge",
              encodeURIComponent(
                JSON.stringify(
                  badgeData.badge
                )
              )
            );

            res.json(result);
          }
        );
      }
    );
  }
);


/* -----------------------------
   SAVE PROGRESS
----------------------------- */

app.post(
  "/api/progress",
  (req, res) => {

    const {
      user_id,
      level_id,
      topic,
      step_index,
      status
    } = req.body;

    if (!user_id) {
      return res.status(400).json({
        message:
          "User ID is required"
      });
    }

    /*
      Prevent duplicate completed
      levels.

      If the level is already
      completed, update it instead
      of inserting another row.
    */

    db.query(
      `
      SELECT id
      FROM progress
      WHERE user_id = ?
        AND level_id = ?
        AND status = 1
      LIMIT 1
      `,
      [
        user_id,
        level_id
      ],
      (checkErr, existing) => {

        if (checkErr) {
          console.error(
            "CHECK PROGRESS ERROR:",
            checkErr
          );

          return res.status(500).json({
            message:
              "Failed to check progress"
          });
        }

        /* -------------------------
           ALREADY COMPLETED
        ------------------------- */

        if (existing.length) {

          getUserBadge(
            user_id,
            (badgeError, badgeData) => {

              if (badgeError) {
                return res.status(500).json({
                  message:
                    "Failed to calculate badge"
                });
              }

              return res.json({

                message:
                  "Level already completed",

                already_completed:
                  true,

                id:
                  existing[0].id,

                completed_levels:
                  badgeData.completed_levels,

                badge:
                  badgeData.badge
              });
            }
          );

          return;
        }


        /* -------------------------
           SAVE NEW PROGRESS
        ------------------------- */

        db.query(
          `
          INSERT INTO progress
          (
            user_id,
            level_id,
            topic,
            step_index,
            status
          )
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            user_id,
            level_id || null,
            topic || null,
            step_index || 0,
            status || 0
          ],
          (err, result) => {

            if (err) {
              console.error(
                "SAVE PROGRESS ERROR:",
                err
              );

              return res.status(500).json({
                message:
                  "Failed to save progress",

                error:
                  err.message
              });
            }

            /*
              Calculate the user's
              new badge immediately.
            */

            getUserBadge(
              user_id,
              (badgeError, badgeData) => {

                if (badgeError) {

                  return res.json({

                    message:
                      "Progress saved",

                    id:
                      result.insertId,

                    completed_levels:
                      0,

                    badge:
                      getBadge(0)
                  });
                }

                res.json({

                  message:
                    "Progress saved",

                  id:
                    result.insertId,

                  completed_levels:
                    badgeData.completed_levels,

                  badge:
                    badgeData.badge
                });
              }
            );
          }
        );
      }
    );
  }
);


/* =====================================================
   PRACTICE
===================================================== */

/* -----------------------------
   USER - ALL PRACTICE
----------------------------- */

app.get(
  "/api/practice",
  (req, res) => {

    db.query(
      `
      SELECT
        id,
        topic,
        question,
        starter_code,
        solution_code,
        expected_output,
        language,
        created_at
      FROM practice_questions
      ORDER BY id DESC
      `,
      (err, result) => {

        if (err) {
          console.error(
            "GET PRACTICE ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to load practice questions",

            error:
              err.message
          });
        }

        res.json(result);
      }
    );
  }
);


/* -----------------------------
   USER - ONE PRACTICE
----------------------------- */

app.get(
  "/api/practice/:topic",
  (req, res) => {

    const value =
      req.params.topic;

    let sql;
    let params;

    if (!isNaN(value)) {

      sql = `
        SELECT
          id,
          topic,
          question,
          starter_code,
          solution_code,
          expected_output,
          language
        FROM practice_questions
        WHERE id = ?
        LIMIT 1
      `;

      params = [
        Number(value)
      ];

    } else {

      sql = `
        SELECT
          id,
          topic,
          question,
          starter_code,
          solution_code,
          expected_output,
          language
        FROM practice_questions
        WHERE topic = ?
        ORDER BY id ASC
        LIMIT 1
      `;

      params = [
        decodeURIComponent(value)
      ];
    }

    db.query(
      sql,
      params,
      (err, result) => {

        if (err) {
          console.error(
            "PRACTICE LOAD ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to load practice question",

            error:
              err.message
          });
        }

        if (!result.length) {
          return res.status(404).json({
            message:
              "Practice question not found"
          });
        }

        const practice =
          result[0];

        res.json({

          id:
            practice.id,

          topic:
            practice.topic,

          question:
            practice.question,

          starter_code:
            practice.starter_code || "",

          solution_code:
            practice.solution_code || "",

          expected_output:
            practice.expected_output || "",

          language:
            practice.language || "html"
        });
      }
    );
  }
);


/* =====================================================
   ADMIN - PRACTICE
===================================================== */

app.get(
  "/api/admin/practice",
  (req, res) => {

    db.query(
      `
      SELECT
        id,
        topic,
        question,
        starter_code,
        solution_code,
        expected_output,
        language,
        created_at
      FROM practice_questions
      ORDER BY id DESC
      `,
      (err, result) => {

        if (err) {
          console.error(
            "ADMIN PRACTICE LOAD ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to load practice questions",

            error:
              err.message
          });
        }

        res.json(result);
      }
    );
  }
);


app.get(
  "/api/admin/practice/:id",
  (req, res) => {

    db.query(
      `
      SELECT
        id,
        topic,
        question,
        starter_code,
        solution_code,
        expected_output,
        language,
        created_at
      FROM practice_questions
      WHERE id = ?
      LIMIT 1
      `,
      [req.params.id],
      (err, result) => {

        if (err) {
          console.error(
            "ADMIN PRACTICE GET ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to load practice question"
          });
        }

        if (!result.length) {
          return res.status(404).json({
            message:
              "Practice question not found"
          });
        }

        res.json(result[0]);
      }
    );
  }
);


app.post(
  "/api/admin/practice",
  (req, res) => {

    const {
      topic,
      question,
      starter_code,
      solution_code,
      expected_output,
      language
    } = req.body;

    if (
      !topic ||
      !topic.trim() ||
      !question ||
      !question.trim()
    ) {
      return res.status(400).json({
        message:
          "Topic and question are required"
      });
    }

    db.query(
      `
      INSERT INTO practice_questions
      (
        topic,
        question,
        starter_code,
        solution_code,
        expected_output,
        language
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        topic.trim(),
        question.trim(),
        starter_code || "",
        solution_code || "",
        expected_output || "",
        language || "html"
      ],
      (err, result) => {

        if (err) {
          console.error(
            "CREATE PRACTICE ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to create practice question",

            error:
              err.message
          });
        }

        res.json({
          message:
            "Practice question created",

          id:
            result.insertId
        });
      }
    );
  }
);


app.put(
  "/api/admin/practice/:id",
  (req, res) => {

    const {
      topic,
      question,
      starter_code,
      solution_code,
      expected_output,
      language
    } = req.body;

    if (
      !topic ||
      !topic.trim() ||
      !question ||
      !question.trim()
    ) {
      return res.status(400).json({
        message:
          "Topic and question are required"
      });
    }

    db.query(
      `
      UPDATE practice_questions
      SET
        topic = ?,
        question = ?,
        starter_code = ?,
        solution_code = ?,
        expected_output = ?,
        language = ?
      WHERE id = ?
      `,
      [
        topic.trim(),
        question.trim(),
        starter_code || "",
        solution_code || "",
        expected_output || "",
        language || "html",
        req.params.id
      ],
      (err) => {

        if (err) {
          console.error(
            "UPDATE PRACTICE ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to update practice question"
          });
        }

        res.json({
          message:
            "Practice question updated"
        });
      }
    );
  }
);


app.delete(
  "/api/admin/practice/:id",
  (req, res) => {

    db.query(
      `
      DELETE FROM practice_questions
      WHERE id = ?
      `,
      [req.params.id],
      (err) => {

        if (err) {
          console.error(
            "DELETE PRACTICE ERROR:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to delete practice question"
          });
        }

        res.json({
          message:
            "Practice question deleted"
        });
      }
    );
  }
);


/* =====================================================
   SERVER
===================================================== */

app.listen(3000, () => {

  console.log(
    "================================="
  );

  console.log(
    "LearnPath AI Backend"
  );

  console.log(
    "Server running on:"
  );

  console.log(
    "http://localhost:3000"
  );

  console.log(
    "================================="
  );
});