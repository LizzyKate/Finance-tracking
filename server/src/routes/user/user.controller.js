const { createUser, signIn } = require("../../models/user.model");

async function httpCreateNewUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ error: "Email and password are required" });
  }
  try {
    const newUser = await createUser({ email, password });
    res.status(201).send(newUser);
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(409).send({ error: error.message });
    }
    return res.status(500).send({ error: error.message });
  }
}

async function httpSignIn(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ error: "Email and password are required" });
  }

  try {
    const user = await signIn({ email, password });
    res.status(200).send(user);
  } catch (error) {
    if (
      error.message === "User does not exist" ||
      error.message === "Password is incorrect"
    ) {
      return res.status(401).send({ error: error.message });
    }
    return res.status(500).send({ error: error.message });
  }
}

module.exports = {
  httpCreateNewUser,
  httpSignIn,
};
