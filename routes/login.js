const { User } = require('../models/user');
const Joi = require('joi');
const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();
function crendentialValidation(obj) {
    const schema = Joi.object({
        Email: Joi.string().required(),
        Password: Joi.string().min(6).required()
    });
    return schema.validate(obj);
}
router.post("/", async (req, res) => {
    const user = req.body.User;
    //console.log(user);
    const { error } = crendentialValidation(user);
    if (error) {
        let message = error.details[0].message;
        return res.status(400).send(message);
    }
    let email = req.body.User.Email;
    const result = await User.findOne({ "Email": email });
    console.log(user, "\n", result);
    if (!result) {
        return res.status(400).send("Invalid credentials");
    }
    const validPass = await bcrypt.compare(user.Password, result.Password);
    if (!validPass) {
        return res.status(400).send("Invalid crendentials");
    }
    //const token = jwt.sign({ _id: result._id }, config.get('Secretkey'))
    //const value = _.pick(result, ['Name', 'Email', 'Phone']);
    res.redirect('../predict');

});
module.exports = router;