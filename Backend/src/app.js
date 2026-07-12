const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.set("trust proxy", 1)
app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
    "http://localhost:5173",
    "https://prepai-frontend-d5f6.onrender.com",
    process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        const isAllowed =
            !origin ||
            allowedOrigins.includes(origin) ||
            // Vercel deployments
            /^https:\/\/prep-ai-frontend-[a-z0-9-]+\.vercel\.app$/.test(origin) ||
            // Render deployments
            /^https:\/\/prepai-frontend-[a-z0-9-]+\.onrender\.com$/.test(origin)

        if (isAllowed) {
            callback(null, true)
            return
        }

        callback(new Error("Not allowed by CORS"))
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

module.exports = app