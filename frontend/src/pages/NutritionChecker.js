import React from "react";
import { Box } from "@mui/material";

import NutritionCheckerForm from "../components/NutritionCheckerForm";
import Footer from "../components/Footer";
import Header from "../components/Header";

const NutritionChecker = () => {
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
        <NutritionCheckerForm />
      </Box>
      <Footer />
    </>
  );
};

export default NutritionChecker;
