Project Title
Our system consists of Nursing / Private Homes.
Each Nursing / Private Home has seniors.
Each senior can have a sensor.
A sensor paired to a senior communicates the senior’s body functions (e.g. temperature,
posture) to our backend.
There are 5 functionality endpoints and 1 authorization endpoint.
The implemented endpoints consist of:
storing a home object to the database,
storing a sensor object to the database,
storing a senior object to the database,
retrieving all senior objects from the database,
retrieving the senior object by id from the database,
assign a sensor that is available to a senior,
returning a JWT object for authorization signed by a Private key 
and containing a name in the payload.
The functionality was implemented using a REST API.

Motivation
Backend Junior Software Engineer Challenge.
(All given Parts were implemented)

Build Status
Error control in methods that AWS ecosystem could compenaste in producing errors is default.
Although the Lambda Authorizer and its lambda function were created throught serverless configuration,
In the current build there is missing an authorization integrated method notation with permission.
The API Gateway Lambda Authorizer was granted permission through the AWS console and the
endpoints that were to use the Authorization were linked with the authorizer by console.

Tech/Framework used
AWS ecosystem(Lambda, DynamoDB, API Gateway) and use Node.js-Typescript.

Code Examples and API reference is provided:
In the Test Cases below.

Installation
With the serverless cli installed you cant time serverless deploy at senior-service folder,
then through the AWS console grant access to the authorizer and from the method Requests of
each Resource assign the DefaultAuthorizer in Authorization.

Tests
Multiple calls with both valid and invalid parameters request bodies and authorization headers to
the API were performed to check for error control and accuracy.


TEST CASES using POSTMAN
require a JWT token from endpoint:

https://5v4mxvtxi2.execute-api.us-east-1.amazonaws.com/dev/jwtToken

!!USE THE RETURNED ENCODED TOKEN AS VALUE FOR THE REST!!

HOME ENDPOINT-----------------------------------------------------------------
Method:
POST
endpoint:
https://5v4mxvtxi2.execute-api.us-east-1.amazonaws.com/dev/homes
for the authentication use header key:
authorizationToken
value:
JWT endpoint value
for the request body (in postman use raw data):
{"homeId":"3","homename":"4","type":"PRIVATE"} // or "NURSING"

SENSOR ENDPOINT-----------------------------------------------------------------
Method:
POST
endpoint:
https://5v4mxvtxi2.execute-api.us-east-1.amazonaws.com/dev/sensors
for the authentication use header key:
authorizationToken
value:
JWT endpoint value
for the request body (in postman use raw data):
{"sensorId":"3","hardwareVersion":"4.1","softwareVersion":"3.2"}

SENIOR ENDPOINT-----------------------------------------------------------------
SUBMIT ENDPOINT------
Method:
POST
endpoint:
https://5v4mxvtxi2.execute-api.us-east-1.amazonaws.com/dev/seniors
for the authentication use header key:
authorizationToken
value:
JWT endpoint value
for the request body (in postman use raw data):
{"seniorId":"3","fullname":"somename","homeId":"3"} // must be an existing home id or error

RETURN SENIOR BY ID ENDPOINT--------------------------------------
Method:
GET
endpoint:
https://5v4mxvtxi2.execute-api.us-east-1.amazonaws.com/dev/seniors/{id}
for the authentication use header key:
authorizationToken
value:
JWT endpoint value
for the request parameter for id "2" should be denoted as such:
https://5v4mxvtxi2.execute-api.us-east-1.amazonaws.com/dev/seniors/2

RETURN ALL SENIORS LIST (NOT REQUESTED IN CHALLENGE)--------------
Method:
GET
endpoint:
https://5v4mxvtxi2.execute-api.us-east-1.amazonaws.com/dev/seniors
for the authentication use header key:
authorizationToken
value:
JWT endpoint value

ASSIGN AN UNASSIGNED SENSOR TO A SENIOR ENDPOINT-------------------
Method:
POST
endpoint:
https://5v4mxvtxi2.execute-api.us-east-1.amazonaws.com/dev/assignment/{sid}
authorizationToken
value:
JWT endpoint value
for the request body (in postman use raw data):
{"seniorId":"1"}