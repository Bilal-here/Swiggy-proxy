const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/api/swiggy", async (req, res) => {
  try {
    // Extract the full Swiggy API URL from the query params
    const swiggyApiUrl = req.query.url;
    if (!swiggyApiUrl || !swiggyApiUrl.startsWith("https://www.swiggy.com/")) {
      return res.status(400).json({ error: "Invalid Swiggy API URL" });
    }

    const response = await axios.get(swiggyApiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0", // Mimic a real browser request
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
});

app.listen(3001, () => console.log("Proxy server running on port 3001"));
