'use strict';

const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.assignSensor = async (event, context, callback) => {  
  const requestBody = JSON.parse(event.body);
  const seniorId = requestBody.seniorId;

  const params = {
    TableName: process.env.SENIORS_TABLE,
    IndexName: "sensorsIdTable",
    KeyConditionExpression: 'sensorId = :sensorid',        
    ExpressionAttributeValues: {
      ":sensorid": event.pathParameters.sid
    }    
  };

  const updateParams = {
    TableName: process.env.SENIORS_TABLE,
    Key:{
      id: seniorId,
    },
    UpdateExpression: "set sensorId = :sid",
    ExpressionAttributeValues:{
        ":sid": event.pathParameters.sid
    },
    ReturnValues:"UPDATED_NEW"
  };
  //awaits the query to check sensor availability 
  var response;
  var sensorID = [];
  let checkAvailability = await dynamoDb.query(params).promise().then(function(data) {
    data.Items.forEach(function(senior) {
      sensorID.push(senior.sensorId);
    });    
  }).catch(function(err) {
    console.log(err);
  });
  if(sensorID.length>0){
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: `ERROR:Unable to assign sensor, it is already assigned, `,
        sensorID
      })
    }
  }
  else {
   let assignSensor = await dynamoDb.update(updateParams).promise().then(function(data) {
      response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'UpdateItem succeeded',
        })
      }
      console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));      
    });
  }
  return response;
} 


