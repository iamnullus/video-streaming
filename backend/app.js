const express = require("express");
require("dotenv").config();
const DatabaseInit = require("./util/database_init.js");

const authRoute = require("./routes/authRoute.js");
const videoRoute = require("./routes/videoRoute.js");
const userRoute = require("./routes/userRoute.js");
const imageRoute = require("./routes/imageRoute.js");

PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/auth", authRoute);
app.use("/video", videoRoute);
app.use("/user", userRoute);
app.use("/image", imageRoute);

app.use((req, res) => {
  console.log("invalid route");
  res.status(404).json("invalid route");
});

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message || "server Error";
  const data = err.data;
  res.status(status).json({ message, data });
});

DatabaseInit(() => {
  app.listen(PORT, () => {
    console.log("listening on port: ", PORT);
  });
});
