const http = require("http");

require("dotenv").config();

const application = require("./app");
const { mongoConnect: connectToMongo } = require("./services/mongo");

const PORT = process.env.PORT || 8000;

const server = http.createServer(application);

async function startServer() {
  await connectToMongo();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
