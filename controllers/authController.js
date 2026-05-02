const db = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    db.run(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      [name, email, hash],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });

        res.json({ id: this.lastID, name, email });
      }
    );
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

   const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

    res.json({ token });
  });
};