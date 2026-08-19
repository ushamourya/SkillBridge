const express = require("express");

const router = express.Router();

// Change this path if your database file is somewhere else
const db = require("../db");

/*
=====================================================
GET USER PROGRESS
GET /progress/:userId
=====================================================
*/

router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT *
    FROM progress
    WHERE user_id = ?
    ORDER BY created_at ASC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Progress GET error:", err);

      return res.status(500).json({
        message: "Failed to load progress",
      });
    }

    res.json(results);
  });
});


/*
=====================================================
COMPLETE LEVEL
POST /progress
=====================================================
*/

router.post("/", (req, res) => {
  const {
    user_id,
    level_id,
    topic,
    step_index,
    status,
  } = req.body;

  if (!user_id || !level_id) {
    return res.status(400).json({
      message: "user_id and level_id are required",
    });
  }

  /*
  -----------------------------------------------
  CHECK IF LEVEL IS ALREADY COMPLETED
  -----------------------------------------------
  */

  const checkSql = `
    SELECT *
    FROM progress
    WHERE user_id = ?
    AND level_id = ?
  `;

  db.query(
    checkSql,
    [user_id, level_id],
    (checkErr, existing) => {

      if (checkErr) {
        console.error(
          "Progress check error:",
          checkErr
        );

        return res.status(500).json({
          message: "Failed to check progress",
        });
      }


      /*
      ---------------------------------------------
      ALREADY COMPLETED
      ---------------------------------------------
      */

      if (existing.length > 0) {

        return res.json({
          message: "Level already completed",
          completed: true,
        });

      }


      /*
      ---------------------------------------------
      SAVE PROGRESS
      ---------------------------------------------
      */

      const insertSql = `
        INSERT INTO progress
        (
          user_id,
          level_id,
          topic,
          step_index,
          status
        )
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [
          user_id,
          level_id,
          topic || "",
          step_index || 0,
          status || 1,
        ],
        (insertErr, result) => {

          if (insertErr) {
            console.error(
              "Progress insert error:",
              insertErr
            );

            return res.status(500).json({
              message: "Failed to save progress",
            });
          }


          /*
          =========================================
          BADGE SYSTEM
          =========================================
          */

          const badgeName =
            `${topic || "Learning"} Beginner`;

          const badgeIcon = "🏆";


          /*
          -----------------------------------------
          CHECK IF BADGE ALREADY EXISTS
          -----------------------------------------
          */

          const badgeCheckSql = `
            SELECT *
            FROM badges
            WHERE user_id = ?
            AND level_id = ?
          `;

          db.query(
            badgeCheckSql,
            [user_id, level_id],
            (badgeCheckErr, badgeExists) => {

              if (badgeCheckErr) {

                console.error(
                  "Badge check error:",
                  badgeCheckErr
                );

                return res.json({
                  message:
                    "Level completed successfully",
                  completed: true,
                });

              }


              /*
              -------------------------------------
              CREATE BADGE
              -------------------------------------
              */

              if (badgeExists.length === 0) {

                const badgeInsertSql = `
                  INSERT INTO badges
                  (
                    user_id,
                    level_id,
                    badge_name,
                    badge_icon
                  )
                  VALUES (?, ?, ?, ?)
                `;

                db.query(
                  badgeInsertSql,
                  [
                    user_id,
                    level_id,
                    badgeName,
                    badgeIcon,
                  ],
                  (badgeInsertErr) => {

                    if (badgeInsertErr) {

                      console.error(
                        "Badge insert error:",
                        badgeInsertErr
                      );

                    }

                    return res.json({
                      message:
                        "🎉 Level completed!",
                      completed: true,
                      badge: {
                        name: badgeName,
                        icon: badgeIcon,
                      },
                    });

                  }
                );

              } else {

                return res.json({
                  message:
                    "🎉 Level completed!",
                  completed: true,
                  badge: null,
                });

              }

            }
          );

        }
      );

    }
  );
});


/*
=====================================================
GET USER BADGES
GET /progress/badges/:userId
=====================================================
*/

router.get("/badges/:userId", (req, res) => {

  const { userId } = req.params;

  const sql = `
    SELECT *
    FROM badges
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(
    sql,
    [userId],
    (err, results) => {

      if (err) {

        console.error(
          "Badges GET error:",
          err
        );

        return res.status(500).json({
          message: "Failed to load badges",
        });

      }

      res.json(results);

    }
  );

});


module.exports = router;