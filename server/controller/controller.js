const db = require("../models/models.js");
const dbManager = require("../models/database-setup.js");

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: "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",
});
  
const openai = new OpenAIApi(configuration);

const controller = {};

controller.gather = async (req, res, next) => {
    // ------------------------ DESTRUCTURE REQUEST BODY -----------------------
    // Grab the url from the request body
    const url = req.body.url;
    
    // --------------------------- QUERY CHAT GPT ------------------------------
    // Add the url to the prompt
    const prompt = `What are the tech stacks required from this job post? ${url} 
        Return a json object with types as below:
        {"Language": string[], "Frontend": string[], "Backend": string[], "CICD": string[],  
        "Testing": string[], "Authentication": string[], "Bundler": string[]}`;


    console.log("\nopenai prompt: \n", prompt, "\n")
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.1,
        max_tokens: 500,
    });
    const techStack = JSON.parse(response.data.choices[0].text);
    res.locals.data = techStack;
    console.log("\nresponse from openai: ", techStack, "\n");

    // -------------------------- UPDATE JOBS TABLE ----------------------------
    const query = `
    INSERT INTO jobs (submission_date, company, job_title, min_salary, max_salary, description, resume, cover_letter, sent_thank_you) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
    RETURNING *
    `
    const queryArr = [new Date().toDateString(), "company", "job title", 100000, 200000, "description",true, false, false];
    // add the job to the database
    const job = await db.query(query, queryArr);

    // ---------------------- UDPATE SKILLS TABLE -----------------------------
    // iterate throught the techStack and add them to the skills table if they are not already there
    for (const[techstackType, techArr] of Object.entries(techStack)){
        // techstackType is the key, techArr is the value
        for (const tech of techArr){
            // tech is the value
            // check if the skill is already in the db
            const skill = await db.query("SELECT * FROM skills WHERE name = $1", [tech]);
            // if the skill is not in the db, add it
            if (skill.rows.length === 0) {
                // Obtain skill type Id
                const skillTypeId = (await db.query("SELECT id FROM skill_types WHERE name = $1", [techstackType])).rows[0];
                // Insert skill
                const newSkill = await db.query("INSERT INTO skills (name, skill_type_id) VALUES ($1, $2) RETURNING *", [tech, skillTypeId]);
            }
        }
    }
    // map the techStack skill IDs along with the Job ID to the skillsToJob table
    for (const[techstackType, techArr] of Object.entries(techStack)){
        // techstackType is the key, techArr is the value
        for (const tech of techArr){
            // tech is the value
            // check if the skill is already in the db
            const skill = await db.query("SELECT * FROM skills WHERE name = $1", [tech]);
            const skillId = skill.rows[0].id;
            const jobId = job.rows[0].id;
            const skillToJob = await db.query("INSERT INTO skills_to_job (skill_id, job_id) VALUES ($1, $2) RETURNING *", [skillId, jobId]);
        }
    }

    next();
};

controller.getJobs = async (req, res, next) => {
    console.log("getJobs controller");
    const jobs = await db.query("SELECT * FROM jobs");
    res.locals.jobs = jobs.rows;
    console.log("jobs: ", res.locals.jobs);
    next();
}

// 
controller.frontendPackage = async (req, res, next) => {
    /*
    Output format:
    BackEnd:
        [ {
        jobTitle: string
        jobLink: url
        company: string
        submissionDate: Date.now() | null
        status: applied
        sentThankYouNote: false
        resume?: true
        coverLetter?: false
        minSalary?:
        maxSalary?:
        techStack: [ {skill},...]
        },]
        description: string
    */

};




// for adding skills to the skill table
controller.addSkill = async (req, res, next) => {
    const skill = req.body.skill;
    const type = req.body.type;

    const skillType = await db.query("SELECT * FROM skill_types WHERE name = $1", [type]);
    const skillTypeId = skillType.rows[0].id;

    const newSkill = await db.query("INSERT INTO skills (name, type) VALUES ($1, $2) RETURNING *", [skill, skillTypeId]);
    res.locals.newSkill = newSkill.rows[0];
    next();
};

// filling the skill_types table with default values
controller.addSkillTypes = async (req, res, next) => {
    const skillTypes = ["Frontend", "Backend", "CICD", "Language", "Testing", "Authentication", "Bundler"];

    for (let i = 0; i < skillTypes.length; i++) {
        const skillType = await db.query("INSERT INTO skill_types (name) VALUES ($1) RETURNING *", [skillTypes[i]]);
    }
    console.log("skill types added");
    next();
};

// route to retrive all the skill types
controller.getSkillTypes = async (req, res, next) => {
    const skillTypes = await db.query("SELECT * FROM skill_types");
    res.locals.skillTypes = skillTypes.rows;
    next();
};

// filling the status table with default values
controller.addStatuses = async (req, res, next) => {
    const statuses = ["need to apply", "submitted", "phone screen", "take home", "technical interview", "system design interview", "offer", "declined", "frozen", "accepted"];

    for (let i = 0; i < statuses.length; i++) {
        const status = await db.query("INSERT INTO status (name) VALUES ($1) RETURNING *", [statuses[i]]);
    }
    console.log("statuses added");
    next();
};

controller.addTable = async (req, res, next) => {
    const table = req.body.table;
    // only used for the drop table case
    const dropTable = req.body.dropTable;

    // switch case based on the table name
    switch (table) {
        case "jobs":
            await dbManager.createJobsTable();
            break;
        case "status":
            await dbManager.createStatusTable();
            break;
        case "skill_types":
            await dbManager.createSkillTypesTable();
            break;
        case "skills":
            await dbManager.createSkillsTable();
            break;
        case "skills_to_job":
            await dbManager.createSkillsToJobTable();
            break;
        case "drop":
            await dbManager.dropTable(dropTable);
            break;
        default:
            console.log("Invalid table name");
    }
    next();
};




module.exports = controller;

/*
user ?? optional

jobs -- collection 
    - Id :                 Number, Serial
    - submission date :    Number
    - company :            String 
    - job title :           String
    - min salary :         Number
    - max salary :        Number
    - description :         String
    - status :            status foreign Id
    - resume :             boolean
    - cover letter:         boolean 
    - sent thank you :     boolean
    - job link :             String
    - recruiter contact :  String | Number

status -- collection
    - Id : Number, Serial
    - name : String

    - need to apply 
    - submitted
    - phone screen 
    - take home
    - technical interview
    - system design interview
    - offer
    - declined
    - frozen
    - accepted

skills -- collection
    - Id : Number, Serial 
    - name : String
    - type : skill types foreign Id

skill types -- collection
    - Id : Number, Serial
    - name : String

    - Frontend
    - Backend
    - CICD
    - Language
    - Testing
    - Authentication
    - Configuration

skills to job Joint Table
    - skill foreign Id : job foreign Id
    - skill foreign Id : job foreign Id
    - skill foreign Id : job foreign Id
    - skill foreign Id : job foreign Id

Output format:
    BackEnd:
        [ {
        jobTitle: string
        jobLink: url
        company: string
        submissionDate: Date.now() | null
        status: applied
        sentThankYouNote: false
        resume?: true
        coverLetter?: false
        minSalary?:
        maxSalary?:
        techStack: [ {skill},...]
        },]
        description: string

{
 "url":"https://www.linkedin.com/jobs/view/3448324655/?refId=5f24e4b1-39cc-4ea1-a071-4f08539318a1&trackingId=tdjuRdc%2FRt6bJlKVjsDdLw%3D%3D"
}
*/