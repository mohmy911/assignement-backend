const app = require("../app");
const supertest = require("supertest");
const USERS = require("../data/users");
const api = supertest(app);

describe("User crettion with initial 3 users", () => {
  test("user creation with fresh username", async () => {
    const userAtStart = USERS.length;
    const newUser = {
      name: "mohit",
      email: "mohit@hotmail.com",
      password: "Hello@213",
      phone: "+91232444421",
      bio: "hello brother",
    };
    const result = await api
      .post("/api/auth/signup")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(USERS).toHaveLength(userAtStart + 1);
    const usernames = USERS.map((u) => u.username);
    expect(usernames).toContain(result.body.username);
  });
});
