import React from "react";
import { Box } from "@mui/material";

import ExercisePage from "../components/ExerciseDB";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Workouts = () => {
  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <ExercisePage />
      </Box>
    </>
  );
};

export default Workouts;
