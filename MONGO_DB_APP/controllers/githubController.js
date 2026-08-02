import jwt from "jsonwebtoken";

export const githubSuccess = async (req, res) => {

    const token = jwt.sign(
        {
            id: req.user._id,
            email: req.user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    res.redirect(
        `${process.env.FRONTEND_URL}github-success?token=${token}`
    );
};