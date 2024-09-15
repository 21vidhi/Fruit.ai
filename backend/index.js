const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const faqRoutes = require("./routes/faq");

const app = express();

// Use CORS middleware
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/faqs", faqRoutes); // New FAQ routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
