const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const connectMongodb = require("./init/mongodb");
const { authRoute, categoryRoute, fileRoute, postRoute } = require("./routes");
const { errorHandler } = require("./middlewares");
const notFound = require("./controllers/notfound")

//init app
const app = express();

// connect mongodb
connectMongodb();

//third-party middleware
app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(morgan("dev")); // show the status code by api colling 

//route section
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/file", fileRoute);
app.use("/api/v1/posts", postRoute);

//not found route
app.use("*", notFound);

// error handling middleware
app.use(errorHandler);

module.exports = app;
