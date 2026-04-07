import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {

    const fetchRecommendations = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://127.0.0.1:8000/api/recommend/gap/",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setRecommendations(response.data);

      } catch (error) {

        console.log(error);
        alert("Failed to load recommendations");

      }
    };

    fetchRecommendations();

  }, []);

  return (

    <div style={{ padding: "40px" }}>

      <h1>Dashboard</h1>

      {recommendations.map((career, index) => (

        <div key={index} style={{ border: "1px solid gray", padding: "20px", marginBottom: "20px" }}>

          <h2>{career.career}</h2>

          <p>
            Match Percentage: {career.match_percentage}%
          </p>

          <h4>Matched Skills</h4>
          <ul>
            {career.matched_skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>

          <h4>Missing Skills</h4>
          <ul>
            {career.missing_skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>

          <h4>Training Resources</h4>
          <ul>
            {career.training_resources.map((course, i) => (
              <li key={i}>
                {course.course} - {course.provider}
              </li>
            ))}
          </ul>

        </div>

      ))}

    </div>

  );
}

export default Dashboard;