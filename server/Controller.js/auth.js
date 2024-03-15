const userModel = require('../Model/authModel')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const userReg = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, Email, and Password are required." })
        }
        const hashPass = await argon2.hash(password)
        const userDetails = await userModel.create({
            name,
            email,
            password: hashPass
        })
        res.json(userDetails)
    } catch (error) {
        console.log('Error on while registering user.......');
        res.status(500).json({ error: "An error occurred while creating the user." });
    }

}


const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email, and Password are required." })
        }
        const user = await userModel.findOne({ email: email })

        if (!user) {
            return res.status(401).json({ error: "Authentication failed. User not found.." })
        }
        const isPasswordValid = await argon2.verify(user.password, password)

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Authentication failed. Invalid password." });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        console.log("tokennn : ", token);
        res.header('Authorization', token).json({ message: 'sucessfully Logined', data: {token, name:user.name, userId:user._id,email:email} })

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


module.exports = {userReg,userLogin}