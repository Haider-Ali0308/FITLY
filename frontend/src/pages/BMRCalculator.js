import React from "react";
import { Box, Typography } from "@mui/material";
import CalorieCalculator from "../components/CalorieCalculator";
import FormContainer from "../components/FormContainer";
import Footer from "../components/Footer";
import Header from "../components/Header";

const BMRCalculator = () => {
  return (
    <>
      <>
        <Header />
        <FormContainer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "60vh",
            }}
          >
            <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
              BMR Calculator
            </Typography>
            <CalorieCalculator />
          </Box>
        </FormContainer>
      </>
      <Footer />
    </>
  );
};

export default BMRCalculator;
