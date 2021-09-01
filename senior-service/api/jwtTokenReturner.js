'use strict';

const AWS = require('aws-sdk'); 
var jwt = require('jsonwebtoken');

AWS.config.setPromisesDependency(require('bluebird'));


module.exports.tokenReturner = async (event, context, callback) => {
    
    const token = jwt.sign({
        name: 'backend-SW-Engineer-Candidate'
      }, 'backendChallengeJWTKey', { expiresIn: '1h' });
    const response = {
        statusCode: 200,
        body: JSON.stringify({
          token: token,
        })
      }
    return response;

};