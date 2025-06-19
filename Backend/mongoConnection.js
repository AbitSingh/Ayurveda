const { MongoClient } = require("mongodb");

const dbURI = "mongodb://0.0.0.0:27017";
const client = new MongoClient(dbURI);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}
connectToDatabase().then();

const dbName = "flavour_fetch"; // Replace with your database name
let conn = client.db(dbName)

module.exports = conn;