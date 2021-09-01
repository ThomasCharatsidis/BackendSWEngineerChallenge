'use strict';

const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

//ADDS SENIOR TO THE DATABASE WITH NAME AND SENSORID, RETURNS STRING.

module.exports.submit = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const seniorId = requestBody.seniorId;
  const fullname = requestBody.fullname;
  const homeId = requestBody.homeId;
  const enabled = requestBody.enabled; 

  //VALIDATE INPUT
  if (typeof seniorId !== 'string' || typeof fullname !== 'string' || typeof homeId !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit senior because of validation errors.'));
    return;
  }
  //CHECK HOME AVAILABILITY
  const params = {
    TableName: process.env.HOMES_TABLE,
    KeyConditionExpression: 'homeid = :homeid',        
    ExpressionAttributeValues: {
      ":homeid": homeId
    }    
  };
  
  var response;
  var homeID = [];
  let checkAvailability = await dynamoDb.query(params).promise().then(function(data) {
    data.Items.forEach(function(home) {
      homeID.push(home.homeId);
    });    
  }).catch(function(err) {
    console.log(err);
  });
  if(homeID.length==0){
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: `ERROR:Unable to submit senior, home does not exist `,
        homeID
      })
    }
  }
  //submit senior
  else {
    try{
      const senior =  {      
        id: seniorId,
        fullname: fullname,
        homeId: homeId,
        enabled: false,    
      };
      const seniorParams = {
        TableName: process.env.SENIORS_TABLE,
        Item: senior,
      };
      let submitSenior = await dynamoDb.put(seniorParams).promise().then(function(data) {
        response = {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Submited succesfuly',
          })
        }
        console.log("Submitted succesfuly:", JSON.stringify(data, null, 2));      
      });      
    } catch(err){
      response = {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Submission failed',
        })
      }
      console.log(err);
    }
  }
  return response;
};

//REQUESTS AND LISTS ALL SENIORS FROM THE DATABASE

module.exports.list = (event, context, callback) => {
    var params = {
        TableName: process.env.SENIORS_TABLE,
        ProjectionExpression: "id, fullname, sensorId, homeId, enabled"
    };

    console.log("Scanning Seniors table.");
    const onScan = (err, data) => {

        if (err) {
            console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
            callback(err);
        } else {
            console.log("Scan succeeded.");
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    seniors: data.Items
                })
            });
        }

    };

    dynamoDb.scan(params, onScan);

};

//REQUESTS AND DISPLAYS SENIOR BY ID FROM THE DATABASE

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.SENIORS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.get(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t fetch senior.'));
      return;
    });
}
