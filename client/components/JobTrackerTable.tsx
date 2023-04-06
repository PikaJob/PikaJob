import React from 'react';
import { jobs } from './JobTracker';
import { Link } from 'react-router-dom';
type JobTrackerTableProps = {
  jobs: jobs;
  setJobs: React.Dispatch<React.SetStateAction<jobs>>;
};
const headersTitle = [
  // 'Title',
  // 'Company',
  'Position',
  'Description',
  'Status',
  // 'Sent Thank You Note',
  // 'Resume',
  // 'Cover Letter',
  // 'Min Salary',
  // 'Max Salary',
  'Salary',
  'Tech Stack',
  'Submission Date',
];
function JobTrackerTable(props: JobTrackerTableProps) {
  const { jobs, setJobs } = props;
  // This will send a fetch request (method: delete) to the backend, receiving all the jobs except for the deleted one
  function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    const button = event.target as HTMLButtonElement;
    let id: string = button.getAttribute('id')!;
    const newJob = { ...jobs };
    delete newJob[id];
    setJobs(newJob);
    fetch(`/api/job/${id}`, { method: 'DELETE' }); //method is DELETE, with id as paramter
    // retrieve remainingJobs and then do setJobs(remainingJobs)
    // remove that from job
  }

  return (
    <table className=' w-full'>
      <thead>
        <tr>
          {headersTitle.map(header => (
            <th className='p-1 border-2 border-slate-500' key={header}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(jobs).map(([id, job]) => {
          return (
            <tr key={id}>
              <td className='w-1/12 text-center p-1 border-2 border-slate-500'>
                <a href={job.jobLink} className='font-bold'>
                  {job.jobTitle}
                </a>{' '}
                <br></br> <p> {job.company} </p>
              </td>
              {/* <td className='w-1/12 text-center p-1 border-2 border-slate-500'>{job.company}</td> 
                ^ Commented out because we want to combine job title and company into one column
              */}

              <td className='w-1/12 text-center p-1 border-2 border-slate-500'>
                <p className='line-clamp-6'> {job.description} </p>
                {/* This is the  dynamic route to show only that one job's information */}
                <button className='mt-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
                  <Link
                    to={`/${id}`}
                    state={{
                      jobTitle: job.jobTitle,
                      jobLink: job.jobLink,
                      description: job.description,
                      techStack: job.techStack,
                      company: job.company,
                      sentThankYouNote: job.sentThankYouNote,
                      sentResume: job.resume,
                      sentCoverLetter: job.coverLetter
                    }}
                  >
                    View More
                  </Link>
                </button>
                {/* This will trigger the handleDelete function */}
                <button
                  type='button'
                  id={id}
                  onClick={event => handleDelete(event)}
                  className='mt-3 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded'
                >
                  Delete
                </button>
              </td>
              <td className='w-1/12 text-center p-1 border-2 border-slate-500'>{job.status}</td>
              <td className='w-1/12 text-center p-1 border-2 border-slate-500'>
                {job.minSalary && job.maxSalary
                  ? `${job.minSalary.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                    })} 
                     -
                     ${job.maxSalary.toLocaleString('en-US', {
                       style: 'currency',
                       currency: 'USD',
                       maximumFractionDigits: 0,
                     })}`
                  : 'N/A'}
              </td>
              {/* <td>
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
              </td> */}
              {/* <td>
                <input type='checkbox' checked={job.sentThankYouNote} readOnly />
              </td>
              <td>
                <input type='checkbox' checked={job.resume} readOnly />
              </td>
              <td>
                <input type='checkbox' checked={job.coverLetter} readOnly />
              </td> */}
              <td className='p-1 border-2 border-slate-500'>
                {
                  <div>
                    {Object.keys(job.techStack).map(techStackType => {
                      return (
                        <div key={techStackType}>
                          <p className='font-bold pt-2'>{techStackType}</p>
                          {/* replaced map with flatMap method to get rid of duplicate techs being listed 
                              React kept giving warnings because of duplicate keys 
                              Return an empty array means that nothing will be added to the array in the current iteration
                              https://stackoverflow.com/questions/24806772/how-to-skip-over-an-element-in-map
                          */}
                          {job.techStack[techStackType as keyof jobs['id']['techStack']]?.map(
                            tech => (
                              <span className='py-0' key={tech}>
                                {tech},{' '}
                              </span>
                            ),
                          )}
                        </div>
                      );
                    })}
                  </div>
                }
              </td>
              <td className='w-1/12 text-center p-1 border-2 border-slate-500'>
                {job.submissionDate}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default JobTrackerTable;
