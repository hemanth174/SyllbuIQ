import 'dotenv/config'
import express from 'express'
import connectDB from "./config/db.js"
import userRoutes from './routes/auth.js'
import session from "express-session";
import passport from "./config/passport.js";
import cors from 'cors'
// dotenv.config() is no longer needed here as it's handled by 'import "dotenv/config"'
connectDB()
const app = express()

app.use(express.json())
app.use(cors())
app.use(
    session({
        secret: "github_secret",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());

app.use(passport.session());
app.use('/api/auth', userRoutes)
app.use("/api/user", userRoutes);
const port = process.env.PORT || 5001


app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`)
})