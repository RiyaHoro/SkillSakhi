import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [recommendations, setRecommendations] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/recommend/gap/", { headers });
        setRecommendations(res.data);
      } catch (err) {
        console.error("Recommendations fetch failed:", err.response?.data || err.message);
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/profile/", { headers });
        setProfile({
          ...res.data,
          skills: Array.isArray(res.data.skills) ? res.data.skills : [], // ← never null
        });
      } catch (err) {
        console.error("Profile fetch failed:", err.response?.data || err.message);
      }
    };

    Promise.all([fetchRecommendations(), fetchProfile()])
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  if (loading) return <div className="dash-page"><p style={{ padding: "2rem" }}>Loading…</p></div>;

  return (
    <div className="dash-page">
      <header className="dash-navbar">
        <span className="dash-nav-brand">CareerPath</span>
        <div className="dash-nav-actions">
          <button className="dash-btn-outline" onClick={() => (window.location.href = "/profile")}>
            Edit Profile
          </button>
          <button className="dash-btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dash-main">
        {profile && (
          <section className="dash-profile-card">
            <div className="dash-avatar">{getInitials(profile.name)}</div>
            <div className="dash-profile-info">
              <h2 className="dash-profile-name">{profile.name}</h2>
              <p className="dash-profile-edu">{profile.education}</p>
              <div className="dash-skills-row">
                {profile.skills.map((skill, i) => (   // ← safe, always an array
                  <span key={i} className="dash-skill-badge">{skill}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        <h2 className="dash-section-title">Career Recommendations</h2>

        {recommendations.length === 0 ? (
          <p style={{ color: "#888", fontSize: 14 }}>
            No recommendations yet. Make sure your profile and skills are saved.
          </p>
        ) : (
          <div className="dash-cards-grid">
            {recommendations.map((career, index) => (
              <div key={index} className="dash-career-card">
                <div className="dash-career-header">
                  <h3 className="dash-career-title">{career.career}</h3>
                  <span className="dash-match-badge">{career.match_percentage}% match</span>
                </div>
                <div className="dash-progress-track">
                  <div className="dash-progress-fill" style={{ width: `${career.match_percentage}%` }} />
                </div>
                <div className="dash-skills-section">
                  <div className="dash-skills-col">
                    <p className="dash-skills-label dash-label-green">Matched skills</p>
                    <div className="dash-skills-list">
                      {career.matched_skills.map((skill, i) => (
                        <span key={i} className="dash-skill-tag dash-tag-green">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="dash-skills-col">
                    <p className="dash-skills-label dash-label-red">Missing skills</p>
                    <div className="dash-skills-list">
                      {career.missing_skills.map((skill, i) => (
                        <span key={i} className="dash-skill-tag dash-tag-red">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="dash-courses-section">
                  <p className="dash-courses-heading">Recommended courses</p>
                  {career.training_resources.length === 0 ? (
                    <p className="dash-no-courses">No courses available</p>
                  ) : (
                    career.training_resources.map((course, i) => (
                      <div key={i} className="dash-course-row">
                        <div className="dash-course-info">
                          <span className="dash-course-name">{course.course}</span>
                          <span className="dash-course-provider">{course.provider}</span>
                        </div>
                        <a href={course.link} target="_blank" rel="noreferrer" className="dash-course-link">
                          View course →
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;