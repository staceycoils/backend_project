# Northcoders News API

This repository conatins the backend files for my 2022 Northcoders Project, a small website for hosting user-submitted articles. This encompasses the databases, api setup, routing and error handling for requests.

The frontend files are a seperate repository, located at https://github.com/staceycoils/nc-news.

## Setup

### Requirements

This repo requires the minimum versions of the following:

### Installation

1) Clone the repository into the selected folder by using: <br>
> <code>git clone https://github.com/staceycoils/backend_project.git</code>

2) Run:
> <code>npm init</code>

to install npm into the project. You can add -y to the end to omit all required inputs and install npm immediately.

3) Install the required node modules by running:
> <code>npm i</code>

4) Setup the databases by running:
> <code>npm run setup-dbs</code>

5) Create two files in the root directory: .env.test and .env.development.

Using the layout provided in .env-example, add the names of the databases for each of these files.

6) Seed the data into the databases by using:
> <code>npm run seed</code>

### Testing

The project comes with pre-written test files to confirm all functions are operating as expected. To run all tests, use:
> <code>npm t</code>

This will take about 1 - 2 minutes due to the number of tests. If any are failing, please refer to the output to determine the error.

If you are unable to determine the cause of a failed test, please submit an issue to the github repo.

You can also run:
> <code>npm run watch</code>

to have the tests persist and re-run whever a file is saved.

### Running

When ready to use the project on your local system, use the command:
> <code>npm start</code>

This will host the project on a local port as displayed in the console. With the use of an API client such as Insomnia, you can make requests as shown on the /api endpoints.

## Hosted Link

You can locate the hosted database at https://nc-news-se.herokuapp.com/api/.