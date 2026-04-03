import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";

function FacultyPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myInventions, setMyInventions] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("facultyUser");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      axios
        .get(`${API_BASE_URL}/inventions`)
        .then((response) => {
          const allInventions = response.data || [];

          const facultyInventions = allInventions.filter((item) => {
            const itemEmail = (item.faculty_email || "").toLowerCase().trim();
            const userEmail = (parsedUser.email || "").toLowerCase().trim();

            const itemInventor = (item.inventor || "").toLowerCase().trim();
            const userName = (parsedUser.full_name || "").toLowerCase().trim();

            return (
              (itemEmail && userEmail && itemEmail === userEmail) ||
              (itemInventor && userName && itemInventor === userName)
            );
          });

          setMyInventions(facultyInventions);

          const docs = facultyInventions.flatMap((inv) =>
            (inv.documents || []).map((doc) => ({
              ...doc,
              inventionTitle: inv.title,
              status: inv.status,
            }))
          );

          setRecentDocuments(docs.slice(0, 3));
        })
        .catch((error) => {
          console.error("Error fetching faculty portal data:", error);
        })
        .finally(() => {
          setLoadingData(false);
        });
    } catch (error) {
      console.error("Error reading faculty user:", error);
      localStorage.removeItem("facultyUser");
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="page-container">
        <h1>Loading Faculty Portal...</h1>
      </div>
    );
  }

  const latestSubmission = myInventions.length > 0 ? myInventions[0] : null;
  const totalDocuments = myInventions.reduce(
    (count, invention) => count + (invention.documents?.length || 0),
    0
  );

  const sectionCardStyle = {
    marginBottom: "16px",
    padding: "18px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
  };

  const compactBoxStyle = {
    minHeight: "90px",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    borderLeft: "4px solid #f2c300",
  };

  return (
    <div
      className="page-container"
      style={{
        paddingTop: "20px",
        paddingBottom: "26px",
        background: "#f5f6f8",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: "14px",
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <img
          src="/logos/ttio-logo.png"
          alt="TTIO Logo"
          style={{
            width: "220px",
            height: "auto",
            objectFit: "contain",
          }}
        />

        <div>
          <h1 style={{ marginBottom: "4px", fontSize: "32px" }}>
            Faculty Innovation Portal
          </h1>
          <p style={{ margin: 0 }}>
            Welcome, <strong>{user.full_name}</strong>
          </p>
        </div>
      </div>

      <p style={{ marginBottom: "16px" }}>
        Manage your invention disclosures and TTIO submissions.
      </p>

      {/* PROFILE */}
      <div style={sectionCardStyle}>
        <h2>Faculty Profile</h2>

        <div className="info-grid" style={{ gap: "10px" }}>
          <div style={compactBoxStyle}>
            <strong>Name</strong>
            <p>{user.full_name}</p>
          </div>

          <div style={compactBoxStyle}>
            <strong>Email</strong>
            <p>{user.email}</p>
          </div>

          <div style={compactBoxStyle}>
            <strong>Department</strong>
            <p>{user.department}</p>
          </div>

          <div style={compactBoxStyle}>
            <strong>Role</strong>
            <p>{user.role}</p>
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div style={sectionCardStyle}>
        <h2>Activity Summary</h2>

        <div className="info-grid" style={{ gap: "10px" }}>
          <div style={compactBoxStyle}>
            <strong>Total Submissions</strong>
            <p>{loadingData ? "..." : myInventions.length}</p>
          </div>

          <div style={compactBoxStyle}>
            <strong>Total Documents</strong>
            <p>{loadingData ? "..." : totalDocuments}</p>
          </div>

          <div style={compactBoxStyle}>
            <strong>Latest Submission</strong>
            <p>{latestSubmission?.title || "-"}</p>
          </div>

          <div style={compactBoxStyle}>
            <strong>Status</strong>
            <p>{latestSubmission?.status || "-"}</p>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div style={sectionCardStyle}>
        <h2>Quick Actions</h2>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link to="/submit-invention" className="btn-primary">
            Submit Invention
          </Link>

          <Link to="/dashboard" className="btn-primary">
            Open Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FacultyPortal;