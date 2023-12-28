const express = require("express");
require("dotenv").config();
const app = express();
const connect = require("./db.js");
const UserModel = require("./models/Post.js");
app.use(express.json());
require("dotenv").config();
app.get("/", (req, res) => {
  res.send("home page");
});

app.post("/post", async (req, res) => {
  const { name, age } = req.body;
  try {
    const user = await UserModel.create(req.body);
    res.json({ msg: `user created ${user.name}` });
  } catch (err) {
    res.send(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    const { name, sortBy, sortOrder, page, lim } = req.query;

    const filter = {};
    if (name) {
      filter.name = { $regex: new RegExp(name, "i") };
    }

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const skip = (page - 1) * lim;
    const limit = parseInt(lim);

    const users = await UserModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  try {
    await connect;
    console.log(`server is running at PORT ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});
