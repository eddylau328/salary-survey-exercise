# salary-survey-exercise

### Aim

The goal of this exercise is to design a normalized database schema for storing the provided salary data and build RESTful APIs to query the records. The data set is a set of responses of a salary survey.

### About the exercise

This project uses Node.js with Typescript to build and Postgres SQL for storing the salary survey result data. In this project, it provides 4 API endpoints for solving different users' needs.

Here is the API needs,

- list the records with some filters that you consider useful in users' perspective
- get the average salary of a job role
- insert a survey response
- update a survey response

### Built With

- node 16
- express
- typeorm
- typescript

### Getting Started

This project contains Dockerfile and docker-compose.yml

##### Prerequisites

install docker and docker-compose before running the project

##### Running the project in Docker

`docker-compose up --build -d`

- may need to add `sudo` before the command

`docker exec salary-survey-backend yarn run-init-db`

- create dummy data for the projects
- run this command will clear the existing data inside the database, and recreate the dummy data

### Documents

- After running docker-compose, go to http://127.0.0.1:8000/docs/ for APIs document

##### API Test

- the document contains the APIs details
  - method
  - url
  - requestBody / parameters
  - response

##### Jest

`docker exec salary-survey-backend yarn test`

- run tests for parsing the salary data into correct numeric data
