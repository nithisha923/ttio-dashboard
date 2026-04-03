import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

function SubmitInvention() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [problem, setProblem] = useState("");
  const [inventor, setInventor] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facultyEmail, setFacultyEmail] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("facultyUser");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setInventor(parsedUser.full_name || "");
      setDepartment(parsedUser.department || "");
      setFacultyEmail(parsedUser.email || "");
    } catch (error) {
      console.error("Error reading faculty user:", error);
      localStorage.removeItem("facultyUser");
      navigate("/login");
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const inventionResponse = await axios.post(
        `${API_BASE_URL}/inventions`,
        {
          title,
          description,
          problem,
          inventor,
          department,
          faculty_email: facultyEmail,
        }
      );

      const inventionId = inventionResponse.data.id;
      let uploadedFileResult = null;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("invention_id", inventionId);

        const uploadResponse = await axios.post(
          `${API_BASE_URL}/upload-test`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        uploadedFileResult = uploadResponse.data;
      }

      alert(
        selectedFile
          ? "Invention submitted and document linked successfully."
          : "Invention submitted successfully."
      );

      console.log("Uploaded file result:", uploadedFileResult);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting invention:", error);
      alert("Failed to submit invention or upload linked document.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="section-heading">Submit Invention Disclosure</h1>

      <p className="section-text">
        Faculty, researchers, and innovators can submit new invention disclosures
        to the Technology Transfer & Innovation Office using this form.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Inventor Name</label>
            <input
              type="text"
              value={inventor}
              onChange={(e) => setInventor(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Invention Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Brief Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Problem Addressed</label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Supporting Document (optional)</label>
            <input type="file" onChange={handleFileChange} />
          </div>

          <button className="btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Invention"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitInvention;