require("dotenv").config();

const http = require("http");
const app = require("./App");
const { port } = require("./config/keys");

// create server
const server = http.createServer(app);

//listen server
server.listen(port, () => console.log(`Srever in running on port ${port}`));
