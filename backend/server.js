const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const url = process.env.MONGO_URI;
const client = new MongoClient(url);
const dbName = process.env.DB_NAME;

const app = express();
const port = 3000;

async function main() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB:", url);

    // Middleware
    app.use(express.json());
    app.use(cors({
      origin: "https://digi-pass-frontend.vercel.app",
      methods: ["GET", "POST", "DELETE"]
    }));

    const db = client.db(dbName);
    const collection = db.collection("passwords");

    // GET all passwords
    app.get("/", async (req, res) => {
      try {
        const findResult = await collection.find({}).toArray();
        res.json(findResult);
      } catch (err) {
        console.error("Error in GET /:", err);
        res.status(500).send({ success: false, error: "Internal Server Error" });
      }
    });

    // POST new password
    app.post("/", async (req, res) => {
      try {
        const password = req.body;
        const result = await collection.insertOne(password);
        res.send({ success: true, result });
      } catch (err) {
        console.error("Error in POST /:", err);
        res.status(500).send({ success: false, error: "Internal Server Error" });
      }
    });

    // DELETE password by id
    app.delete("/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        res.send({ success: true, result });
      } catch (err) {
        console.error("Error in DELETE /:", err);
        res.status(500).send({ success: false, error: "Internal Server Error" });
      }
    });

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server running`);
    });

  } catch (err) {
    console.error("❌ Error starting server:", err);
  }
}

main();
