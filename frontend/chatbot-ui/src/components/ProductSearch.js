import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Box, Card, CardContent, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";

const ProductSearch = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState([]);
  const [message, setMessage] = useState("");

  const handleQuery = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/query?query=${query}`);
      console.log("API Response:", res.data);

      if (Array.isArray(res.data)) {
        setResponse(
          res.data.map((item) => ({
            name: item.name,
            brand: item.brand,
            category: item.category,
            price: item.price ? (parseFloat(item.price) * 83).toFixed(2) : "Price Not Available",
          }))
        );
        setMessage("");
      } else if (res.data.brand && res.data.lowest_price) {
        setResponse([
          {
            name: "Lowest Price Brand",
            brand: res.data.brand,
            category: "N/A",
            price: res.data.lowest_price ? (parseFloat(res.data.lowest_price) * 83).toFixed(2) : "Price Not Available",
          },
        ]);
        setMessage("");
      } else if (res.data.message) {
        setMessage(res.data.message);
        setResponse([]);
      } else {
        setMessage("Unexpected response format.");
        setResponse([]);
      }
    } catch (error) {
      setMessage("Error fetching data. Please try again.");
      setResponse([]);
    }
  };

  const handleClearQuery = () => {
    setQuery("");
    setMessage("");
    setResponse([]);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        p: 3,
        borderRadius: 3,
        background: "linear-gradient(135deg, #eceff1, #ffffff)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#1565C0", fontWeight: "bold", textAlign: "center", mb: 2 }}
      >
        🛍️ AI Chatbot - Product Search
      </Typography>

      {/* Input Box */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.7)",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Ask about a product..."
            variant="outlined"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ backgroundColor: "#ffffff", borderRadius: 2 }}
          />
          <Button
            variant="contained"
            sx={{ bgcolor: "#43A047", "&:hover": { bgcolor: "#2E7D32" }, borderRadius: 2 }}
            onClick={handleQuery}
          >
            🔍 Search
          </Button>
          <Button variant="outlined" color="error" sx={{ borderRadius: 2 }} onClick={handleClearQuery}>
            ❌ Clear
          </Button>
        </Box>
      </Paper>

      {/* Display Message */}
      {message && (
        <Typography
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{ color: "#D32F2F", mt: 2, fontWeight: "bold", textAlign: "center", fontSize: "1.2rem" }}
        >
          ⚠️ {message}
        </Typography>
      )}

      {/* Product Response Grid */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {response.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              sx={{
                borderRadius: 4,
                boxShadow: 6,
                p: 2,
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.05)" },
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(5px)",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1E88E5" }}>
                  {item.name}
                </Typography>
                <Typography sx={{ color: "#616161" }}>💼 Brand: {item.brand}</Typography>
                <Typography sx={{ color: "#616161" }}>📦 Category: {item.category}</Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#388E3C",
                    fontWeight: "bold",
                    background: "rgba(76, 175, 80, 0.2)",
                    p: 1,
                    borderRadius: 2,
                    display: "inline-block",
                  }}
                >
                  💰 ₹{item.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductSearch;
