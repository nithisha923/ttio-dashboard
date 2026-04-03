import React, { useEffect, useMemo, useState } from "react";
import API_BASE_URL from "../config/api";

const ADMIN_STATUS_OPTIONS = [
  "Submitted",
  "Under Review",
  "IP Evaluation",
  "Validation",
  "Prototype",
  "Startup Pathway",
  "Approved",
  "Rejected",
  "Closed",
];

function Dashboard() {
  const [inventions, setInventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const [statusSelections, setStatusSelections] = useState({});
  const [updatingStatusId, setUpdatingStatusId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const loggedInFaculty = useMemo(() => {
    const raw = localStorage.getItem("facultyUser");
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error("Error parsing facultyUser from localStorage:", error);
      return null;
    }
  }, []);

  const currentUserRole = (loggedInFaculty?.role || "faculty")
    .toString()
    .trim()
    .toLowerCase();

  const isAdminView =
    currentUserRole === "admin" ||
    currentUserRole === "ttio" ||
    currentUserRole === "staff";

  useEffect(() => {
    fetchInventions();
  }, []);

  const fetchInventions = async () => {
    try {
      setLoading(true);
      setError("");
      setStatusMessage("");

      const response = await fetch(`${API_BASE_URL}/inventions`);

      if (!response.ok) {
        throw new Error("Failed to fetch inventions");
      }

      const data = await response.json();

      const normalizedData = Array.isArray(data)
        ? data.map((item) => ({
            id: item.id,
            title: item.title || "Untitled",
            description: item.description || "",
            problem: item.problem || item.problem_statement || "",
            solution: item.solution || "",
            inventor: item.inventor || "",
            department: item.department || "",
            status: item.status || "Submitted",
            faculty_email:
              item.faculty_email ||
              item.email ||
              item.submitted_by ||
              item.submitted_by_email ||
              "",
            created_at:
              item.created_at ||
              item.submitted_at ||
              item.createdAt ||
              item.date_created ||
              null,
            documents:
              item.documents ||
              item.supporting_documents ||
              item.files ||
              [],
          }))
        : [];

      setInventions(normalizedData);

      const initialSelections = {};
      normalizedData.forEach((item) => {
        initialSelections[item.id] = item.status || "Submitted";
      });
      setStatusSelections(initialSelections);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const currentFacultyEmail = (loggedInFaculty?.email || "")
    .toString()
    .trim()
    .toLowerCase();

  const currentFacultyName = (
    loggedInFaculty?.full_name ||
    loggedInFaculty?.name ||
    ""
  )
    .toString()
    .trim()
    .toLowerCase();

  const visibleInventions = useMemo(() => {
    if (isAdminView) {
      return inventions;
    }

    return inventions.filter((item) => {
      const itemEmail = (item.faculty_email || "")
        .toString()
        .trim()
        .toLowerCase();

      const itemInventor = (item.inventor || "")
        .toString()
        .trim()
        .toLowerCase();

      const matchesEmail =
        currentFacultyEmail &&
        itemEmail &&
        itemEmail === currentFacultyEmail;

      const matchesInventor =
        currentFacultyName &&
        itemInventor &&
        itemInventor === currentFacultyName;

      return matchesEmail || matchesInventor;
    });
  }, [inventions, isAdminView, currentFacultyEmail, currentFacultyName]);

  const statusOptions = useMemo(() => {
    const uniqueStatuses = [...new Set(visibleInventions.map((i) => i.status))];
    return ["All", ...uniqueStatuses];
  }, [visibleInventions]);

  const filteredAndSortedInventions = useMemo(() => {
    let result = [...visibleInventions];

    if (statusFilter !== "All") {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((item) => {
        const matchesTitle = (item.title || "").toLowerCase().includes(term);

        if (isAdminView) {
          const matchesInventor = (item.inventor || "")
            .toLowerCase()
            .includes(term);
          const matchesDepartment = (item.department || "")
            .toLowerCase()
            .includes(term);
          const matchesEmail = (item.faculty_email || "")
            .toLowerCase()
            .includes(term);

          return (
            matchesTitle ||
            matchesInventor ||
            matchesDepartment ||
            matchesEmail
          );
        }

        return matchesTitle;
      });
    }

    result.sort((a, b) => {
      if (sortBy === "latest") {
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bDate - aDate;
      }

      if (sortBy === "oldest") {
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
        return aDate - bDate;
      }

      if (sortBy === "title_az") {
        return (a.title || "").localeCompare(b.title || "");
      }

      if (sortBy === "title_za") {
        return (b.title || "").localeCompare(a.title || "");
      }

      return 0;
    });

    return result;
  }, [visibleInventions, statusFilter, searchTerm, sortBy, isAdminView]);

  const dashboardStats = useMemo(() => {
    const total = visibleInventions.length;
    const submitted = visibleInventions.filter(
      (item) => (item.status || "").toLowerCase() === "submitted"
    ).length;
    const underReview = visibleInventions.filter(
      (item) => (item.status || "").toLowerCase() === "under review"
    ).length;
    const totalDocuments = visibleInventions.reduce((sum, item) => {
      return sum + (Array.isArray(item.documents) ? item.documents.length : 0);
    }, 0);

    return {
      total,
      submitted,
      underReview,
      totalDocuments,
    };
  }, [visibleInventions]);

  const getStatusBadgeStyle = (status) => {
    const normalized = (status || "").toLowerCase();

    if (normalized === "submitted") {
      return {
        backgroundColor: "#fff7d6",
        color: "#8a6a00",
        border: "1px solid #f2c300",
      };
    }

    if (normalized === "under review") {
      return {
        backgroundColor: "#eef4ff",
        color: "#1d4ed8",
        border: "1px solid #bfd4ff",
      };
    }

    if (normalized === "ip evaluation") {
      return {
        backgroundColor: "#f5ecff",
        color: "#7c3aed",
        border: "1px solid #dbc7ff",
      };
    }

    if (normalized === "validation") {
      return {
        backgroundColor: "#ecfeff",
        color: "#0f766e",
        border: "1px solid #a5f3fc",
      };
    }

    if (normalized === "prototype") {
      return {
        backgroundColor: "#eef2ff",
        color: "#4338ca",
        border: "1px solid #c7d2fe",
      };
    }

    if (normalized === "startup pathway") {
      return {
        backgroundColor: "#f0fdf4",
        color: "#15803d",
        border: "1px solid #bbf7d0",
      };
    }

    if (normalized === "approved") {
      return {
        backgroundColor: "#eaf8ee",
        color: "#15803d",
        border: "1px solid #b8e3c4",
      };
    }

    if (normalized === "rejected") {
      return {
        backgroundColor: "#feeceb",
        color: "#b42318",
        border: "1px solid #f6c3bf",
      };
    }

    if (normalized === "closed") {
      return {
        backgroundColor: "#f3f4f6",
        color: "#374151",
        border: "1px solid #d1d5db",
      };
    }

    return {
      backgroundColor: "#f3f4f6",
      color: "#374151",
      border: "1px solid #e5e7eb",
    };
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString();
  };

  const handleStatusSelectionChange = (inventionId, newStatus) => {
    setStatusSelections((prev) => ({
      ...prev,
      [inventionId]: newStatus,
    }));
  };

  const handleStatusUpdate = async (inventionId) => {
    const selectedStatus = statusSelections[inventionId];

    if (!selectedStatus) return;

    try {
      setUpdatingStatusId(inventionId);
      setStatusMessage("");

      const response = await fetch(
        `${API_BASE_URL}/inventions/${inventionId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: selectedStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setInventions((prev) =>
        prev.map((item) =>
          item.id === inventionId
            ? { ...item, status: selectedStatus }
            : item
        )
      );

      setStatusMessage("Status updated successfully.");
    } catch (err) {
      console.error("Status update error:", err);
      setStatusMessage("Failed to update status.");
    } finally {
      setUpdatingStatusId("");
    }
  };

  const renderDocuments = (documents) => {
    if (!documents || documents.length === 0) {
      return (
        <div
          style={{
            background: "#f9fafb",
            border: "1px dashed #d1d5db",
            borderRadius: "12px",
            padding: "14px",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          No supporting documents uploaded.
        </div>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {documents.map((doc, index) => {
          const fileName =
            doc.original_filename ||
            doc.file_name ||
            doc.filename ||
            doc.name ||
            `Document ${index + 1}`;

          const fileType = doc.file_type || doc.content_type || "Unknown file";
          const fileSize = doc.file_size || doc.size;
          const secureUrl = doc.secure_view_url || null;

          return (
            <div
              key={doc.id || `${fileName}-${index}`}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "14px",
                background: "#ffffff",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  color: "#111827",
                  fontSize: "14px",
                  marginBottom: "4px",
                  wordBreak: "break-word",
                }}
              >
                {fileName}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  wordBreak: "break-word",
                }}
              >
                {fileType}
                {fileSize ? ` • ${fileSize} bytes` : ""}
              </div>

              {secureUrl ? (
                <a
                  href={secureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "10px",
                    background: "#111111",
                    color: "#ffffff",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  Open Document
                </a>
              ) : (
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "13px",
                    color: "#9ca3af",
                  }}
                >
                  Secure document link unavailable
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8f8f8 0%, #f3f4f6 45%, #eeeeee 100%)",
        padding: "32px 20px 48px",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "32px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  background: "#fff7d6",
                  color: "#8a6a00",
                  border: "1px solid #f2c300",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "700",
                  marginBottom: "14px",
                }}
              >
                {isAdminView ? "TTIO Admin Dashboard" : "TTIO Faculty Dashboard"}
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "36px",
                  fontWeight: "800",
                  color: "#111827",
                  lineHeight: "1.15",
                }}
              >
                {isAdminView ? "TTIO Activity Dashboard" : "My Inventions Dashboard"}
              </h1>

              <p
                style={{
                  marginTop: "10px",
                  marginBottom: 0,
                  color: "#6b7280",
                  fontSize: "16px",
                  lineHeight: "1.7",
                  maxWidth: "760px",
                }}
              >
                {isAdminView
                  ? "Review all faculty innovation activity, invention submissions, supporting documents, and status updates in one place."
                  : "Review your innovation activity, invention submissions, supporting documents, and status updates in one place."}
              </p>
            </div>

            <div
              style={{
                minWidth: "220px",
                background: "#111111",
                color: "#ffffff",
                borderRadius: "18px",
                padding: "18px 20px",
                boxShadow: "0 10px 24px rgba(17,17,17,0.18)",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#d1d5db",
                  marginBottom: "8px",
                }}
              >
                Logged in as
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  wordBreak: "break-word",
                }}
              >
                {loggedInFaculty?.email || "Faculty User"}
              </div>
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  color: "#d1d5db",
                  textTransform: "capitalize",
                }}
              >
                Role: {currentUserRole}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            <div
              style={{
                background: "#fffdf5",
                border: "1px solid #f2c300",
                borderLeft: "6px solid #f2c300",
                borderRadius: "18px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#8a6a00",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                Total Inventions
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#111827",
                  lineHeight: 1,
                }}
              >
                {dashboardStats.total}
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderLeft: "6px solid #f2c300",
                borderRadius: "18px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#6b7280",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                Submitted
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#111827",
                  lineHeight: 1,
                }}
              >
                {dashboardStats.submitted}
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderLeft: "6px solid #f2c300",
                borderRadius: "18px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#6b7280",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                Under Review
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#111827",
                  lineHeight: 1,
                }}
              >
                {dashboardStats.underReview}
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderLeft: "6px solid #f2c300",
                borderRadius: "18px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#6b7280",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                Documents
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#111827",
                  lineHeight: 1,
                }}
              >
                {dashboardStats.totalDocuments}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "24px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#111827",
                }}
              >
                Filter and Sort
              </h2>
              <p
                style={{
                  margin: "6px 0 0 0",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                {isAdminView
                  ? "Search, filter, and sort all faculty invention records."
                  : "Search, filter by status, and sort your invention records."}
              </p>
            </div>

            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "999px",
                padding: "8px 14px",
                fontSize: "14px",
                color: "#374151",
                fontWeight: "600",
              }}
            >
              Showing {filteredAndSortedInventions.length} invention
              {filteredAndSortedInventions.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "700",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                {isAdminView ? "Search by Title, Faculty, Department, or Email" : "Search by Title"}
              </label>
              <input
                type="text"
                placeholder={
                  isAdminView
                    ? "Search all invention records..."
                    : "Search inventions..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  outline: "none",
                  fontSize: "14px",
                  background: "#ffffff",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "700",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  outline: "none",
                  fontSize: "14px",
                  backgroundColor: "#fff",
                }}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "700",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  outline: "none",
                  fontSize: "14px",
                  backgroundColor: "#fff",
                }}
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title_az">Title A-Z</option>
                <option value="title_za">Title Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "16px 20px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              marginBottom: "24px",
              color: statusMessage.toLowerCase().includes("failed")
                ? "#b91c1c"
                : "#15803d",
              fontWeight: "700",
            }}
          >
            {statusMessage}
          </div>
        )}

        {loading ? (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "28px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              fontSize: "15px",
              color: "#4b5563",
            }}
          >
            Loading dashboard...
          </div>
        ) : error ? (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "28px",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              fontSize: "15px",
            }}
          >
            {error}
          </div>
        ) : filteredAndSortedInventions.length === 0 ? (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "40px 28px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "#fff7d6",
                border: "1px solid #f2c300",
                margin: "0 auto 18px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
              }}
            >
              📁
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "800",
                color: "#111827",
              }}
            >
              No inventions found
            </h3>

            <p
              style={{
                maxWidth: "620px",
                margin: "12px auto 0 auto",
                color: "#6b7280",
                fontSize: "15px",
                lineHeight: "1.8",
              }}
            >
              {isAdminView
                ? "There are no invention records to display right now."
                : "There are no invention records to display for this faculty account right now. Once a submission is saved successfully, it will appear here with its details, supporting documents, and current status."}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: "22px",
            }}
          >
            {filteredAndSortedInventions.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "24px",
                  padding: "24px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "14px",
                    marginBottom: "18px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#8a6a00",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        marginBottom: "8px",
                      }}
                    >
                      {isAdminView ? "Faculty Invention Record" : "Invention Record"}
                    </div>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: "22px",
                        lineHeight: "1.35",
                        color: "#111827",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.title}
                    </h2>
                  </div>

                  <span
                    style={{
                      ...getStatusBadgeStyle(item.status),
                      padding: "7px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "800",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                {isAdminView && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "12px",
                      marginBottom: "18px",
                    }}
                  >
                    <div
                      style={{
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: "14px",
                        padding: "12px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          fontWeight: "700",
                          marginBottom: "6px",
                          textTransform: "uppercase",
                        }}
                      >
                        Faculty
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#111827",
                          fontWeight: "700",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.inventor || "Not available"}
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: "14px",
                        padding: "12px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          fontWeight: "700",
                          marginBottom: "6px",
                          textTransform: "uppercase",
                        }}
                      >
                        Department
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#111827",
                          fontWeight: "700",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.department || "Not available"}
                      </div>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "12px",
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      padding: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        fontWeight: "700",
                        marginBottom: "6px",
                        textTransform: "uppercase",
                      }}
                    >
                      Submitted
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#111827",
                        fontWeight: "700",
                      }}
                    >
                      {formatDate(item.created_at)}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      padding: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        fontWeight: "700",
                        marginBottom: "6px",
                        textTransform: "uppercase",
                      }}
                    >
                      Documents
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#111827",
                        fontWeight: "700",
                      }}
                    >
                      {Array.isArray(item.documents) ? item.documents.length : 0}
                    </div>
                  </div>
                </div>

                {isAdminView && (
                  <div style={{ marginBottom: "18px" }}>
                    <div
                      style={{
                        fontWeight: "800",
                        color: "#111827",
                        marginBottom: "8px",
                        fontSize: "14px",
                      }}
                    >
                      Faculty Email
                    </div>
                    <div
                      style={{
                        margin: 0,
                        color: "#4b5563",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        background: "#fcfcfc",
                        border: "1px solid #f0f0f0",
                        borderRadius: "14px",
                        padding: "14px",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.faculty_email || "Not available"}
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: "18px" }}>
                  <div
                    style={{
                      fontWeight: "800",
                      color: "#111827",
                      marginBottom: "8px",
                      fontSize: "14px",
                    }}
                  >
                    Description
                  </div>
                  <div
                    style={{
                      margin: 0,
                      color: "#4b5563",
                      fontSize: "14px",
                      lineHeight: "1.8",
                      background: "#fcfcfc",
                      border: "1px solid #f0f0f0",
                      borderRadius: "14px",
                      padding: "14px",
                    }}
                  >
                    {item.description || "No description provided."}
                  </div>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <div
                    style={{
                      fontWeight: "800",
                      color: "#111827",
                      marginBottom: "8px",
                      fontSize: "14px",
                    }}
                  >
                    Problem Statement
                  </div>
                  <div
                    style={{
                      margin: 0,
                      color: "#4b5563",
                      fontSize: "14px",
                      lineHeight: "1.8",
                      background: "#fcfcfc",
                      border: "1px solid #f0f0f0",
                      borderRadius: "14px",
                      padding: "14px",
                    }}
                  >
                    {item.problem || "No problem statement provided."}
                  </div>
                </div>

                {isAdminView && (
                  <div style={{ marginBottom: "18px" }}>
                    <div
                      style={{
                        fontWeight: "800",
                        color: "#111827",
                        marginBottom: "10px",
                        fontSize: "14px",
                      }}
                    >
                      Update Status
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <select
                        value={statusSelections[item.id] || item.status}
                        onChange={(e) =>
                          handleStatusSelectionChange(item.id, e.target.value)
                        }
                        style={{
                          flex: "1 1 220px",
                          padding: "12px 14px",
                          borderRadius: "12px",
                          border: "1px solid #d1d5db",
                          outline: "none",
                          fontSize: "14px",
                          backgroundColor: "#fff",
                        }}
                      >
                        {ADMIN_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(item.id)}
                        disabled={updatingStatusId === item.id}
                        style={{
                          background: "#111111",
                          color: "#ffffff",
                          padding: "12px 16px",
                          borderRadius: "12px",
                          border: "none",
                          fontSize: "14px",
                          fontWeight: "700",
                          cursor:
                            updatingStatusId === item.id ? "not-allowed" : "pointer",
                          opacity: updatingStatusId === item.id ? 0.7 : 1,
                        }}
                      >
                        {updatingStatusId === item.id
                          ? "Updating..."
                          : "Update Status"}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <div
                    style={{
                      fontWeight: "800",
                      color: "#111827",
                      marginBottom: "10px",
                      fontSize: "14px",
                    }}
                  >
                    Supporting Documents
                  </div>
                  {renderDocuments(item.documents)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;