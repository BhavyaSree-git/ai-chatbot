import React from "react";
import { Container, Typography } from "@mui/material";
import ProductSearch from "./components/ProductSearch";

const App = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Chatbot for Supplier & Product Info
      </Typography>
      <ProductSearch />
    </Container>
  );
};

export default App;
