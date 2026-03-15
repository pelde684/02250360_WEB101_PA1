import React from "react";
import ProfileCard from "./components/ProfileCard";
import "./App.css";

function App() {
  const profiles = [
    {
      id: 1,
      name: "Karma Sonam",
      role: "Frontend Developer",
      avatar: "https://via.placeholder.com/100?text=KS",
      skills: ["React", "JavaScript", "CSS", "HTML"]
    },
    {
      id: 2,
      name: "Sonam Dema",
      role: "UX Designer",
      avatar: "https://via.placeholder.com/100?text=SD",
      skills: ["Figma", "Wireframing", "Prototyping"]
    }
  ];

  return (
    <div className="App">
      <header>
        <h1>Profile</h1>
      </header>

      <div className="profiles-container">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            name={profile.name}
            role={profile.role}
            avatar={profile.avatar}
            skills={profile.skills}
          />
        ))}
      </div>
    </div>
  );
}

export default App;