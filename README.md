# hobnob
Learn fullstack javascript

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

## More general requirements
- If a request uses the method POST, PUT or PATCH, it must carry a non-empty payload.
- If a request contains a non-empty payload, it should have its Content-Type header set. If it doesn't, respond with the 400 Bad Request status code.
- If a request has set its Content-Type header, it must contain the string application/json. If it doesn't, respond with the 415 Unsupported Media Type status code.

## Add user profile
- Requirement: The user payload may optionally provide a profile object; otherwise, an empty profile will be created for them

- Add two more scenarios where the client provides a profile object — one using an invalid profile, the other a valid one.

- What constitutes a valid profile?

```
{
  "name": {
    "first": <string>,
    "last": <string>,
    "middle": <string>
  },
  "summary": <string>,
  "bio": <string>
}
```

- Define JSON schemas for our models for validating

## Picking a JSON Schema validation lib

djv, ajv, is-my-json-valid, tv4,...

- Focus on performance (how quick it is) and conformity (how closely it conforms to the specification)

- Developer and community support are also important factors to consider

- The most popular libraries and examine their number of GitHub stars, the number of weekly downloads from npmjs.com, and the number of dependent repositories and packages*

- The date of its last meaningful commit to the master branch (this excludes version bump and formatting changes): is it no longer maintained

- The number of open issues

- The frequency of releases

- Add Ajv to our project's dependencies: 

$ yarn add ajv

