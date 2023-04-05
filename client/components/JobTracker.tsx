import React, { useEffect, useRef, useState } from 'react';
// import { mockData, mockDataUpdate } from '../assets/dummyData';
import JobTrackerTable from './JobTrackerTable';
import Loading from './Loading';

type JobTrackerProps = {
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  applied: boolean;
  setApplied: React.Dispatch<React.SetStateAction<boolean>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
};
export type jobs = {
  [id: string]: {
    jobTitle: string;
    jobLink: string;
    company: string;
    submissionDate: string;
    status: string;
    sentThankYouNote: boolean;
    resume: boolean;
    coverLetter: boolean;
    minSalary: number | null;
    maxSalary: number | null;
    techStack: {
      BackEnd?: string[];
      CICD?: string[];
      Language?: string[];
      FrontEnd?: string[];
      Testing?: string[];
    };
    description: string;
  };
};

function JobTracker(props: JobTrackerProps): JSX.Element {
  // -------------------- INITIALIZE STATE & EXTRACT PROPS ---------------------
  const { url, setUrl, applied, setApplied, submitted, setSubmitted } = props;
  // store the state of the object containing all the currently tracked jobs
  const [jobs, setJobs] = useState<jobs>({});

  // ---------------------------- SIDE EFFECT ----------------------------------
  // Make a fetch request to /api/job when Submit button is clicked
  // input: the new job from submitting the form
  // output of the fetch: all the jobs (including the new job)
  useEffect(() => {
    const PostJob = async () => {
      if (submitted) {
        console.log('submitted');
        // POST - send new job as a part of request, get back a response of all the jobs (including the new job)
        let results = await fetch('/api/job', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url,
            applied,
          }),
        });
        const newJobData = await results.json();
        setJobs(newJobData);
        // setJobs(mockDataUpdate); // two jobs
        // Reset Application Form states:
        setUrl('');
        setApplied(true);
        setSubmitted(false);
      }
    };
    PostJob();
  }, [submitted]);

  useEffect(() => {
    const getJobs = async () => {
      // GET - get all jobs (belonging to this user? - stretch)
      let results = await fetch('/api/job');
      const newJobData = await results.json();
      setJobs(newJobData);
    };
    getJobs();
  }, []);

  return (
    <div
      id='job-tracker'
      className='flex flex-col items-center bg-lime-100 border-2 w-full p-10 font-mono space-y-10 rounded-3xl'
    >
      {Object.keys(jobs).length > 0 ? (
        <JobTrackerTable jobs={jobs} setJobs={setJobs} />
      ) : (
        <Loading />
      )}
    </div>
  );
}
export default JobTracker;
