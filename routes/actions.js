import express from 'express';
import jwt from "jsonwebtoken";
import sharp from 'sharp';
import request from 'request';
import fs from 'fs';
import jsonpatch from 'jsonpatch';

import config from "./../config.json";
var router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.headers.authorization) {
    jwt.verify(req.headers.authorization.replace("Bearer ", ""), config.secret_key, function (err, tokenUserData) {
      if (err) {
        console.log(err);
        return res.status(401).json({success: false, error: "Authentication failed. Please try again"});
      }
      if (tokenUserData.username) {
        next()
      } else {
        res.status(401).json({success: false, error: "token not valid"});
      }
    });
  } else {
    res.status(401).json({success: false, error: "user needs to be authenticated first"});
  }

}

router.post('/jsonpatch', isAuthenticated, (req, res, next)=> {
  try {
    let jsonObj = req.body.obj;
    let patch = req.body.patch;

    if (!jsonObj || !patch) {
      return res.status(400).json({success: false, error: "Please provide JSON object and patch object."});
    }
    // console.log(typeof jsonObj,typeof patch);
    (typeof jsonObj === 'string') ? jsonObj = JSON.parse(jsonObj) : null;
    (typeof patch === 'string') ? patch = JSON.parse(patch) : null;

    let patcheddoc = jsonpatch.apply_patch(jsonObj, [patch]);
    res.status(200).json({success: true, data: patcheddoc});
  } catch (error) {
    // console.log(Object.keys(error), error.message);
    res.status(500).json({success: false, error: error.message});
  }

});

router.post('/resize',
    isAuthenticated,
    (req, res, next) =>{
      let url = req.body.url;
      if (!url) {
        return res.status(400).json({success: false, error: "please provide url"});
      }
      request.head(url, function (err, result, body) {
        if (err) {
          return res.status(400).json({
            success: false,
            error: "Error fetching resource. Please verify url again"
          });
        }
        try {
         console.log(result.headers);
          let mime = result.headers['content-type'].split('/')[1];
          console.log(mime);
          if (["jpg", "png", "jpeg", "webp"].includes(mime)) {
            let filename = "public/images/" + new Date().getTime() + "." + mime;
            request(url).pipe(fs.createWriteStream(filename)).on('close', function (err) {
              if (err) {
                return res.status(400).json({
                  success: false,
                  error: "Error fetching resource. Please try again"
                });
              }
              const stream = fs.createReadStream(filename);
              const transform = sharp()
                  .resize({
                    width: 50,
                    height: 50,
                    fit: "fill"
                  })
                  .toFormat(mime);
              res.set('Content-Type', 'image/' + mime);
              stream.pipe(transform).pipe(res);
              return stream;
            });
          } else {
            res.status(400).json({success: false, error: "Given file is not an image"});
          }
        } catch (error) {
          res.status(500).json({success: false, error: error.message});
        }

      });
    });

export {router};
