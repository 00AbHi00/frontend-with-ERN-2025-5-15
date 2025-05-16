const express = require("express");
const app = express();
// CORS stands for cross-origin resource sharing. Just like HTTPS, it’s a protocol that defines some rules for sharing resources from a different origin. We know that modern web apps consist of two key components: a client and a server.
const cors = require("cors");
const fs = require("fs");
const csvParser = require("csv-parser");
const fastcsv = require("fast-csv");
const bodyParser = require("body-parser");

const corsOptions = {
  origin: "http://localhost:5173",
  //methods: "GET,POST,PUT,DELETE", // optional: allowed methods
  //credentials: true               // optional: cookies/auth
};
// Accepting server from

app.use(cors(corsOptions));
app.use(bodyParser.json());

const PORT = 8080;
const csvFilePath = "./users.csv";

// Helper function to read CSV and parse into JSON array
const readCSV = () =>
  new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });

// Helper function to write JSON array back to CSV
const writeCSV = (data) =>
  new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(csvFilePath);
    fastcsv
      .write(data, { headers: true })
      .on("finish", resolve)
      .on("error", reject)
      .pipe(ws);
  });


app.get("/api/users.csv", (req, res) => {
  res.download(csvFilePath);
});

// Get all users as JSON by reading the CSV file
app.get("/api/users", async (req, res) => {
  console.log("GET /api/users called");
  try {
    const users = await readCSV();
    res.json(users);
  } catch (error) {
    console.error("Error reading CSV:", error);
    res.status(500).json({ error: "Failed to read users" });
  }
});



// Add a new user - data sent as JSON in request body
app.post("/api/users", async (req, res) => {
  const users = await readCSV();
  const { firstName, lastName, userName, userType } = req.body;

  // Check if userName is already taken
  if (users.some((u) => u.userName === userName)) {
    return res.status(400).json({ error: "Username already exists" });
  }

  // Generate new userId (max + 1)
  const maxId = users.length > 0 ? Math.max(...users.map(u => Number(u.userId))) : 0;
  const newUserId = maxId + 1;

  const newUser = {
    userId: newUserId,
    firstName,
    lastName,
    userName,
    userType,
  };

  users.push(newUser);
  await writeCSV(users);
  res.json({ message: "User added", user: newUser });
});


app.get("/api/users/:id", async (req, res) => {
  try {
    const users = await readCSV(); // returns array of users
    const id = parseInt(req.params.id, 10);
    const user = users.find(u => u.userId == id);

    if (!user) {
      return res.status(404).json({ error: "User not found",id:id });
    }

    res.json(user);
  } catch (error) {
    console.error("Error reading CSV:", error);
    res.status(500).json({ error: "Failed to read users" });
  }
});



app.put("/api/users/:id", async (req, res) => {
  const users = await readCSV();
  const userId = req.params.id; // keep it string to match CSV
  const { firstName, lastName, userName, userType } = req.body;

  const isUserNameTaken = users.find(
    (u) => u.userName === userName && u.userId !== userId
  );

  if (isUserNameTaken) {
    return res.status(409).json({ error: "Username not available", userId });
  }

  const index = users.findIndex((u) => u.userId === userId);
  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users[index] = {
    ...users[index],
    firstName,
    lastName,
    userName,
    userType,
  };

  await writeCSV(users);
  res.json({ message: "User updated successfully", user: users[index] });
});


// Delete a user by userId
app.delete("/api/users/:id", async (req, res) => {
  const users = await readCSV();
  const filtered = users.filter((u) => u.userId != req.params.id);

  if (filtered.length === users.length)
    return res.status(404).json({ error: "User not found" });

  await writeCSV(filtered);
  res.json({ message: "User deleted" });
});

// Run the server on this particular port 8080
app.listen(PORT, () => {
  console.log(`Server Started on ports ${PORT}`);
});
