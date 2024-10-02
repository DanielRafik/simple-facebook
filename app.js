const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const {httpRequestDurationMicroseconds,temperatureGauge,requestLatencySummary,requestSizeHistogram} = require("./metrics")
const {register} = require("./metrics")


app.get("/api", (req, res) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.status(200).send("Hello, Prometheus!");
  end({ route: "/api", code: 200, method: req.method });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

require("dotenv").config();
require("./utils/databaseConnection");

// routers;
const userRoute = require("./routes/userRoutes");
const postRoute = require("./routes/postRoutes");

// endpoints
app.use("/user", userRoute);
app.use("/post", postRoute);

app.get("/health", (req, res) => {
  console.log("Health check ✅");
  res.status(200).send("Health check ✅");
});

app.get('/', (req, res) => {
  // You can manipulate the metrics here
  temperatureGauge.set(Math.random() * 100); // Set random temperature
  requestLatencySummary.observe(Math.random()); // Simulate request latency
  requestSizeHistogram.observe(Math.random() * 5000); // Simulate request size

  res.send('Hello World');
});

app.get("/metrics", (req, res) => {
  register
    .metrics()
    .then((metrics) => {
      res.set("Content-Type", register.contentType);
      res.end(metrics); // Send the metrics
    })
    .catch((err) => {
      console.error("Error fetching metrics:", err);
      res.status(500).end(err);
    });
});

app.listen(5000, () => {
  console.log("Server running on 5000!");
});


