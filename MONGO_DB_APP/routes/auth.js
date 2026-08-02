import { createNewUser, LoginUser, verifyByUserEmail } from '../controllers/authcontroller.js'
import passport from "passport";
import { githubSuccess } from "../controllers/githubController.js";
import express from 'express'
const router = express.Router()

router.post('/login-user', LoginUser)
router.post('/add-user', createNewUser);
router.get('/verify/:id/:token', verifyByUserEmail);
router.get(
    "/github",
    passport.authenticate("github", {
        scope: ["user:email"],
    })
);

router.get(
    "/github/callback",
    passport.authenticate("github", {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login`,
    }),
    githubSuccess
);
export default router