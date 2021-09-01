'use strict';

const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

//ADDS HOME TO THE DATABASE WITH HOMEID NAME AND TYPE (NURSING OR PRIVATE ONLY), RETURNS STRING.

module.exports.submit = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const homeId = requestBody.homeId;
  const homename = requestBody.homename;
  const type = requestBody.type;  

  if (typeof homename !== 'string' || typeof homeId !== 'string' || typeof type !== 'string') {    
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit home because of validation errors.'));
    return;
  }
  if (type !== "NURSING" && type !== "PRIVATE"){
    console.error('Type Validation Failed');
    callback(new Error('Couldnt submit home because of type has validation errors.'));
    return;
  }

  submitHomeP(homeInfo(homeId, homename, type))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted home`
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit home`
        })
      })
    });
};

const submitHomeP = home => {
  console.log('Submitting home');
  const homeInfo = {
    TableName: process.env.HOMES_TABLE,
    Item: home,
  };
  return dynamoDb.put(homeInfo).promise()
    .then(res => home);
};

const homeInfo = (homeId, homename, type) => {
  const timestamp = new Date().getTime();
  return {
    homename: homename,
    homeid: homeId,
    type: type,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};