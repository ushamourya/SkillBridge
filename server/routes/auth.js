router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  console.log("DATA RECEIVED:", req.body); // DEBUG

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, hashedPassword], (err, result) => {
    
    if (err) {
      console.log("DB ERROR:", err);   // VERY IMPORTANT
      return res.status(500).json({ message: "DB Insert Failed", error: err });
    }

    console.log("DB RESULT:", result); // DEBUG

    return res.status(201).json({
      message: "User registered successfully"
    });
  });
});