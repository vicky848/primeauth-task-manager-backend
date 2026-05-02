const db = require("../database/db");

exports.createTask = (req, res) => {
  const { title, description } = req.body;

  if (!req.user) {
    return res.status(401).json({ msg: "User not authorized" });
  }

  db.run(
    `INSERT INTO tasks (title, description, userId) VALUES (?, ?, ?)`,
    [title, description, req.user.id],
    function (err) {
      if (err) {
        console.log("CREATE ERROR:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json({ id: this.lastID, title, description });
    }
  );
};

exports.getTasks = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ msg: "User not authorized" });
  }

  db.all(
    `SELECT * FROM tasks WHERE userId = ?`,
    [req.user.id],
    (err, rows) => {
      if (err) {
        console.log("GET ERROR:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
};

exports.updateTask = (req, res) => {
  db.run(
    `UPDATE tasks SET title=?, description=? WHERE id=?`,
    [req.body.title, req.body.description, req.params.id],
    function (err) {
      if (err) {
        console.log("UPDATE ERROR:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json({ updated: this.changes });
    }
  );
};

exports.deleteTask = (req, res) => {
  db.run(`DELETE FROM tasks WHERE id=?`, [req.params.id], function (err) {
    if (err) {
      console.log("DELETE ERROR:", err.message);
      return res.status(500).json({ error: err.message });
    }

    res.json({ deleted: this.changes });
  });
};