const express = require("express");
const app = express();
// CORS stands for cross-origin resource sharing. Just like HTTPS, it’s a protocol that defines some rules for sharing resources from a different origin. We know that modern web apps consist of two key components: a client and a server.
const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173/"],
};
// Accepting server from

app.use(cors(corsOptions));

app.get("/api", (req, res) => {
  //   Testing with a resposne json
  res.json({
    "users": {
      1: {
        userId: 1,
        firstName: "Abhishek",
        lastName: "Silwal",
        userName: "abhishek_silwal_1",
        userType: "admin",
        hi:"HI"
      },
    },
  });
});

// Run the server on this particular port 8080
app.listen(8080, () => {
  console.log("Server Started on port 8080");
});
