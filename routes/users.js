const { User, userValidation } = require('../models/user');
const nodemailer = require('nodemailer');
const express = require('express');
const _ = require("lodash");
const config = require('config');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const router = express.Router();
router.post("/", async (req, res) => {
    const newUser = req.body.User;
    const { error } = userValidation(newUser);
    if (error) {
        const message = error.details.map(i => i.message).join(',');
        res.status(400).send(message);
    }
    console.log(newUser);
    let password = req.body.User.Password;
    //const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, 10);
    newUser.Password = password;
    const user = new User(newUser);
    await user.save();
    let mailTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'baladandaya@gmail.com',
            pass: config.get('Password')
        }
    });
    let mailText = {
        from: 'baladandaya@gmail.com',
        to: req.body.User.Email,
        subject: 'Registration',
        text: 'Successfully registered for ur app'
    }
    mailTransport.sendMail(mailText).then(() => {
        console.log("Mail successfully sent!");
    })
        .catch((err) => {
            console.log("Error sending mail", err);
        });
    res.redirect("../login");
});
module.exports = router;