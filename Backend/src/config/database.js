const mongoose = require("mongoose")

async function connectToDB() {
    const mongoUri = process.env.MONGO_URI

    if (!mongoUri) {
        throw new Error("MONGO_URI is not defined")
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
            autoIndex: true
        })

        console.log("Connected to Database")
    }
    catch (err) {
        console.error("Database connection failed:", err.message)
        throw err
    }
}

module.exports = connectToDB