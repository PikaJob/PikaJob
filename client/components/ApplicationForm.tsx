import React, { ChangeEvent, MouseEvent } from 'react';
type ApplicationFormProps = {
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  applied: boolean;
  setApplied: React.Dispatch<React.SetStateAction<boolean>>;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
};

function ApplicationForm(props: ApplicationFormProps): JSX.Element {
  // ------------------- INTIALIZE STATE & EXTRACT PROPS -----------------------
  const { setUrl, applied, setApplied, setSubmitted } = props;

  // ------------------------- HANDLE CLICK METHODS ----------------------------

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newUrl: string = event.target.value;
    setUrl(newUrl);
  };

  const handleAppliedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newApplied: boolean = event.target.checked;
    setApplied(newApplied);
  };

  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSubmitted(true);
  }; 

  // ---------------------------- RENDER COMPONENT -----------------------------
  return (
    <form id="addJobForm">
      <h3> Add an Application </h3>
      <input type='text' name='url' id='url' placeholder='url' onChange={handleUrlChange}></input>

      <div id="checkboxAndSubmit">
        <span>
        <label htmlFor='applied'>Applied</label>
          <input
            type='checkbox'
            name='applied'
            id='applied'
            onChange={handleAppliedChange}
            checked={applied}
          ></input>
        </span>

        <button type='submit' onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </form>
  );
}
export default ApplicationForm;
