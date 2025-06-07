const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());

// Root route
app.get("/", (req, res) => {
    res.send(
        "✅ Weather API is running. Use /weather to get data based on your IP.",
    );
});

// Weather route
app.get("/weather", async (req, res) => {
    try {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        // Get location based on IP
        const geoRes = await axios.get(`http://ip-api.com/json/${ip}`);
        const city = geoRes.data.city;

        if (!city) throw new Error("City not found from IP.");

        // Fetch weather data
        const apiKey = "b512babe4fd716813ee5308de90c7c19"; // Replace with your real key
        const weatherRes = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
        );

        const weather = weatherRes.data;
        res.json({
            location: city,
            temperature: weather.main.temp,
            condition: weather.weather[0].main,
            description: weather.weather[0].description,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve weather data." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
