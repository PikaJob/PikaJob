const db = require('../models/models.js');
const dbManager = require('../models/database-setup.js');

const controller = {};

controller.gather = async (req, res, next) => {
  // ------------------------ DESTRUCTURE REQUEST BODY -----------------------
  // Grab the url from the request body
  const url = req.body.url;

  // ----------------------- GET TECH STACK & JOB INFO -------------------------
  const { techStack, jobInfo } = res.locals;

  // -------------------------- UPDATE JOBS TABLE ----------------------------
  const query = `
    INSERT INTO jobs (submission_date, company, job_title, min_salary, max_salary, description, resume, cover_letter, sent_thank_you, status_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    RETURNING *
    `;

  const queryArr = [
    new Date().toDateString(),
    'company',
    'job title',
    null,
    null,
    'description',
    false,
    false,
    false,
    1,
  ];
  // check if the user ticked applied in the request body
  if (req.body.applied) {
    // if they did, set the job status to applied, and resume to true
    queryArr[9] = 2;
    queryArr[6] = true;
  }
  // add the job to the database
  const job = await db.query(query, queryArr);

  // --------------- UDPATE SKILLS & SKILLS_TO_JOB TABLE ---------------------
  // iterate through the techStack and add them to the skills table if they are not already there
  for (const [techstackType, techArr] of Object.entries(techStack)) {
    // techstackType is the key, techArr is the value
    for (const tech of techArr) {
      // tech is the value
      // check if the skill is already in the db
      const skill = await db.query('SELECT * FROM skills WHERE name = $1', [tech]);
      // if the skill is not in the db, add it
      if (skill.rows.length === 0) {
        // Obtain skill type Id
        const skillType = await db.query(
          `SELECT * FROM skill_types WHERE name = '${techstackType}'`,
        );
        const skillTypeId = skillType.rows[0].id;
        // Insert skill
        const newSkill = await db.query(
          `INSERT INTO skills (name, skill_type_id) VALUES ('${tech}', '${skillTypeId}') RETURNING *`,
        );
        // Obtain skill Id
        const skillId = newSkill.rows[0].id;
        // Obtain job Id
        const jobId = job.rows[0].id;
        // Insert skill to job
        const skillToJob = await db.query(
          `INSERT INTO skills_to_job (skill_id, job_id) VALUES ('${skillId}', '${jobId}') RETURNING *`,
        );
      } else {
        const skillId = skill.rows[0].id;
        const jobId = job.rows[0].id;
        const skillToJob = await db.query(
          `INSERT INTO skills_to_job (skill_id, job_id) VALUES ('${skillId}', '${jobId}') RETURNING *`,
        );
      }
    }
  }

  const updateJob = await db.query(
    'UPDATE jobs SET job_title = $1, company = $2, description = $3, job_link = $4 WHERE id = $5 RETURNING *',
    [jobInfo.jobTitle, jobInfo.company, jobInfo.description, url, job.rows[0].id],
  );
  // attach the job and the skills to the response object like controller.frontendPackage but just for one job
  // const jobsObj = {};
  // const statusTable = await db.query('SELECT * FROM status');

  // const jobId = updateJob.rows[0].id;
  // const jobTitle = updateJob.rows[0].job_title;
  // const jobLink = updateJob.rows[0].job_link;
  // const company = updateJob.rows[0].company;
  // const submissionDate = updateJob.rows[0].submission_date;
  // // status pulled from status table using the status_id (foreign key)
  // const status = statusTable.rows[updateJob.rows[0].status_id - 1].name;
  // const sentThankYouNote = updateJob.rows[0].sent_thank_you;
  // const resume = updateJob.rows[0].resume;
  // const coverLetter = updateJob.rows[0].cover_letter;
  // const minSalary = updateJob.rows[0].min_salary;
  // const maxSalary = updateJob.rows[0].max_salary;
  // const description = updateJob.rows[0].description;
  // const techStackObj = {};
  // for (const [techstackType, techArr] of Object.entries(techStack)) {
  //   techStackObj[techstackType] = techArr;
  // }
  // jobsObj[jobId] = {
  //   jobTitle,
  //   jobLink,
  //   company,
  //   submissionDate,
  //   status,
  //   sentThankYouNote,
  //   resume,
  //   coverLetter,
  //   minSalary,
  //   maxSalary,
  //   techStack: techStackObj,
  //   description,
  // };
  // res.locals.jobsObj = jobsObj;
  //console.log('res.locals.jobs: ', res.locals.jobsObj);

  next();
};

controller.getJobs = async (req, res, next) => {
  console.log('getJobs controller');
  const jobs = await db.query('SELECT * FROM jobs');
  res.locals.jobs = jobs.rows;
  console.log('jobs: ', res.locals.jobs);
  next();
};

//
controller.frontendPackage = async (req, res, next) => {
  // grab the jobs from the database
  const jobs = await db.query('SELECT * FROM jobs');
  const jobsArr = jobs.rows;
  // create an object to store the jobs and their techStacks
  const jobsObj = {};
  // fecth the status table from the database, we will need it later
  const statusTable = await db.query('SELECT * FROM status');
  // fetch the skills_to_job table from the database, we will need it later
  const skillsToJob = await db.query('SELECT * FROM skills_to_job');
  // fetch the skills table from the database, we will need it later
  const skills = await db.query('SELECT * FROM skills');
  // fetch the skill_types table from the database, we will need it later
  const skillTypes = await db.query('SELECT * FROM skill_types');

  // iterate through the jobs
  for (let i = 0; i < jobsArr.length; i++) {
    // pull out the job info
    const job = jobsArr[i];
    const jobId = job.id;
    const jobTitle = job.job_title;
    const jobLink = job.job_link;
    const company = job.company;
    const submissionDate = job.submission_date;
    // status pulled from status table using the status_id (foreign key)
    if (job.status_id === null) {
      job.status_id = 1;
    }
    const status = statusTable.rows[job.status_id - 1].name;
    const sentThankYouNote = job.sent_thank_you;
    const resume = job.resume;
    const coverLetter = job.cover_letter;
    const minSalary = job.min_salary;
    const maxSalary = job.max_salary;
    const description = job.description;

    // grab all the skills for the current job
    const skillsForJob = skillsToJob.rows.filter(skill => skill.job_id === jobId);
    // create an object to store the skills for the current job
    const skillsObj = {};
    // iterate through the skills for the current job
    for (let j = 0; j < skillsForJob.length; j++) {
      // grab the skill id for the current skill
      const skillId = skillsForJob[j].skill_id;
      // grab the skill from the skills table
      const skill = skills.rows.filter(skill => skill.id === skillId);
      // grab the skill type id from the skill
      const skillTypeId = skill[0].skill_type_id;
      // grab the skill type from the skill_types table
      const skillType = skillTypes.rows.filter(skillType => skillType.id === skillTypeId);
      // grab the skill name from the skill
      const skillName = skill[0].name;
      // grab the skill type name from the skill type
      const skillTypeName = skillType[0].name;
      // add the skill to the skills object
      skillsObj[skillTypeName] = skillsObj[skillTypeName] || [];
      skillsObj[skillTypeName].push(skillName);
    }

    // add the job to the jobs object
    jobsObj[jobId] = {
      jobTitle,
      jobLink,
      company,
      submissionDate,
      status,
      sentThankYouNote,
      resume,
      coverLetter,
      minSalary,
      maxSalary,
      techStack: skillsObj,
      description,
    };
  }
  //console.log('jobsObj: ', jobsObj);
  res.locals.jobsObj = jobsObj;
  next();
};

// route to flip boolean state of sentThankYouNote, resume, coverLetter
controller.checkOff = async (req, res, next) => {
  // flipping the boolean value of only one of the three based on the body
  // not returning anyhting in the response
  const jobId = req.body.jobId;
  const column = req.body.column;
  const updateJob = await db.query(`UPDATE jobs SET ${column} = NOT ${column} WHERE id = $1`, [
    jobId,
  ]);
  console.log(`updated ${column}`);
  next();
};

// route to update the status of a job
controller.updateStatus = async (req, res, next) => {
  const jobId = req.body.jobId;
  const status = req.body.status;
  // grab the status id from the status table matching the status string
  const statusId = await db.query('SELECT * FROM status WHERE name = $1', [status]);
  // update the status of the job
  const updateJob = await db.query('UPDATE jobs SET status_id = $1 WHERE id = $2', [
    statusId.rows[0].id,
    jobId,
  ]);
  console.log('updated status');
  next();
};

// route to delete a job, from the jobs table and the skills_to_job table
controller.deleteJob = async (req, res, next) => {
  // const jobId = req.body.jobId;
  const jobId = req.params.id;
  // delete from the jobs table
  const deleteJob = await db.query('DELETE FROM jobs WHERE id = $1', [jobId]);
  // delete from the skills_to_job table
  const deleteSkills = await db.query('DELETE FROM skills_to_job WHERE job_id = $1', [jobId]);
  console.log('deleted job');
  next();
};

// route to update the salary range of a job
controller.updateSalary = async (req, res, next) => {
  const jobId = req.body.jobId;
  const minSalary = req.body.minSalary;
  const maxSalary = req.body.maxSalary;
  // update the salary range of the job
  const updateJob = await db.query(
    'UPDATE jobs SET min_salary = $1, max_salary = $2 WHERE id = $3',
    [minSalary, maxSalary, jobId]
  );
  console.log('updated salary');
  next();
};

// ----------------------------- DB MANAGEMENT ROUTES -----------------------------

// for adding skills to the skill table
controller.addSkill = async (req, res, next) => {
  const skill = req.body.skill;
  const type = req.body.type;

  const skillType = await db.query('SELECT * FROM skill_types WHERE name = $1', [type]);
  const skillTypeId = skillType.rows[0].id;

  const newSkill = await db.query('INSERT INTO skills (name, type) VALUES ($1, $2) RETURNING *', [
    skill,
    skillTypeId,
  ]);
  res.locals.newSkill = newSkill.rows[0];
  next();
};

// filling the skill_types table with default values
controller.addSkillTypes = async (req, res, next) => {
  const skillTypes = [
    'Frontend',
    'Backend',
    'CICD',
    'Language',
    'Testing',
    'Authentication',
    'Bundler',
  ];

  for (let i = 0; i < skillTypes.length; i++) {
    const skillType = await db.query('INSERT INTO skill_types (name) VALUES ($1) RETURNING *', [
      skillTypes[i],
    ]);
  }
  console.log('skill types added');
  next();
};

// route to retrive all the skill types
controller.getSkillTypes = async (req, res, next) => {
  const skillTypes = await db.query('SELECT * FROM skill_types');
  res.locals.skillTypes = skillTypes.rows;
  next();
};

// filling the status table with default values
controller.addStatuses = async (req, res, next) => {
  const statuses = [
    'need to apply',
    'submitted',
    'phone screen',
    'take home',
    'technical interview',
    'system design interview',
    'offer',
    'declined',
    'frozen',
    'accepted',
  ];

  for (let i = 0; i < statuses.length; i++) {
    const status = await db.query('INSERT INTO status (name) VALUES ($1) RETURNING *', [
      statuses[i],
    ]);
  }
  console.log('statuses added');
  next();
};

// route to purge the jobs table and skill_to_job table
controller.purgeJobs = async (req, res, next) => {
  await db.query('DELETE FROM jobs');
  await db.query('DELETE FROM skills_to_job');
  next();
};

// route to generate all the tables for intial setup
controller.generateTables = async (req, res, next) => {
  await dbManager.createJobsTable();
  await dbManager.createStatusTable();
  await dbManager.createSkillTypesTable();
  await dbManager.createSkillsTable();
  await dbManager.createSkillsToJobTable();
  next();
};

// route to add individual tables to the database, or to drop a table
controller.addTable = async (req, res, next) => {
  const table = req.body.table;
  // only used for the drop table case
  const dropTable = req.body.dropTable;

  // switch case based on the table name
  switch (table) {
    case 'jobs':
      await dbManager.createJobsTable();
      break;
    case 'status':
      await dbManager.createStatusTable();
      break;
    case 'skill_types':
      await dbManager.createSkillTypesTable();
      break;
    case 'skills':
      await dbManager.createSkillsTable();
      break;
    case 'skills_to_job':
      await dbManager.createSkillsToJobTable();
      break;
    case 'drop':
      await dbManager.dropTable(dropTable);
      break;
    default:
      console.log('Invalid table name');
  }
  next();
};

module.exports = controller;
