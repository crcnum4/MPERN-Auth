const express = require("express");
const cors = require("cors");
const app = express();
const users = require("./routes/user");
const profiles = require("./routes/profile");

app.use(cors());
app.use(express.json());

// Routes //
app.use("/api/users", users);
app.use("/api/profiles", profiles);

const port = process.env.PORT || 4010;

app.listen(port, () => console.log(`Auth server listening on port ${port}`));
