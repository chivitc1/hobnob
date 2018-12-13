# hobnob
Learn react

## Overal requirements
- Overall goal of the project is to "Create a web application that allows users to log in and update their profiles."

## Structure application into modules
- Authentication: To allow users to register and log in
- Profile: To allow users to edit their own profile and view the profile of others
- Database(s): To store user data
- API server: The interface between our internal services and external consumers

## Choose first feature to work with
- API server > Create User feature

## More detail requirements of the feature:
- The user payload must include the email address and password fields
- The user payload may optionally provide a profile object; otherwise, an empty profile will be created for them

## Break requirements into scenarios:
- (1) If the client sends a POST request to /users with an empty payload, our API should respond with a 400 Bad Request HTTP status code and a JSON object payload containing an appropriate error message 
- (2) If the client sends a POST request to /users with a payload that is not JSON, our API should respond with a 415 Unsupported Media Type HTTP status code and a JSON response payload containing an appropriate error message 
- (3) If the client sends a POST request to /users with a malformed JSON payload, our API should respond with a 400 Bad Request HTTP status code and a JSON response payload containing an appropriate error message

## Write e2e tests for feature
- Define spec in plain english using Gherkin keywords: Feature, Scenario, Given, When, Then, And, But
- Define steps

## Implement api
- Implement node js web api using http module (may replaced by express later)
- Do it until all e2e tests of the feature passed.

## Second and third scenarios of the feature
- update e2e tests

