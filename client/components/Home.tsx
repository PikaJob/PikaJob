import React, { useState } from 'react';
import ApplicationForm from './ApplicationForm';
import JobTracker from './JobTracker';

function Home(): JSX.Element {
  // create state for url (string)
  const [url, setUrl] = useState('');
  // create state for applied (boolean)
  const [applied, setApplied] = useState(true);
  // ^ need this for applicationForm, so to transfer that info to jobTracker
  const [submitted, setSubmitted] = useState(false);

  // get currently tracked jobs
  //

  return (
    <div id='home' className='flex justify-center py-10 text-lg md:text-xl'>
      <div className='flex flex-col items-center border-2 space-y-10 w-4/5 p-10 rounded-3xl'>
        <ApplicationForm
          setUrl={setUrl}
          url={url}
          applied={applied}
          setApplied={setApplied}
          setSubmitted={setSubmitted}
        />
        <JobTracker
          url={url}
          setUrl={setUrl}
          applied={applied}
          setApplied={setApplied}
          submitted={submitted}
          setSubmitted={setSubmitted}
        />
      </div>
    </div>
  );
}
export default Home;
