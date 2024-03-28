const profileRouter = require("express").Router();
const USERS = require("../data/users");
profileRouter.get("/", (request, response) => {
  const allUsers = USERS.map((e) => {
    return {
      name: e.name,
      email: e.email,
      phone: e.phone,
      bio: e.bio,
      public: e.public,
    };
  });
  console.log(request.decodedUser.role);
  if (request.decodedUser.role === "admin") {
    response.status(200).send(allUsers);
  } else {
    const publicUsers = allUsers
      .filter((e) => e.public === true)
      .map((e) => {
        return {
          name: e.name,
          email: e.email,
          phone: e.phone,
          bio: e.bio,
        };
      });
    response.status(200).send(publicUsers);
  }
});

profileRouter.get("/:id", (request, response) => {
  const profile = USERS.find((e) => e.id === request.params.id);
  if (!profile) {
    return response.status(404).send({
      error: "resorce not found",
    });
  }
  console.log(request.decodedUser.sub, request.params.id);
  if (
    request.decodedUser.sub !== request.params.id &&
    profile.public === false
  ) {
    return response.status(401).send({
      error: "access denied",
    });
  }
  response
    .status(200)
    .send(
      Object.fromEntries(
        Object.entries(profile).filter(([key]) => !key.includes("password"))
      )
    );
});
profileRouter.put("/:id", (request, response) => {
  if (request.decodedUser.id !== request.params.id) {
    return response.status(401).send({
      error: "access denied",
    });
  }
  const updates = request.body;
  if (
    updates.hasOwnProperty("role") ||
    updates.hasOwnProperty("id") !== request.params.id
  ) {
    return response.status(401).send({
      error: "access denied",
    });
  }
  const userIndex = USERS.findIndex((e) => e.id === request.params.id);
  if (updates.email && updates.email !== USERS[userIndex].email) {
    const sameEmailUser = USERS.find((e) => e.username === updates.email);
    if (sameEmailUser) {
      return response.status(400).send({
        error: "username already exist",
      });
    }
  }

  if (userIndex === -1) {
    response.status(400).send({
      error: "bad request",
    });
    USERS[userIndex] = { ...USERS[userIndex], updates };
    response.status(200).send({
      id: USERS[userIndex].id,
      name: USERS[userIndex].name,
      email: USERS[userIndex].username,
      phone: USERS[userIndex].phone,
      bio: USERS[userIndex].bio,
    });
  }
});
module.exports = profileRouter;
