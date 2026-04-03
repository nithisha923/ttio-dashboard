function Home() {
  const services = [
    {
      title: "Invention Disclosure",
      description:
        "Submit innovation details and supporting information for TTIO review.",
    },
    {
      title: "IP Review & Protection",
      description:
        "Support intellectual property assessment and protection planning.",
    },
    {
      title: "Commercialization Support",
      description:
        "Help move promising research toward licensing and external impact.",
    },
    {
      title: "Document Management",
      description:
        "Upload and organize supporting files for invention submissions.",
    },
  ];

  const processSteps = [
    "Submit your invention disclosure",
    "TTIO reviews the submission",
    "Innovation moves into IP assessment",
    "Selected innovations move toward commercialization",
  ];

  return (
    <div style={{ background: "#f5f6f8" }}>
      <section
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "36px 20px 44px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
              padding: "28px 32px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src="/logos/ttio-logo.png"
                alt="TTIO Logo"
                style={{
                  maxWidth: "440px",
                  width: "100%",
                }}
              />
            </div>

            <div style={{ maxWidth: "760px", margin: "0 auto" }}>
              <h1
                style={{
                  fontSize: "44px",
                  fontWeight: "800",
                  lineHeight: "1.15",
                  marginTop: 0,
                  marginBottom: "14px",
                  color: "#111111",
                }}
              >
                Manage innovation disclosures and TTIO workflow activity
              </h1>

              <p
                style={{
                  fontSize: "17px",
                  color: "#555555",
                  lineHeight: "1.75",
                  marginTop: 0,
                  marginBottom: "22px",
                }}
              >
                Use the Bowie State TTIO platform to support invention
                disclosure, document submission, workflow review, and innovation
                tracking for faculty, researchers, and administrative users.
              </p>

              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <a
                  href="/login"
                  style={{
                    padding: "12px 22px",
                    background: "#f2c300",
                    color: "#111111",
                    borderRadius: "10px",
                    fontWeight: "700",
                    textDecoration: "none",
                    fontSize: "15px",
                  }}
                >
                  Login
                </a>

                <a
                  href="/login"
                  style={{
                    padding: "12px 22px",
                    border: "1px solid #cccccc",
                    borderRadius: "10px",
                    fontWeight: "700",
                    textDecoration: "none",
                    color: "#111111",
                    fontSize: "15px",
                  }}
                >
                  Start Disclosure
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "56px 20px", background: "#ffffff" }}>
        <div style={{ maxWidth: "850px", margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "34px",
              fontWeight: "800",
              marginTop: 0,
              marginBottom: "14px",
              color: "#111111",
            }}
          >
            What is Technology Transfer?
          </h2>

          <p
            style={{
              fontSize: "17px",
              color: "#555555",
              lineHeight: "1.8",
              margin: 0,
            }}
          >
            Technology transfer is the process of moving research and innovation
            toward practical use. This includes intellectual property protection,
            licensing, startup exploration, and collaboration that helps
            university discoveries create real-world impact.
          </p>
        </div>
      </section>

      <section style={{ padding: "56px 20px", background: "#f5f6f8" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "34px",
              fontWeight: "800",
              textAlign: "center",
              marginTop: 0,
              marginBottom: "14px",
              color: "#111111",
            }}
          >
            Core Services
          </h2>

          <p
            style={{
              textAlign: "center",
              fontSize: "17px",
              color: "#555555",
              marginTop: 0,
              marginBottom: "24px",
            }}
          >
            Structured support for innovation disclosure, IP review, and
            commercialization pathways.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
            }}
          >
            {services.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "#ffffff",
                  padding: "22px",
                  borderRadius: "14px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3
                  style={{
                    fontSize: "21px",
                    fontWeight: "700",
                    marginTop: 0,
                    marginBottom: "8px",
                    color: "#111111",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: "15px",
                    color: "#555555",
                    lineHeight: "1.7",
                    margin: 0,
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "56px 20px", background: "#ffffff" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "34px",
              fontWeight: "800",
              textAlign: "center",
              marginTop: 0,
              marginBottom: "14px",
              color: "#111111",
            }}
          >
            Innovation Process
          </h2>

          <p
            style={{
              textAlign: "center",
              fontSize: "17px",
              color: "#555555",
              marginTop: 0,
              marginBottom: "24px",
            }}
          >
            Our workflow moves innovations from disclosure to commercialization.
          </p>

          <div style={{ display: "grid", gap: "12px" }}>
            {processSteps.map((step, index) => (
              <div
                key={index}
                style={{
                  background: "#f9fafb",
                  padding: "16px 18px",
                  borderRadius: "10px",
                  borderLeft: "4px solid #f2c300",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#111111",
                }}
              >
                {index + 1}. {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "56px 20px",
          background: "#111111",
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "800",
              marginTop: 0,
              marginBottom: "14px",
            }}
          >
            Ready to continue?
          </h2>

          <p
            style={{
              fontSize: "16px",
              color: "#d1d5db",
              marginTop: 0,
              marginBottom: "22px",
              lineHeight: "1.7",
            }}
          >
            Log in to access the platform and track your innovation submissions.
          </p>

          <a
            href="/login"
            style={{
              padding: "12px 26px",
              background: "#f2c300",
              color: "#111111",
              borderRadius: "10px",
              fontWeight: "700",
              textDecoration: "none",
              fontSize: "15px",
              display: "inline-block",
            }}
          >
            Login to Continue
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;