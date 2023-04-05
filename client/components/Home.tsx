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
    <div id="home">
      <ApplicationForm
        setUrl={setUrl}
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
  );
}
export default Home;
