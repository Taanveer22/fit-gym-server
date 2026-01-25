// ==================Recommended Order=================
// 1. Required by common js (express, cors, etc.)
// 2 .Instance Initialization (const app = express())
// 3. Middleware Setup (cors, json, logging)
// 4. Database Configuration & Connection (MongoDB client setup and runMongoDB() function)
// 5. Routes
// 6. Server Startup (app.listen)
// ===========================================================
// 01
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// 02
const app = express();
const PORT = process.env.PORT || 5000;

// 03
app.use(cors());
app.use(express.json());

// 04
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.89rnkti.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const gymScheduleCollection = client.db("gymDB").collection("gymSchedule");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // ========= post method
    app.post("/schedule", async (req, res) => {
      const data = req.body;
      const result = await gymScheduleCollection.insertOne(data);
      res.send(result);
      // console.log(data);
      // res.send("data received");
    });

    // ========= get method
    app.get("/schedule", async (req, res) => {
      const cursor = gymScheduleCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // ========= delete method
    app.delete("/schedule/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gymScheduleCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (error) {
    console.log(error);
  }
}
run();

// 05
app.get("/", (req, res) => {
  res.send("server is running");
});

// 06
app.listen(PORT, () => {
  console.log(`the server is running on PORT:  ${PORT}`);
});
