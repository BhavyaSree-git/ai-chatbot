import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const ProductSearch = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleQuery = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/query?query=${query}`);
      
      if (res.data.message) {
        setResponse(res.data.message);
      } else if (Array.isArray(res.data)) {
        setResponse(res.data.map(item => {
          if (item.brand) return `Brand: ${item.brand}`;
          if (item.name && item.category) return `Product: ${item.name} - Category: ${item.category}`;
          if (item.supplier_name) return `Supplier: ${item.supplier_name} - Category: ${item.category} - Price: $${item.price}`;
          return `${item.name} - $${item.price}`;
        }).join("\n"));
      } else {
        setResponse(`${res.data.name} - ${res.data.brand || res.data.category} - $${res.data.price}\n${res.data.description || ""}`);
      }
    } catch (error) {
      setResponse("Error fetching data");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        AI Chatbot - Product Search
      </Typography>
      <TextField
        label="Ask a question..."
        variant="outlined"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleQuery} sx={{ mt: 2 }}>
        Search
      </Button>
      <Box component="pre" sx={{ mt: 2, whiteSpace: "pre-wrap", background: "#f4f4f4", padding: "10px" }}>
        {response}
      </Box>
    </Container>
  );
};

export default ProductSearch;
