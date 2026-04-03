import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("facultyUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("facultyUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <header
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "18px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "#111111",
                lineHeight: "1.2",
              }}
            >
              Bowie State University
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginTop: "4px",
                lineHeight: "1.4",
              }}
            >
              Technology Transfer & Innovation Office Platform
            </span>
          </div>
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#374151",
              fontWeight: "700",
              fontSize: "15px",
              padding: "10px 14px",
              borderRadius: "10px",
            }}
          >
            Home
          </Link>

          {!user && (
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                background: "#f2c300",
                color: "#111111",
                fontWeight: "800",
                fontSize: "15px",
                padding: "10px 18px",
                borderRadius: "10px",
                border: "1px solid #f2c300",
              }}
            >
              Login
            </Link>
          )}

          {user && (
            <>
              <Link
                to="/faculty-portal"
                style={{
                  textDecoration: "none",
                  color: "#374151",
                  fontWeight: "700",
                  fontSize: "15px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                }}
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  background: "#111111",
                  color: "#ffffff",
                  fontWeight: "800",
                  fontSize: "15px",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  border: "1px solid #111111",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;