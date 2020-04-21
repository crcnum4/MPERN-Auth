const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

// @route		POST api/profiles
// @desc		create new profile
// @access	private
router.post("/", auth, async (req, res) => {
  const { first_name, last_name, avatar, github, cohort } = req.body;

  try {
    let profile = await pool.query(
      "SELECT auth_id FROM profile WHERE auth_id = $1",
      [req.user.id]
    );
    if (profile.rows.length)
      return res
        .status(401)
        .json({ errors: { profile: "Profile already exists" } });

    let newProfile = await pool.query(
      "INSERT INTO profile (auth_id, first_name, last_name, avatar, github, cohort) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [req.user.id, first_name, last_name, avatar, github, cohort]
    );

    newProfile = newProfile.rows[0];
    res.json(newProfile);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error });
  }
});

// @route		GET api/profiles/
// @desc		get logged in users profile
// @access	private
router.get("/", auth, async (req, res) => {
  try {
    console.log(req.user.id);
    let userProfile = await pool.query(
      "SELECT * FROM profile WHERE auth_id = $1",
      [req.user.id]
    );

    if (!userProfile.rows.length)
      return res
        .status(404)
        .json({ errors: { profile: "No profile for user" } });

    return res.json(userProfile.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error });
  }
});

module.exports = router;
