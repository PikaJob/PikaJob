import React from 'react';
import ApplicationForm from './ApplicationForm';
import JobTracker from './JobTracker';

function Home(): JSX.Element {
  return (
    <>
      <ApplicationForm />
      <JobTracker />
    </>
  );
}
export default Home;
