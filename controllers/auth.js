const bcrypt = require("bcrypt");
const authRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const USERS = require("../data/users");
authRouter.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find((e) => e.username === username);
  const passValid = await bcrypt.compare(password, user.password);
  if (!(user && passValid)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }
  const userForToken = {
    username: user.username,
    iss: "foobar-backend.com",
    aud: "foobar-frontend.com",
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000 + 60 * 60),
  };
  const token = jwt.sign(userForToken, "secret");
  res.status(200).send({
    token,
    username: user.email,
    name: user.name,
  });
});
authRouter.post("/signup", async (req, res) => {
  const { name, email, password, phone, bio } = req.body;
  const user = USERS.find((e) => e.username === email);
  const passValid =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  if (user) {
    return res.status(400).send({
      error: "username not available",
    });
  }
  if (!passValid) {
    return res.status(400).send({
      error: "password does not match the criteria",
    });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const userId = USERS[USERS.length - 1].id + 1;
  let userToBe = {
    username: email,
    password: hashPassword,
    name: name,
    role: "user",
    phone: phone,
    bio: bio,
    id: userId,
  };
  USERS.push(userToBe);
  userToBe = Object.fromEntries(
    Object.entries(userToBe).filter(([key]) => !key.includes("password"))
  );
  res.status(201).send({ ...userToBe });
});
module.exports = authRouter;
