const db = require('./models.js');

const dbManager = {};

dbManager.createJobsTable = async () => {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        job_title VARCHAR(255) NOT NULL,
        submission_date TEXT,
        company VARCHAR(255),
        min_salary INTEGER,
        max_salary INTEGER,
        description TEXT,
        status_id INTEGER,
        resume BOOLEAN,
        cover_letter BOOLEAN,
        sent_thank_you BOOLEAN,
        job_link TEXT,
        recruiter_contact VARCHAR(255)
      );
    `;

    await db.query(sql);
    console.log('Jobs table created successfully.');
  } catch (err) {
    console.error('Error creating jobs table:', err.stack);
  }
};

dbManager.createStatusTable = async () => {
  try {
    const sql = `
            CREATE TABLE IF NOT EXISTS status (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
        `;

    await db.query(sql);
    console.log('Status table created successfully.');
  } catch (err) {
    console.error('Error creating status table:', err.stack);
  }
};

dbManager.createSkillTypesTable = async () => {
  try {
    const sql = `
            CREATE TABLE IF NOT EXISTS skill_types (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
        `;

    await db.query(sql);
    console.log('Skill types table created successfully.');
  } catch (err) {
    console.error('Error creating skill types table:', err.stack);
  }
};

dbManager.createSkillsTable = async () => {
  try {
    const sql = `
            CREATE TABLE IF NOT EXISTS skills (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                skill_type_id INTEGER
            );
        `;

    await db.query(sql);
    console.log('Skills table created successfully.');
  } catch (err) {
    console.error('Error creating skills table:', err.stack);
  }
};

dbManager.createSkillsToJobTable = async () => {
  try {
    const sql = `
            CREATE TABLE IF NOT EXISTS skills_to_job (
                id SERIAL PRIMARY KEY,
                skill_id INTEGER,
                job_id INTEGER
            );
        `;

    await db.query(sql);
    console.log('Skills_to_job table created successfully.');
  } catch (err) {
    console.error('Error creating skills_to_job table:', err.stack);
  }
};

dbManager.dropTable = async table => {
  try {
    const sql = `DROP TABLE IF EXISTS ${table};`;

    await db.query(sql);
    console.log(`Table ${table} dropped successfully.`);
  } catch (err) {
    console.error(`Error dropping table ${table}:`, err.stack);
  }
};

module.exports = dbManager;
