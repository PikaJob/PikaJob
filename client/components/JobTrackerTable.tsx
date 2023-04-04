import React from 'react';
import { jobs } from './JobTracker';
type JobTrackerTableProps = {
  jobs: jobs;
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
  const { jobs } = props;
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
              <td>{job.description}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default JobTrackerTable;
