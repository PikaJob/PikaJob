//-----------------------------------IMPORT-------------------------------------
// import and configure environmental variables
const dotenv = require('dotenv');
dotenv.config();
//Import Error Handler:
const createError = require('./createError');
//Import Database:
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
//Import grabber:
// const grabber = require('./grabber');

const openai = new OpenAIApi(configuration);

//Declare chatGPTController:
const chatGPTController = {};
const controller = 'chatGPTController';

//-------------------------------GET TECH STACK---------------------------------
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
chatGPTController.getTechStack = async (req, res, next) => {
  console.log('Inside getTechStack');

  // ------------------------ DESTRUCTURE REQUEST BODY -----------------------
  // Grab the url from the request body
  const url = req.body.url;

  // --------------------------- QUERY CHAT GPT ------------------------------
  // Add the url to the prompt
  const prompt = `What are the tech stacks required from this job post? ${url} 
    Return a json object with types as below:
    {"Language": string[], "Frontend": string[], "Backend": string[], "CICD": string[],  
    "Testing": string[], "Authentication": string[], "Bundler": string[]}`;

  // // promt to openai with the response from the grabber, which returns a string version of the url website
  // const promtGrabber = `Returning a json object with types as below:
  //   {"Language": string[], "Frontend": string[], "Backend": string[], "CICD": string[],
  //   "Testing": string[], "Authentication": string[], "Bundler": string[]}
  // What are the tech stacks required from this job post?\n\n ${grabber(url)}`;

  // console.log('\nopenai prompt: \n', prompt, '\n');
  // console.log('\nopenai prompt using grabber: \n', promtGrabber, '\n');

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0.1,
      max_tokens: 500,
    });
    res.locals.techStack = JSON.parse(response.data.choices[0].text);
    console.log('\nresponse from openai: ', res.locals.techStack, '\n');

    //Next Middleware
    return next();

    //Error Handler
  } catch (err) {
    return next(
      createError({
        controller,
        method: 'getTechStack',
        status: 404,
        err,
      }),
    );
  }
};

//-------------------------------GET TECH STACK---------------------------------
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
chatGPTController.getJobInformation = async (req, res, next) => {
  console.log('Inside getJobInformation');

  // ------------------------ DESTRUCTURE REQUEST BODY -----------------------
  // Grab the url from the request body
  const url = req.body.url;

  // --------------------------- QUERY CHAT GPT ------------------------------
  // Add the url to the prompt
  // promt openai again to get the job title, company, description
  const prompt = `What is the job title, company, and brief description for this job post? ${url}
   Return a json object with types as below:
   {"jobTitle": string, "company": string, "description": string}`;

  console.log('\nopenai prompt: \n', prompt, '\n');
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0.1,
      max_tokens: 500,
    });
    res.locals.jobInfo = JSON.parse(response.data.choices[0].text);
    console.log('\nseconed response from openai: ', res.locals.jobInfo, '\n');

    //Next Middleware
    return next();

    //Error Handler
  } catch (err) {
    return next(
      createError({
        controller,
        method: 'getJobInformation',
        status: 404,
        err,
      }),
    );
  }
};

module.exports = chatGPTController;
