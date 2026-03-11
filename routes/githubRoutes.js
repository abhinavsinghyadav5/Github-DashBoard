const express = require("express");
const router = express.Router();
const axios = require("axios");
const calculateMetrics = require("../utils/metricsCalculator");

router.get("/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const profileRes = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`
        }
      }
    );

    const reposRes = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`
        }
      }
    );

    const profile = profileRes.data;
    const repos = reposRes.data;

    const metrics = calculateMetrics(repos);

    res.json({
      profile,
      ...metrics
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Error fetching GitHub data" });
  }
});

module.exports = router;