import React, { useState } from "react";

const ExercisePage = () => {
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [exercises, setExercises] = useState([]);

  const muscleGroups = [
    "back",
    "cardio",
    "chest",
    "lower arms",
    "lower legs",
    "neck",
    "shoulders",
    "upper arms",
    "upper legs",
    "waist",
  ];

  const handleSearch = async () => {
    if (!selectedMuscle) {
      alert("Please select a muscle group");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:9000/api/exercises/${encodeURIComponent(
          selectedMuscle,
        )}`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`,
        );
      }
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      alert(`Error: ${error.message}`);
      setExercises([]);
    }
  };

  const handleReset = () => {
    setSelectedMuscle("");
    setExercises([]);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          height: "10%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginTop: "4rem",
        }}
      >
        Exercise Finder
      </header>

      {/* Search Controls */}
      <section
        style={{
          height: "10%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
          padding: "1rem",
        }}
      >
        <select
          value={selectedMuscle}
          onChange={(e) => setSelectedMuscle(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        >
          <option value="">Select Muscle Group</option>
          {muscleGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Search
        </button>

        <button
          onClick={handleReset}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Reset
        </button>
      </section>

      {/* Exercise Images */}
      <section
        style={{
          height: "80%",
          overflowY: "auto",
          padding: "1rem",
        }}
      >
        {exercises.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            {exercises.map((exercise, index) => (
              <div
                key={index}
                style={{
                  width: "250px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3 style={{ fontSize: "1rem", margin: "0 0 0.5rem 0" }}>
                  <h3>
                    {exercise.name
                      .replace(/\.(svg|png|jpg|jpeg)$/i, "")
                      .replace(/[-_]/g, " ")}
                  </h3>
                </h3>
                <div
                  style={{
                    width: "220px",
                    height: "220px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "6px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <img
                    src={exercise.path}
                    alt={exercise.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>No exercises found.</p>
        )}
      </section>
    </div>
  );
};

export default ExercisePage;
