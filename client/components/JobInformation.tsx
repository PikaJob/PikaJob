import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

type LocationProps = {
  jobTitle: string;
  jobLink: string;
  description: string;
  company: string;
  techStack: {
    BackEnd?: string[];
    CICD?: string[];
    Language?: string[];
    FrontEnd?: string[];
    Testing?: string[];
  };
  sentThankYouNote: boolean;
  sentResume: boolean;
  sentCoverLetter: boolean;
};

function JobInformation(): JSX.Element {
  // this is coming from the state we passed through the Link component
  // in JobTrackerTable, line 97
  let location = useLocation();
  let state: LocationProps = location.state;

  // this should let us access params, so math.params.id that
  // we have as a variable in the path /:id outlined in index.tsx
  // https://stackoverflow.com/questions/70378978/react-typescript-module-react-router-dom-has-no-exported-member-routecompo
  const { id } = useParams();

  // when the api is developed, this hook will run when the page initially loads
  useEffect(() => {
    const getJobDetails = async () => {
      // const result = fetch(`api/job/${id}`) GET Request for one job using the id
      // ^ ask for jobTitle, techStack, description, company
    };
    getJobDetails();
  }, []);

  return (
    <div
      id='job-information'
      className=' flex flex-col items-center bg-salmon/50 border-2 w-4/5 mt-10 py-10 px-28 m-auto font-mono space-y-10 rounded-3xl'
    >
      <button className='mt-3 bg-transparent bg-green-100 font-semibold  py-2 px-6 border hover:border-transparent rounded-lg self-start'>
        <Link to={`/`}>Back</Link>
      </button>
      <a className='font-bold text-5xl' href={state.jobLink}>
        {' '}
        {state.jobTitle}{' '}
      </a>
      <h3 className='text-3xl'> {state.company} </h3>
      <div className='text-lg'>
        <h4 className='text-2xl font-bold pt-3'>Description</h4>
        <p className='text-justify'> {state.description} </p>

        <h4 className='text-2xl font-bold pt-3'>Tech Stack</h4>
        <div>
          {Object.keys(state.techStack).map(techStackType => (
            <div key={techStackType}>
              <p className='font-bold pt-2'>{techStackType}:</p>
              <ul className='list-disc list-inside'>
                {state.techStack[techStackType as keyof LocationProps['techStack']]?.map(tech => (
                  <li className='px-5' key={tech}>
                    {' '}
                    {tech}{' '}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h4 className='text-2xl font-bold pt-3'>Progress</h4>
        <div>
          <span>Sent Thank You Note?</span>
          <input type='checkbox' checked={state.sentThankYouNote}></input>
        </div>
        <div>
          <span>Sent Resume?</span>
          <input type='checkbox' checked={state.sentResume}></input>
        </div>
        <div>
          <span>Sent Cover Letter?</span>
          <input type='checkbox' checked={state.sentCoverLetter}></input>
        </div>
      </div>
    </div>
  );
}
export default JobInformation;
