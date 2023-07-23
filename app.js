const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");
const app = express();
const dbase = path.join(__dirname, "userData.db");
app.use(express.json());
let db = null;
const intializedbserver = async () => {
  try {
    db = await open({
      filename: dbase,
      driver: sqlite3.Database,
    });
    app.use(3000, () => {
      console.log("Server is running");
    });
  } catch (e) {
    console.log(`Db error :${e.message}`);
    process.exit(1);
  }
};
intializedbserver();
app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const hashedpswd = await bcrypt.hash(request.body.password, 10);
  const getuser = `select * from user where username="${username}";`;
  const dbuser = await db.get(getuser);
  if (dbuser === undefined) {
    const createuser = `insert into user(username,name,password,gender,location) values("${username}","${name}","${hashedpswd}","${gender}","${location}")`;
    if (password.length() < 5) {
      response.status = 400;
      response.send("Password is too short");
    } else {
      const dbresponse = await db.run(createuser);
      response.status = 200;
      response.send("User created successfully");
    }
  } else {
    response.status = 400;
    response.send("User already exists");
  }
});
module.exports = app;
