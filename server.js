const express = require("express");
const app = express();
const PORT = 3000;

// This defines what happens when you visit the homepage
app.get("/", (req, res) => {
  res.send("<h1>Success! Your Node server is running.</h1>");
});

// This starts the server listening on port 3000
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
