var jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

exports.authFunc =  function(event, context, callback) {
    var token = event.authorizationToken;
    
    jwt.verify(token, 'backendChallengeJWTKey', function(err, decoded) {
       
       if(err){
            callback("Verification failed :("); // Return a 500 Invalid token response 
       }else{        
        console.log(decoded);
        switch (decoded.name) {
            case 'backend-SW-Engineer-Candidate':
                callback(null, generatePolicy('user', 'Allow', event.methodArn));
                break;
            case 'deny':
                callback(null, generatePolicy('user', 'Deny', event.methodArn));
                break;
            case 'unauthorized':
                callback("Unauthorized");   // Return a 401 Unauthorized response
                break;
            default:
                callback("Error: Invalid token"); // Return a 500 Invalid token response 
            };
       }
        
    });
    
};

// Help function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource) {
    var authResponse = {};
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    
    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {
        "stringKey": "stringval",
        "numberKey": 123,
        "booleanKey": true
    };
    return authResponse;
}