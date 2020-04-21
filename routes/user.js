const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const config = require("../config/default");
const jwt = require("jsonwebtoken");

// @route		POST api/users/
// @desc		register new user
// @access	public
router.post("/", async (req, res) => {
  try {
    const { username, email } = req.body;
    let { password } = req.body;

    const salt = await bcrypt.genSalt(10);

    password = await bcrypt.hash(password, salt);

    const existingUser = await pool.query(
      "SELECT * FROM auth WHERE email=$1 OR username=$2",
      [email, username]
    );

    console.log(existingUser.rows);

    if (existingUser.rows.length) {
      console.log(existingUser.rows[0]);
      res.status(400).json({
        errors: {
          msg:
            existingUser.rows[0].username == username
              ? "Username taken"
              : "Email already registered",
        },
      });
    }

    let newUser = await pool.query(
      "INSERT INTO auth (username, password, email) VALUES($1, $2, $3) RETURNING *",
      [username, password, email]
    );
    newUser = newUser.rows[0];

    res.json(newUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error });
  }
});

// @route		POST api/users/login
// @desc		login user
// @access	public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await pool.query("SELECT * FROM auth WHERE username=$1", [
      username,
    ]);

    if (!user.rows.length)
      return res.status(404).json({ errors: { login: "invalid login" } });

    user = user.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // update login date
      pool.query("UPDATE auth SET last_login = NOW() WHERE auth_id = $1", [
        user.auth_id,
      ]);

      // generate token
      const payload = {
        id: user.auth_id,
        username: user.username,
      };

      const token = await jwt.sign(payload, config.secretOrKey, {});
      return res.json({ token });
    }
    return res.json({ errors: { login: "invalid login" } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error });
  }
});

module.exports = router;
