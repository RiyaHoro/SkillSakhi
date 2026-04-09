import { useState, useEffect } from "react";

const API = "http://127.0.0.1:8000/api";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    education: "",
    location: "",
  });
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [profileStatus, setProfileStatus] = useState(null);
  const [skillsStatus, setSkillsStatus] = useState(null);
  const [saving, setSaving] = useState({ profile: false, skills: false });

  useEffect(() => {
    fetch(`${API}/profile/`, { headers: getHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setProfile({
          name: data.name || "",
          education: data.education || "",
          location: data.location || "",
        });
        setSkills(Array.isArray(data.skills) ? data.skills.join(", ") : "");
      })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  function flash(setter, type, msg) {
    setter({ type, msg });
    setTimeout(() => setter(null), 3500);
  }
  async function handleSaveProfile() {
    setSaving((s) => ({ ...s, profile: true }));

    try {
      const res = await fetch(`${API}/update-profile/`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error();

      flash(setProfileStatus, "success", "Profile updated successfully");
    } catch {
      flash(setProfileStatus, "error", "Failed to update profile");
    } finally {
      setSaving((s) => ({ ...s, profile: false }));
    }
  }
  async function handleSaveSkills() {
    setSaving((s) => ({ ...s, skills: true }));

    try {
      const skillArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch(`${API}/update-skills/`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ skills: skillArray }),
      });

      if (!res.ok) throw new Error();

      // SUCCESS MESSAGE
      flash(
        setSkillsStatus,
        "success",
        `${skillArray.length} skill(s) updated`,
      );

      // THIS LINE GOES HERE
      setSkills(skillArray.join(", "));
    } catch {
      flash(setSkillsStatus, "error", "Failed to update. Try again.");
    } finally {
      setSaving((s) => ({ ...s, skills: false }));
    }
  }

  if (loading)
    return (
      <p style={{ padding: "2rem", fontFamily: "sans-serif" }}>Loading…</p>
    );
  if (fetchError)
    return (
      <p style={{ padding: "2rem", color: "red" }}>
        Failed to load profile. Please refresh.
      </p>
    );

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: "2.5rem 1.25rem",
        fontFamily: "sans-serif",
      }}
    >
      <div>{getInitials(profile.name)}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <button
            onClick={() => (window.location.href = "/dashboard")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              cursor: "pointer",
              background: "#f5f5f5",
            }}
          >
            ← Back to Dashboard
          </button>

          <h1 style={{ fontSize: 24, fontWeight: 500 }}>Edit Profile</h1>

        
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Sign out
        </button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label>Name</label>
        <input
          style={inp}
          value={profile.name}
          onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label>Education</label>
        <input
          style={inp}
          value={profile.education}
          onChange={(e) =>
            setProfile((p) => ({ ...p, education: e.target.value }))
          }
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label>Location</label>
        <input
          style={inp}
          value={profile.location}
          onChange={(e) =>
            setProfile((p) => ({ ...p, location: e.target.value }))
          }
        />
      </div>
      <button style={btn} disabled={saving.profile} onClick={handleSaveProfile}>
        {saving.profile ? "Saving…" : "Save Profile"}
      </button>
      {profileStatus && <StatusMsg status={profileStatus} />}

      <hr style={{ margin: "1.5rem 0" }} />

      <div style={{ marginBottom: 14 }}>
        <label>Skills (comma-separated)</label>
        <textarea
          style={{ ...inp, minHeight: 80, resize: "vertical" }}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="React, Python, SQL…"
        />
      </div>
      <button style={btn} disabled={saving.skills} onClick={handleSaveSkills}>
        {saving.skills ? "Saving…" : "Update Skills"}
      </button>
      {skillsStatus && <StatusMsg status={skillsStatus} />}
    </div>
  );
}

function StatusMsg({ status }) {
  return (
    <p
      style={{
        marginTop: 8,
        fontSize: 13,
        color: status.type === "success" ? "green" : "red",
      }}
    >
      {status.msg}
    </p>
  );
}

const inp = {
  display: "block",
  width: "100%",
  padding: "9px 12px",
  marginTop: 5,
  fontSize: 14,
  border: "1px solid #ddd",
  borderRadius: 7,
  outline: "none",
};
const btn = {
  padding: "10px 20px",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: 7,
  cursor: "pointer",
  fontSize: 14,
};
