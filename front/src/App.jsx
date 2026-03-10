import "./App.css";
import { useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

function App() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!username) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/github/${username}`
      );

      setData(res.data);
    } catch (error) {
      setError("❌ GitHub user not found");
    }

    setLoading(false);
  };

  const chartData = data
    ? {
        labels: ["Stars", "Forks"],
        datasets: [
          {
            label: "GitHub Stats",
            data: [data.totalStars, data.totalForks],
            backgroundColor: [
              "rgba(54, 162, 235, 0.7)",
              "rgba(255, 99, 132, 0.7)"
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(255, 99, 132, 1)"
            ],
            borderWidth: 1
          }
        ]
      }
    : null;

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "Arial",
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",
        padding: "40px",
        maxWidth: "1100px",
        margin: "auto"
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          marginBottom: "30px",
          color: "#1f2937"
        }}
      >
        GitHub Analytics Dashboard
      </h1>

      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      <button
        onClick={fetchData}
        disabled={loading}
        style={{
          padding: "10px 20px",
          marginLeft: "10px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#4f46e5",
          color: "white",
          cursor: "pointer"
        }}
      >
        {loading ? "Loading..." : "Analyze"}
      </button>

      {/* Loading */}
      {loading && (
        <div style={{ marginTop: "20px", fontSize: "18px" }}>
          ⏳ Fetching GitHub Data...
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ marginTop: "20px", color: "red", fontSize: "18px" }}>
          {error}
        </div>
      )}

      {data && (
        <div style={{ marginTop: "40px" }}>

          {/* Profile Card */}
          {data.profile && (
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                width: "420px",
                margin: "30px auto",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}
            >
              <img
                src={data.profile.avatar_url}
                alt="avatar"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%"
                }}
              />

              <div style={{ textAlign: "left" }}>
                <h3 style={{ margin: "0" }}>{data.profile.login}</h3>

                <p style={{ margin: "5px 0" }}>
                  {data.profile.bio || "No bio available"}
                </p>

                <p style={{ margin: "5px 0" }}>
                  👥 Followers: {data.profile.followers} | Following:{" "}
                  {data.profile.following}
                </p>
              </div>
            </div>
          )}

          <h2 style={{ marginTop: "20px", color: "#374151" }}>
            Repository Metrics
          </h2>

          {/* Dashboard Cards */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "20px",
              flexWrap: "wrap"
            }}
          >
            <div style={cardStyle}>
              <h3>Repos</h3>
              <p>{data.totalRepos}</p>
            </div>

            <div style={cardStyle}>
              <h3>Stars</h3>
              <p>{data.totalStars}</p>
            </div>

            <div style={cardStyle}>
              <h3>Forks</h3>
              <p>{data.totalForks}</p>
            </div>

            <div style={cardStyle}>
              <h3>Language</h3>
              <p>{data.topLanguage}</p>
            </div>
          </div>

          <h2 style={{ marginTop: "40px", color: "#374151" }}>
            Repository Analytics
          </h2>

          {/* Bar Chart */}
          <div style={{ width: "450px", margin: "40px auto" }}>
            <Bar data={chartData} />
          </div>

          {/* Pie Chart */}
          {data.languageDistribution && (
            <div
              style={{
                width: "450px",
                margin: "40px auto",
                background: "white",
                padding: "20px",
                borderRadius: "10px"
              }}
            >
              <h2>Language Distribution</h2>

              <Pie
                data={{
                  labels: Object.keys(data.languageDistribution),
                  datasets: [
                    {
                      label: "Repositories",
                      data: Object.values(data.languageDistribution),
                      backgroundColor: [
                        "#6366f1",
                        "#22c55e",
                        "#f59e0b",
                        "#ef4444",
                        "#06b6d4",
                        "#a855f7",
                        "#10b981",
                        "#f97316"
                      ]
                    }
                  ]
                }}
              />
            </div>
          )}

          {/* Top Repositories */}
          {data.topRepos && (
            <div
              style={{
                width: "500px",
                margin: "40px auto",
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}
            >
              <h2>⭐ Top Repositories</h2>

              {data.topRepos.map((repo, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                    borderBottom: "1px solid #eee"
                  }}
                >
                  <span>
                    {index + 1}.{" "}
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "none", color: "#4f46e5" }}
                    >
                      {repo.name}
                    </a>
                  </span>

                  <span>⭐ {repo.stars}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

     
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  width: "140px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  transition: "0.2s"
};

export default App;

