import express from "express";
import mqtt from "mqtt";
import path from "path"

// [_____ setup _____]
const app = express();
const PORT = process.env.PORT || 8888;
const DIRNAME = import.meta.dirname;
const BROKER_URL = process.env.BROKER_URL || "mqtt://localhost";

// [_____ MQTT Setup ______]
// Connect securely
// const mqttClient = mqtt.connect({
//     host: process.env.MQTT_HOST,
//     port: process.env.MQTT_PORT || 8883,
//     protocol: "mqtts",
//     username: process.env.MQTT_USER,
//     password: process.env.MQTT_PASS,
//     rejectUnauthorized: false
// });

const mqttClient = mqtt.connect("mqtt://localhost");

mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker");
    mqttClient.subscribe("test");
});

mqttClient.on("message", (topic, message) => {
    console.log(`Message from ${topic}: ${message.toString()}`);
});

mqttClient.on("error", (err) => {
    console.error("MQTT connection error:", err.message);
});

mqttClient.on("close", () => {
    console.log("MQTT connection closed");
});

mqttClient.on("reconnect", () => {
    console.log("MQTT reconnecting...");
});

// [_____ Web Endpoint Setup _____]
// Serve static assets
app.use(express.static(path.join(DIRNAME, '../public')));

// serve static HTML file (home page)
app.get("/", (req, res) => {
    res.sendFile(path.join(DIRNAME, "../public", "views", "index.html"));
});

app.get("/led/:state", (req, res) => {
    const state = req.params.state;
    console.log(`publishing state ${state} on channel commands`);
    // publish and respond when publish completes (or with error)
    mqttClient.publish("commands", JSON.stringify({ led: state }), (err) => {
        if (err) {
            console.error("Publish error:", err.message || err);
            return res.status(500).json({ error: "publish_failed" });
        }
        // success
        return res.status(200).json({ ok: true, led: state });
    });
});

// [_____ Start Server _____]
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});