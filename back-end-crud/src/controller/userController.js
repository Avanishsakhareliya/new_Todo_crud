const usermodel = require("../modal/user")
const TOKEN_KEY = "hellodeveloperforreactjsapp";
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');

module.exports.login = async (req, res) => {

    const { email, password } = req.body;
    const user = await usermodel.findOne({ email: email })
    if (user) {
        const comper = await bcrypt.compare(password, user.password);
        if (comper) {
            let userAuth={
                email:user.email,
                token:user.token,
                _id:user._id
            }
            res.status(200).send({ message: "user successFully Login", comper ,userAuth})
        } else {
            res.send({ message: "password does not match" })
        }
    } else {
        res.status(401).send({ message: "invalid user Creadentials" })
    }
}


module.exports.signup = async (req, res) => {
    const { email, password } = req.body
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const salt = await bcrypt.genSalt(10)
    const passwords = await bcrypt.hash(password, salt)
    const userData = await usermodel.findOne({ email: email })
    if (userData) {
        res.send({ message: "user already exists!" })
    }
    else {
        if (email.match(validRegex)) {
            var tokens = jwt.sign({ email }, TOKEN_KEY, {
                expiresIn: 86400 // expires in 24 hours
            });
            const resData = await usermodel.create({
                email: email,
                password: passwords,
                token:tokens
            })
            console.log(resData)
            res.status(200).send({ message: "user created successFully", resData })
        } else {
            res.status(201).send({ message: "email not valid" })
        }
    }
}

module.exports.logout = async (req, res) => {
    try {
        return res.json({ message: "logout successfully" })
    } catch (error) {
        next(error)
    }
}