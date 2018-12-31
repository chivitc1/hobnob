# Backend nodejs

## TDD with e2e test
- Using Cucumber and Gherkin

- Prepare .env file if you never done so

$ cp .env.example .env

$ cp test.env.example test.env

Change env as your environment

- Run all e2e tests:

$ yarn run test:e2e

- Run all e2e scenarios in feature file:

$ yarn run test:e2e spec/cucumber/features/users/create/main.feature

- Run one scenario in feature file by specifying the scenario line number:

$ yarn run test:e2e spec/cucumber/features/users/create/main.feature 99
