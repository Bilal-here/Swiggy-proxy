const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/swiggy/*", async (req, res) => {
  try {
    const swiggyPath = req.params[0]; // Capture dynamic API path
    const queryParams = req._parsedUrl.search || ""; // Include query params

    const swiggyApiUrl = `https://www.swiggy.com/${swiggyPath}${queryParams}`;
    
    const response = await axios.get(swiggyApiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
