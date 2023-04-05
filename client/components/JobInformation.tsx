import React, {useEffect} from 'react';
import { useParams, useLocation } from 'react-router-dom';

type LocationProps = {
  jobTitle: string,
  description: string,
  company: string,
  techStack: {
    BackEnd?: string[];
    CICD?: string[];
    Language?: string[];
    FrontEnd?: string[];
    Testing?: string[];
  }
}


function JobInformation(): JSX.Element {
  // this is coming from the state we passed through the Link component
  // in JobTrackerTable, line 97
  let location = useLocation();
  let state : LocationProps= location.state; 

  // this should let us access params, so math.params.id that 
  // we have as a variable in the path /:id outlined in index.tsx
  // https://stackoverflow.com/questions/70378978/react-typescript-module-react-router-dom-has-no-exported-member-routecompo
  const { id } = useParams();

  // when the api is developed, this hook will run when the page initially loads
  useEffect(() => {
    const getJobDetails = async() => {
      // const result = fetch(`api/job/${id}`) GET Request for one job using the id
      // ^ ask for jobTitle, techStack, description, company
    };
    getJobDetails();
  }, []);

  return ( 
    <>
      <h1> { state.jobTitle } </h1> 
      <h3>  {state.company } </h3>
      <p style={{float: 'left', width: '50%'}}> { state.description } </p>
      
      <div>
        {Object.keys(state.techStack).map(techStackType=> (
            <div key={techStackType}>
                  <p>{techStackType} :</p>
                    {
                      state.techStack[techStackType as keyof LocationProps['techStack']]?.map(tech => {
                        return <p key={tech}> {tech} </p>
                      })
                    }
        </div>))}
      </div>
    </>
     
     
    );
}
export default JobInformation;
