const Prometheus = require("prom-client");

const register = new Prometheus.Registry();
Prometheus.collectDefaultMetrics({ register });
console.log(register.metrics());

const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2], // Bucket boundaries for the histogram
});

const counter = new Prometheus.Counter({
  name: "http_requests_total_sengo",
  help: "Total number of HTTP requests",
  labelNames: ["method", "path"],
});




// Gauge: For values that can increase or decrease (e.g., temperature, current user count):
const temperatureGauge = new Prometheus.Gauge({
    name: "temperature_celsius",
    help: "Current temperature in Celsius",
  });


// Summary: For quantiles and percentiles of a distribution (e.g., request latency):
const requestLatencySummary = new Prometheus.Summary({
    name: "request_latency_seconds",
    help: "Request latency in seconds",
    maxAge: 60 * 60, // Expose quantiles for the past hour
    ageBuckets: 5,
    quantiles: [0.05, 0.5, 0.95],
  });


// Histogram: For tracking the distribution of a metric (e.g., request sizes):

const requestSizeHistogram = new Prometheus.Histogram({
    name: "request_size_bytes",
    help: "Request size in bytes",
    buckets: [1024, 2048, 4096, 8192, 16384],
  });

register.registerMetric(counter);
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(requestLatencySummary);
register.registerMetric(requestSizeHistogram);
register.registerMetric(temperatureGauge);


module.exports = { counter, register, httpRequestDurationMicroseconds,requestLatencySummary,requestSizeHistogram,temperatureGauge };
