import React from 'react';
import { jobs } from './JobTracker';
import { Link } from "react-router-dom";
type JobTrackerTableProps = {
  jobs: jobs;
  setJobs: React.Dispatch<React.SetStateAction<jobs>>;
};
const headersTitle = [
  'Title',
  'Company',
  'Submission Date',
  'Status',
  'Sent Thank You Note',
  'Resume',
  'Cover Letter',
  'Min Salary',
  'Max Salary',
  'Tech Stack',
  'Description',
];
function JobTrackerTable(props: JobTrackerTableProps) {
  const { jobs, setJobs } = props;
  // This will send a fetch request (method: delete) to the backend, receiving all the jobs except for the deleted one
  function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    const button = event.target as HTMLButtonElement;
    let id : string | null = button.getAttribute('id');
    console.log('id of the row is ', id);
    // let remainingJobs = await fetch('/api/job/${id}'); method is DELETE, with id as paramter
    // retrieve remainingJobs and then do setJobs(remainingJobs)
  }

  return (
    <table>
      <thead>
        <tr>
          {headersTitle.map(header => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(jobs).map(([id, job]) => {
          return (
            <tr key={id}>
              <td>
                <a href={job.jobLink}>{job.jobTitle}</a>
              </td>
              <td>{job.company}</td>
              <td>{job.submissionDate}</td>
              <td>{job.status}</td>
              <td>
                <input type='checkbox' checked={job.sentThankYouNote} readOnly />
              </td>
              <td>
                <input type='checkbox' checked={job.resume} readOnly />
              </td>
              <td>
                <input type='checkbox' checked={job.coverLetter} readOnly />
              </td>
              <td>
                {job.minSalary
                  ? job.minSalary.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                    })
                  : job.minSalary}
              </td>
              <td>
                {job.maxSalary
                  ? job.maxSalary.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                    })
                  : job.maxSalary}
              </td>
              <td>
                {
                  <div>
                    {Object.keys(job.techStack).map(techStackType => (
                      <div key={techStackType}>
                        <p>{techStackType} :</p>
                        {job.techStack[techStackType as keyof jobs['id']['techStack']]?.map(
                          tech => (
                            <p key={tech}>{tech}</p>
                          ),
                        )}
                      </div>
                    ))}
                  </div>
                }
              </td>
              <td>  
                {job.description}
                {/* This is the  dynamic route to show only that one job's information */}
                <Link to={`/${id}`} state={{ jobTitle: job.jobTitle, description: job.description, techStack: job.techStack, company: job.company}}> 
                  View More 
                </Link>
                {/* This will trigger the handleDelete function */}
                <button type='button' id={id} onClick={(event) => handleDelete(event)}> Delete </button>

              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default JobTrackerTable;
