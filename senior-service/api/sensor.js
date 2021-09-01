'use strict';

const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

//ADDS SENSOR TO THE DATABASE WITH SENSORID, HARDWAREVERSION AND SOFTWAREVERSION, RETURNS STRING.

module.exports.submit = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const sensorId = requestBody.sensorId;
  const hardwareVersion = requestBody.hardwareVersion;
  const softwareVersion = requestBody.softwareVersion;  

  if (typeof sensorId !== 'string' || typeof hardwareVersion !== 'string' || typeof softwareVersion !== 'string') {    
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit sensor because of validation errors.'));
    return;
  }
 
  submitSensorP(sensorInfo(sensorId, hardwareVersion, softwareVersion))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted sensor`
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit sensor`
        })
      })
    });
};

const submitSensorP = sensor => {
  console.log('Submitting sensor');
  const sensorInfo = {
    TableName: process.env.SENSORS_TABLE,
    Item: sensor,
  };
  return dynamoDb.put(sensorInfo).promise()
    .then(res => sensor);
};

const sensorInfo = (sensorId, hardwareVersion, softwareVersion) => {
  const timestamp = new Date().getTime();
  return {
    hardwareVersion: hardwareVersion,
    sensorid: sensorId,
    softwareVersion: softwareVersion,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};