//--------------------------------- START OF IMPORT-----------------------------
const path = require('path');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 3000;
const controller = require('./controller/controller.js');
const chatGPTController = require('./controller/chatGPTController');

// const apiRouter = require('./routes/apiRoute');

//------------------------------- START OF MIDDLEWARE --------------------------
//Handle parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Handle requests for static files
app.use('/assets', express.static(path.join(__dirname, '../client/assets')));

//Transfer all current cookies in browser to the request cookies
app.use(cookieParser());

//-----------------------------START OF ROUTING HANDLERS------------------------
//Forward all request to /api to api router
// app.use('/api', apiRouter);

// route to interact with openai api, and add a job to the database
app.post(
  '/api/job',
  chatGPTController.getTechStack,
  chatGPTController.getJobInformation,
  controller.gather,
  controller.frontendPackage,
  (req, res) => {
    res.status(200).json(res.locals.jobsObj);
  },
);

// route to grab the frontend package object, it contains all the jobs and skills
app.get('/api/job', controller.frontendPackage, (req, res) => {
  res.status(200).json(res.locals.jobsObj);
});

// route to flip boolean state of sentThankYouNote, resume, coverLetter
app.put('/api/checkOff', controller.checkOff, (req, res) => {
  res.sendStatus(200);
});

// route to update the status of a job
app.put('/api/updateStatus', controller.updateStatus, (req, res) => {
  res.sendStatus(200);
});

// route to delete a job
app.delete('/api/job/:id', controller.deleteJob, (req, res) => {
  res.sendStatus(200);
});

// route to update the salary range of a job
app.put('/api/updateSalary', controller.updateSalary, (req, res) => {
  res.sendStatus(200);
});

//-----------------------------START OF DB Testing Routes------------------------
// route to get all jobs from the database
app.get('/api/getJobs', controller.getJobs, (req, res) => {
  res.status(200).json(res.locals.jobs);
});

// route to retrive all the skill types
app.get('/api/getSkillTypes', controller.getSkillTypes, (req, res) => {
  res.status(200).json(res.locals.skillTypes);
});

//-----------------------------START OF DB Management Routes------------------------
// route to "do all" the intial setup of the database, tables and default values
app.get(
  '/api/setup',
  controller.generateTables,
  controller.addSkillTypes,
  controller.addStatuses,
  (req, res) => {
    res.sendStatus(200);
  },
);
// route to fill in the skill types table with default values
app.get('/api/addSkillTypes', controller.addSkillTypes, (req, res) => {
  res.sendStatus(200);
});
// route to fill in the status table with default values
app.get('/api/addStatuses', controller.addStatuses, (req, res) => {
  res.sendStatus(200);
});
// route to add a table to the database, used for testing and management only
app.post('/api/addTable', controller.addTable, (req, res) => {
  res.sendStatus(200);
});
// route to purge jobs table
app.get('/api/purgeJobs', controller.purgeJobs, (req, res) => {
  res.sendStatus(200);
});

//---------------------------- START OF GENERAL ROUTES--------------------------
// route handler to respond with main app
app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

// catch-all route handler for any requests to an unknown route
app.use('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../client/404.html'));
});

//----------------------------- START OF ERROR HANDLER--------------------------
/**
 * express error handler
 * @see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
 */

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

/**
 * start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: PORT ${PORT}`);
});

module.exports = app;
