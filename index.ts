import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

// routers
import { authRouter } from "./routers/authRouter";
import { userRouter } from "./routers/userRouter";
import { chatRouter } from "./routers/chatRouter";

// config
import "./config/passportConfig"

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
];
app.use(cors({
    origin: function(origin, cb) {
        if(!origin || allowedOrigins.includes(origin)) {
            return cb(null, true);
        }
        const msg = "The CORS policy for this site does not allow access from the specified Origin."
        return cb(new Error(msg), false);
    },
    credentials: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// routes
app.get("/api", (req, res) => res.json({ message: "Welcome to the API." }));
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));