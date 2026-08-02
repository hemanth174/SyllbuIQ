import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import transporter from '../config/mailer.js'
import crypto from 'crypto'
export const verifyByUserEmail = async (req, res) => {
    try {
        const { id, token } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        if (!user.isVerified && user.verifyToken !== hashedToken) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully!" });
    } catch (err) {
        console.error("Verification error:", err);
        res.status(500).json({ message: "An error occurred during verification. This might be due to an invalid link." });
    }
}


export const createNewUser = async (req, res) => {

    try {
        const { name, email, password, conformpass } = req.body;
        if (!name || !email || !password || !conformpass) {
            return res.status(400).json({ message: "Please Fill All Fields" })
        }
        if (password.length < 10) {
            return res.status(400).json({ message: "Password Length Must Be Above 10" })
        }

        if (password.trim() !== conformpass.trim()) {
            return res.status(400).json({ message: "Conform Password is not matched with password" })
        }
        const verifyToken = crypto.randomBytes(32).toString('hex')
        const hashedVerifyToken = crypto.createHash("sha256").update(verifyToken).digest("hex");
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "An Account Exists with this Email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({ name, email, password: hashedPassword, verifyToken: hashedVerifyToken, verifyTokenExpire: Date.now() + 2 * 60 * 60 * 1000 });
        const saveduser = await user.save();

        const verificationLink = `http://localhost:5173/api/auth/verify/${saveduser._id}/${verifyToken}`;

        await transporter.sendMail({
            from: "no-reply-syllbuIQ@gmail.com",
            to: email,
            subject: 'Verify your SyllabiQ account',
            html: `
                <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
                    <p>Dear <strong>${name}</strong>,</p>
                    <p>Thank you for registering on <strong>SyllabiQ</strong>.</p>
                    <p>To complete your registration, please verify your email address by clicking the link below:</p>
                    <p>
                        <strong><a href="${verificationLink}" style="color: #0056b3; text-decoration: none;">Verify My Account</a></strong>
                    </p>
                    <p>If you did not request this account creation, please kindly ignore this email.</p>
                    <br>
                    <p>Best regards,<br>
                    <strong>The SyllabiQ Team</strong></p>
                </div>
            `
        })

        return res.status(200).json({ message: `${name}! You're Registered Successfully on Syllbu IQ. You will be sent a via mail. Please Verify you're Mail` });


    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: err.message })

    }

}

export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please Fill All Fields" })
        }
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "Invalid Credentials" })
        }

        if (user.isVerified !== true) {
            return res.status(403).json({ message: "Please Verify Your Email!." })
        }

        const isMatchPass = await bcrypt.compare(password, user.password)
        if (!isMatchPass) {
            return res.status(404).json({ message: "Invalid Credentials" })
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        return res.status(200).json({ message: "User Logged In!", token })
    } catch (err) {
        console.log(err)
    }
}