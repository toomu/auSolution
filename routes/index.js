import express from 'express';
import jwt from "jsonwebtoken";
var router = express.Router();

import config from "./../config.json";

/* GET home page. */
router.post('/login',  (req, res)=> {
    let user = req.body;
    if (user.username && user.password) {
        const accessToken = jwt.sign({username: user.username}, config.secret_key);
        res.status(200).json({success: true, token: accessToken});
    } else {
        res.status(401).json({success: false, error: "please provide user credentials"});
    }
});



export {router};